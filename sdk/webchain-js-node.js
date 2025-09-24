// === WebChain JS Node (Ably signaling + AJAX fallback) ===
// --- Ably config (leave empty to use AJAX-only) ---
const ABLY_API_KEY = 'YOUR API KEY '; // e.g. "xxxxx:yyyyyyyyyyyy"

let ablyRealtime = null;
let ablyChannel = null;
let ablyReady = false;

// === WebRTC & Blockchain Peer Setup ===

let peerConnection = null;
let dataChannel = null;
let activeChatConnection = null;
const knownPeers = new Set();
const connectedPeers = new Map();

const myPeerId = 'peer_' + Math.random().toString(36).substring(2, 10);
const peerConnectionMap = new Map();

// Chat-specific variables
const chatMessages = new Map(); 
let currentChatPeer = null;

const config = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

// ---------- Ably helpers ----------
async function initAblyIfPossible() {
    try {
        if (!ABLY_API_KEY || ABLY_API_KEY.startsWith('<')) return;
        if (typeof Ably === 'undefined') return;

        // Use Promise API for clean awaits
        ablyRealtime = new Ably.Realtime.Promise({ key: ABLY_API_KEY, clientId: myPeerId });
        await ablyRealtime.connection.once('connected');
        ablyChannel = ablyRealtime.channels.get('webchain-signaling');
        await ablyChannel.attach();
        await ablyChannel.presence.enter({ peerId: myPeerId });

        // Subscribe to signaling messages
        ablyChannel.subscribe(msg => {
            const { name, data } = msg;
            const to = data?.to ?? null;
            const from = data?.from ?? null;
            const payload = data?.payload ?? null;

            // ignore our own or messages not for us (if targeted)
            if (from === myPeerId) return;
            if (to && to !== myPeerId) return;

            switch (name) {
                case 'offer': {
                    const pc = createPeerConnection(from, false);
                    pc.setRemoteDescription(new RTCSessionDescription(payload))
                      .then(() => pc.createAnswer())
                      .then(answer => pc.setLocalDescription(answer))
                      .then(() => sendSignal(from, 'answer', pc.localDescription))
                      .catch(err => console.error('Ably/offer error:', err));
                    break;
                }
                case 'answer': {
                    const pc = peerConnectionMap.get(from);
                    if (pc) pc.setRemoteDescription(new RTCSessionDescription(payload))
                        .catch(err => console.error('Ably/answer error:', err));
                    break;
                }
                case 'ice': {
                    const pc = peerConnectionMap.get(from);
                    if (pc) pc.addIceCandidate(new RTCIceCandidate(payload))
                        .catch(err => console.error('Ably/ice error:', err));
                    break;
                }
                case 'announce': {
                    if (!knownPeers.has(from) && from !== myPeerId) {
                        knownPeers.add(from);
                        if (!peerConnectionMap.has(from) ||
                            peerConnectionMap.get(from).connectionState === 'disconnected') {
                            createPeerConnection(from, true);
                        }
                        updatePeerUI();
                    }
                    break;
                }
            }
        });

        ablyReady = true;
        console.log('Ably connected: using Ably for signaling.');
    } catch (e) {
        console.warn('Ably init failed; continuing with AJAX signaling.', e);
        ablyReady = false;
    }
}

// Send a signaling message via Ably when ready, otherwise fall back AJAX endpoints
function sendSignal(toPeerId, type, data) {
    if (ablyReady && ablyChannel) {
        ablyChannel.publish({ name: type, data: { to: toPeerId, from: myPeerId, payload: data } })
            .catch(err => console.error('Ably publish error:', err));
    } else {
        // AJAX fallback 
        let action = '';
        if (type === 'ice') action = 'webchain_signal_ice';
        if (type === 'offer') action = 'webchain_signal_offer';
        if (type === 'answer') action = 'webchain_signal_answer';
        if (!action) return;
        sendAjax(action, { peerId: toPeerId, [type]: data });
    }
}

// ---------- End Ably helpers ----------


// Webchain blockchain and chat channels
function createPeerConnection(peerId = null, isInitiator = false) {
    // Prevent duplicate connections
    if (peerConnectionMap.has(peerId)) {
        const existingPc = peerConnectionMap.get(peerId);
        if (['connected', 'connecting'].includes(existingPc.connectionState)) {
            return existingPc;
        }
    }

    const config = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
        ],
        iceTransportPolicy: 'all'
    };

    const pc = new RTCPeerConnection(config);

    pc.onconnectionstatechange = () => {
        console.log(`${peerId} connection state: ${pc.connectionState}`);
        if (pc.connectionState === 'disconnected') {
            setTimeout(() => {
                if (pc.connectionState === 'disconnected') {
                    reconnectPeer(peerId);
                }
            }, 3000);
        }
    };

    pc.onicecandidate = event => {
        if (event.candidate && peerId) {
            //route through Ably when ready, else AJAX
            sendSignal(peerId, 'ice', event.candidate);
        }
    };

    pc.ondatachannel = event => {
        const receiveChannel = event.channel;
        if (receiveChannel.label === 'webchain') {
            setupDataChannel(receiveChannel, peerId);
        } else if (receiveChannel.label === 'chat') {
            setupChatChannel(receiveChannel, peerId);
        }
    };

    if (isInitiator) {
        // Main webchain blockchain data channel
        const dc = pc.createDataChannel("webchain");
        setupDataChannel(dc, peerId);
        dataChannel = dc;

        // Create chat channel if initiating chat
        if (currentChatPeer === peerId) {
            const chatDc = pc.createDataChannel("chat", {
                negotiated: true,
                id: 1,
                ordered: true
            });
            setupChatChannel(chatDc, peerId);
        }

        pc.createOffer().then(offer => {
            pc.setLocalDescription(offer);
            sendSignal(peerId, 'offer', offer);
        });
    }

    peerConnectionMap.set(peerId, pc);
    return pc;
}

