// webchain-sdk.js
const WebChainSDK = (function () {
  const RPC_URL = "https://rpc.webchain.e-talk.xyz";

  // Core function to make JSON-RPC calls
  async function rpc(method, params = []) {
    const payload = {
      jsonrpc: "2.0",
      id: Date.now(),
      method,
      params,
    };

    const res = await fetch(RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (json.error) throw new Error(json.error.message || "RPC Error");
    return json.result;
  }

  // Public Methods
  return {
    getBalance: async (address) => {
      return await rpc("eth_getBalance", [address, "latest"]);
    },

    sendRawTransaction: async (signedTx) => {
      return await rpc("eth_sendRawTransaction", [signedTx]);
    },

    getTransactionByHash: async (txHash) => {
      return await rpc("eth_getTransactionByHash", [txHash]);
    },

    getBlockByNumber: async (blockNumber = "latest", fullTxs = false) => {
      return await rpc("eth_getBlockByNumber", [blockNumber, fullTxs]);
    },

    call: async (callObject) => {
      return await rpc("eth_call", [callObject, "latest"]);
    },

    getChainId: async () => {
      return await rpc("eth_chainId");
    },

    // Custom WebChain additions (must)
    getValidators: async () => {
      return await rpc("webchain_getValidators");
    },

    getStatus: async () => {
      return await fetch(RPC_URL)
        .then(res => res.json())
        .catch(() => ({ status: "error", message: "Unable to reach RPC" }));
    }
  };
})();