function reconnectPeer(peerId) {
    if (peerConnectionMap.has(peerId)) {
        peerConnectionMap.get(peerId).close();
    }
    createPeerConnection(peerId, true);
}


// function to handle chat channels 
function setupChatChannel(channel, peerId) {
    const pc = peerConnectionMap.get(peerId);
    if (pc) {
        pc.chatDataChannel = channel;
        activeChatConnection = { pc, channel };
    }
    
    channel.onopen = () => {
        console.log(`✅ Chat connected to ${peerId}`);
        updateChatStatus('Connected');
        // Add heartbeat to keep connection alive
        const hb = setInterval(() => {
            if (channel.readyState === 'open') {
                channel.send(JSON.stringify({ type: 'heartbeat' }));
            } else {
                clearInterval(hb);
            }
        }, 15000);
    };

    channel.onmessage = event => {
        const message = JSON.parse(event.data);
        if (message.type === 'chat') {
            handleChatMessage(peerId, message.text);
        }
    };

    channel.onclose = () => {
        console.log(`⚠️ Chat with ${peerId} disconnected`);
        updateChatStatus('Disconnected');
    };

    channel.onerror = error => {
        console.error(`Chat error with ${peerId}:`, error);
        updateChatStatus('Error');
    };
}

//function to handle incoming chat messages
function handleChatMessage(peerId, text) {
    console.log(`💬 Chat from ${peerId}: ${text}`);
    
    // Store message in history
    if (!chatMessages.has(peerId)) {
        chatMessages.set(peerId, []);
    }
    chatMessages.get(peerId).push({
        text,
        isOutgoing: false,
        timestamp: new Date().toISOString()
    });
    
    // Update UI if chat is open with this peer
    if (currentChatPeer === peerId) {
        addMessageToChat(text, false);
    }
}

// function to send chat messages
function sendChatMessage(text, peerId) {
    if (!text.trim() || !peerId) return;
    
    const message = {
        type: 'chat',
        text: text.trim()
    };
    
    // Try dedicated chat channel first
    const pc = peerConnectionMap.get(peerId);
    if (pc && pc.chatDataChannel && pc.chatDataChannel.readyState === 'open') {
        pc.chatDataChannel.send(JSON.stringify(message));
    } 
    // Fallback to main data channel
    else if (connectedPeers.has(peerId)) {
        connectedPeers.get(peerId).send(JSON.stringify(message));
    } else {
        console.warn("No active connection to peer", peerId);
        return;
    }
    
    // Store outgoing message
    if (!chatMessages.has(peerId)) {
        chatMessages.set(peerId, []);
    }
    chatMessages.get(peerId).push({
        text: text.trim(),
        isOutgoing: true,
        timestamp: new Date().toISOString()
    });
    
    // Update UI if chat is open
    if (currentChatPeer === peerId) {
        addMessageToChat(text.trim(), true);
    }
}


// Poll AJAX signaling 
function pollSignals() {
    if (ablyReady) return; 
    if (document.hidden) return;

    const url = wp.ajax_url;
    fetch(`${url}?action=webchain_signal_all&peerId=${myPeerId}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Handle offers
                if (data.offer && data.from) {
                    const pc = createPeerConnection(data.from, false);
                    pc.setRemoteDescription(new RTCSessionDescription(data.offer)).then(() => {
                        return pc.createAnswer();
                    }).then(answer => {
                        pc.setLocalDescription(answer);
                        sendAjax('webchain_signal_answer', {
                            peerId: data.from,
                            answer: JSON.stringify(answer),
                            nonce: webchain_nonce
                        });
                    });
                }
                // Handle answers
                if (data.answer && data.from) {
                    const pc = peerConnectionMap.get(data.from);
                    if (pc) {
                        pc.setRemoteDescription(new RTCSessionDescription(data.answer));
                    }
                }
                // Handle ICE candidates
                if (data.candidates && data.from) {
                    const pc = peerConnectionMap.get(data.from);
                    data.candidates.forEach(candidate => {
                        if (pc) pc.addIceCandidate(new RTCIceCandidate(candidate));
                    });
                }
            }
        })
        .catch(err => console.error('Error in pollSignals:', err));
}

function handlePeerMessage(message, peerId) {
    switch (message.type) {
        case 'chain_sync':
            console.log(`⛓️ Chain sync from ${peerId}`, message.chain);
            if (document.getElementById("chain-output")) {
                document.getElementById("chain-output").textContent = JSON.stringify(message.chain, null, 2);
            }
            break;

        case 'transaction':
            console.log(`💸 Received transaction from ${peerId}`, message.tx);
            sendAjax('webchain_new_tx', { transaction: JSON.stringify(message.tx) }, () => {
                fetchChain();
            });
            break;

        case 'new_block':
            console.log(`🧱 New block from ${peerId}`, message.block);
            sendAjax('webchain_new_block', { block: JSON.stringify(message.block) });
            break;
            
        case 'announce':
            console.log(`📢 Peer ${peerId} announced itself`);
            break;
    }
}

function announcePresence() {
    // Keep for compatibility
    if (ablyReady && ablyChannel) {
        ablyChannel.publish({ name: 'announce', data: { from: myPeerId } }).catch(()=>{});
    } else {
        broadcastMessage({ type: 'announce' });
    }
}

function broadcastMessage(message) {
    connectedPeers.forEach((channel, peerId) => {
        if (channel.readyState === "open") {
            channel.send(JSON.stringify(message));
        }
    });
}

function fetchChain() {
    fetch('/wp-admin/admin-ajax.php?action=webchain_sync_chain')
        .then(res => res.json())
        .then(data => {
            if (data.success && document.getElementById("chain-output")) {
                document.getElementById("chain-output").textContent = JSON.stringify(data.data.chain, null, 2);
            }
        })
        .catch(err => console.error('Error in fetchChain:', err));
}

// === Auto-discover & connect to other peers ===
async function discoverPeers() {
    if (document.hidden) return; 

    if (ablyReady && ablyChannel) {
        try {
            // Use Ably Presence for discovery
            const members = await ablyChannel.presence.get();
            const peers = members
                .map(m => m.clientId || m.data?.peerId)
                .filter(id => id && id !== myPeerId);

            peers.forEach(peerId => {
                if (!knownPeers.has(peerId)) knownPeers.add(peerId);
                if (!peerConnectionMap.has(peerId) || 
                    peerConnectionMap.get(peerId).connectionState === 'disconnected') {
                    createPeerConnection(peerId, true);
                }
            });

            //announce ping
            ablyChannel.publish({ name: 'announce', data: { from: myPeerId } }).catch(()=>{});

            updatePeerUI();
            return;
        } catch (e) {
            console.warn('Ably discover failed; falling back to AJAX discover', e);
        }
    }
    
    // AJAX discovery
    sendAjax('webchain_list_peers', {}, res => {
        if (res.success && Array.isArray(res.peers)) {
            res.peers.forEach(peerId => {
                if (!knownPeers.has(peerId) && peerId !== myPeerId) {
                    knownPeers.add(peerId);
                    // Only connect if not already connected
                    if (!peerConnectionMap.has(peerId) || 
                        peerConnectionMap.get(peerId).connectionState === 'disconnected') {
                        createPeerConnection(peerId, true);
                    }
                }
            });
        }
        updatePeerUI();
    });
}


// === Update UI with Connected Peers ===
function updatePeerUI() {
    const peerList = Array.from(connectedPeers.keys());
    const el = document.getElementById("peerList");
    if (el) {
        el.textContent = peerList.length > 0 ? peerList.join(", ") : "No active peers.";
    }

    const status = document.getElementById("peerStatus");
    if (status) {
        status.className = "status-dot " + (peerList.length > 0 ? "green" : "red");
    }
}


// === Send Block to All Peers ===
function sendBlock(block) {
    sendAjax('webchain_new_block', { block: JSON.stringify(block) }, () => {
        broadcastMessage({ type: 'new_block', block });
        console.log("Block broadcasted");
    });
}

// ===AJAX ===
function sendAjax(action, data, callback = () => {}) {
    const formData = new FormData();
    formData.append('action', action);
    formData.append('nonce', webchain_nonce || '');
    for (const key in data) {
        formData.append(key, typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]);
    }

    fetch('/wp-admin/admin-ajax.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(callback)
    .catch(err => console.error(`Error in ${action}:`, err));
}

// === Auto-run ===
document.addEventListener('DOMContentLoaded', () => {
    // Try to enable Ably; if not configured or not loaded, we keep using AJAX seamlessly.
    initAblyIfPossible();

    sendAjax('webchain_register_peer', { peerId: myPeerId }, () => {
        discoverPeers();
    });
    const discoverInterval = setInterval(discoverPeers, 60000); 

    // Poll AJAX signaling only when Ably is NOT active (pollSignals() will auto-skip if AblyReady)
    const pollInterval = setInterval(pollSignals, 45000);      // every 45 sec

    window.addEventListener('unload', () => {
        clearInterval(discoverInterval);
        clearInterval(pollInterval);
        try { ablyChannel && ablyChannel.presence.leave(); } catch (e) {}
    });
});
