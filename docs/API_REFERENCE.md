# WebChain API Reference

**Version 2.1** | Last updated: August 16, 2025

## Overview

WebChain is a high-performance, decentralized blockchain platform powering the E-TALK IKỌBỌ MARKETPLACE, enabling seamless e-commerce integration for global transactions. Built with WebRTC for direct peer-to-peer validator communication and EVM Wallets compatibility.

**Base URL:** `https://e-talk.xyz/wp-json/webchain/v1`

## Core Endpoints

### JSON-RPC Endpoint
- **URL:** `/rpc`
- **Method:** POST
- **Description:** Full Ethereum-compatible JSON-RPC endpoint for MetaMask integration
- **Chain ID:** 1000001 (0xF4241)

#### Supported Methods
| Method | Status | Description |
|--------|--------|-------------|
| `eth_chainId` | ✅ | Returns chain ID |
| `net_version` | ✅ | Returns network version |
| `eth_getBalance` | ✅ | Returns account balance |
| `eth_sendTransaction` | ✅ | Processes signed transactions |
| `eth_sendRawTransaction` | ✅ | Processes signed transactions |
| `eth_getTransactionReceipt` | ✅ | Returns transaction details |
| `eth_blockNumber` | ✅ | Returns latest block number |
| `eth_getBlockByNumber` | ✅ | Returns block information |
| `eth_getTransactionCount` | ✅ | Returns account nonce |

### Validator Endpoints

#### Verify Validator
- **URL:** `/verify-validator`
- **Method:** POST
- **Description:** Verifies a user's validator status
- **Authentication:** Required

#### Process Order
- **URL:** `/process-order`
- **Method:** POST
- **Description:** Processes WooCommerce orders on the blockchain
- **Authentication:** Required

#### Mining Events
- **URL:** `/mining-events`
- **Method:** GET
- **Description:** Returns mining events information

## DEX API Endpoints

# WebChain API Endpoints

## Public Endpoints

- **Get Chain Information**
  - **URL:** `/webchain/v1`
  - **Method:** GET
  - **Description:** Retrieves information about the WebChain namespace and available endpoints

- **JSON-RPC Endpoint**
  - **URL:** `/rpc`
  - **Method:** POST
  - **Description:** Full Ethereum-compatible JSON-RPC endpoint for MetaMask integration, supporting methods like `eth_chainId`, `net_version`, `eth_getBalance`, `eth_sendTransaction`, `eth_sendRawTransaction`, `eth_getTransactionReceipt`, `eth_blockNumber`, `eth_getBlockByNumber`, and `eth_getTransactionCount`

- **Mining Events**
  - **URL:** `/mining-events`
  - **Method:** GET
  - **Description:** Retrieves information about mining events

- **Get ETK Price**
  - **URL:** `/price/etk`
  - **Method:** GET
  - **Description:** Retrieves the current price of ETK token

- **Get All Pools**
  - **URL:** `/dex/pools`
  - **Method:** GET
  - **Description:** Retrieves a list of all liquidity pools

- **Get Pool Information**
  - **URL:** `/dex/pool/{token_a}/{token_b}`
  - **Method:** GET
  - **Description:** Retrieves details for a specific liquidity pool

- **Get Trade History**
  - **URL:** `/dex/history`
  - **Method:** GET
  - **Description:** Retrieves trade history for a wallet or globally
  - **Query Parameters:**
    - `wallet`: string (optional) - Wallet address to filter trades
    - `limit`: number (optional, default: 50) - Number of trade records to return

- **Get Swap Quote**
  - **URL:** `/dex/quote`
  - **Method:** GET
  - **Description:** Retrieves a quote for swapping tokens
  - **Query Parameters:**
    - `input_token`: string (required) - Token to swap from
    - `output_token`: string (required) - Token to swap to
    - `input_amount`: number (required) - Amount of input token

- **Get Wallet Balances**
  - **URL:** `/wallet/{wallet}/all-balances`
  - **Method:** GET
  - **Description:** Retrieves all token balances for a specified wallet

- **Get Token Balances**
  - **URL:** `/wallet/{wallet}/balances`
  - **Method:** GET
  - **Description:** Retrieves token balances for a specified wallet

- **Get All Tokens**
  - **URL:** `/tokens/all-with-etk`
  - **Method:** GET
  - **Description:** Retrieves a list of all tokens paired with ETK

- **Get Volume for Pair**
  - **URL:** `/dex/volume-pair/{token_a}/{token_b}`
  - **Method:** GET
  - **Description:** Retrieves trading volume for a specific token pair

- **Get Token Volume**
  - **URL:** `/dex/volume/{token}`
  - **Method:** GET
  - **Description:** Retrieves trading volume for a specific token
  - **Query Parameters:**
    - `days`: number (optional, default: 7, max: 30) - Time period for volume data

- **Market Summary**
  - **URL:** `/market/summary`
  - **Method:** GET
  - **Description:** Retrieves a summary of market data

- **Pair Data**
  - **URL:** `/market/pair/{pair_id}`
  - **Method:** GET
  - **Description:** Retrieves data for a specific trading pair

- **Historical Data**
  - **URL:** `/market/history/{pair_id}`
  - **Method:** GET
  - **Description:** Retrieves historical data for a specific trading pair
  - **Query Parameters:**
    - `interval`: number (required) - Time interval in hours or days

- **Get Trading Pairs**
  - **URL:** `/dex/pairs`
  - **Method:** GET
  - **Description:** Retrieves a list of all trading pairs

- **CMC Metadata**
  - **URL:** `/cmc/metadata`
  - **Method:** GET
  - **Description:** Retrieves metadata from CoinMarketCap integration

- **CMC Listings**
  - **URL:** `/cmc/listings`
  - **Method:** GET
  - **Description:** Retrieves token listings from CoinMarketCap integration

- **CoinGecko Market Data**
  - **URL:** `/coingecko/market`
  - **Method:** GET
  - **Description:** Retrieves market data from CoinGecko integration

- **WUSD Reserve**
  - **URL:** `/wusd-reserve`
  - **Method:** GET
  - **Description:** Retrieves information about the WUSD reserve

- **DEX Fee Earnings**
  - **URL:** `/dex/fee-earnings`
  - **Method:** GET
  - **Description:** Retrieves fee earnings data for the DEX

- **Fear & Greed Index**
  - **URL:** `/fear-greed`
  - **Method:** GET
  - **Description:** Retrieves the current Fear & Greed Index

- **Get Token Info for MetaMask**
  - **URL:** `/tokens/{id}/metamask`
  - **Method:** GET
  - **Description:** Retrieves token information formatted for MetaMask integration

- **Network Information**
  - **URL:** `/network`
  - **Method:** GET
  - **Description:** Retrieves information about the WebChain network (e.g., status, version, consensus)

## Authenticated Endpoints

- **Verify Validator**
  - **URL:** `/verify-validator`
  - **Method:** POST
  - **Description:** Verifies a user's validator status
  - **Authentication:** Required
  - **Body:**
    ```json
    {
      "validator_id": "string",
      "signature": "string"
    }
    ```

- **Process Order**
  - **URL:** `/process-order`
  - **Method:** POST
  - **Description:** Processes WooCommerce orders on the blockchain
  - **Authentication:** Required
  - **Body:**
    ```json
    {
      "user_email": "validator@e-talk.xyz",
      "wallet": "0x1234567890abcdef1234567890abcdef12345678",
      "order_data": {
        "order_id": 9999,
        "amount": 10.50,
        "currency": "USD",
        "customer": {
          "id": 1204,
          "email": "test@e-talk.xyz"
        },
        "items": [
          {
            "product_id": 111,
            "name": "Test Product",
            "quantity": 1,
            "price": 10.50
          }
        ]
      }
    }
    ```

- **Validator Actions**
  - **URL:** `/validator`
  - **Method:** POST
  - **Description:** Performs validator-specific actions
  - **Authentication:** Required
  - **Body:**
    ```json
    {
      "action": "string",
      "data": "object"
    }
    ```

- **Add Liquidity**
  - **URL:** `/dex/add-liquidity`
  - **Method:** POST
  - **Description:** Adds liquidity to a token pair pool
  - **Authentication:** Required
  - **Body:**
    ```json
    {
      "token_a": "string",
      "token_b": "string",
      "amount_a": "number",
      "amount_b": "number"
    }
    ```

- **Remove Liquidity**
  - **URL:** `/dex/remove-liquidity`
  - **Method:** POST
  - **Description:** Removes liquidity from a pool
  - **Authentication:** Required
  - **Body:**
    ```json
    {
      "pool_id": "string",
      "liquidity": "number"
    }
    ```

- **Swap Tokens**
  - **URL:** `/dex/swap`
  - **Method:** POST
  - **Description:** Executes a token swap
  - **Authentication:** Required
  - **Body:**
    ```json
    {
      "input_token": "string",
      "output_token": "string",
      "input_amount": "number",
      "min_output": "number"
    }
    ```

- **Get My Liquidity**
  - **URL:** `/dex/my-liquidity`
  - **Method:** GET
  - **Description:** Retrieves liquidity positions for the authenticated user
  - **Authentication:** Required

- **Debug My Liquidity**
  - **URL:** `/dex/debug-liquidity`
  - **Method:** GET
  - **Description:** Retrieves detailed debugging information for the authenticated user's liquidity positions
  - **Authentication:** Required

- **Set Wallet Address**
  - **URL:** `/wallet`
  - **Method:** POST
  - **Description:** Sets the wallet address for the authenticated user
  - **Authentication:** Required
  - **Body:**
    ```json
    {
      "wallet_address": "string"
    }
    ```

- **Get Wallet Address**
  - **URL:** `/wallet`
  - **Method:** GET
  - **Description:** Retrieves the wallet address for the authenticated user
  - **Authentication:** Required

## Admin Endpoints

- **Debug All Liquidity**
  - **URL:** `/dex/debug-all-liquidity`
  - **Method:** GET
  - **Description:** Retrieves detailed debugging information for all liquidity pools
  - **Authentication:** Required (Admin access)

## Exchange Integration API

- **Get User Balance**
  - **URL:** `/balance`
  - **Method:** GET
  - **Description:** Retrieves the balance for a specific user
  - **Query Parameters:**
    - `user_id`: number (required) - Unique user identifier
    - `check_validator`: boolean (required) - Whether to verify validator status
  - **Authentication:** Required

- **Off-chain to On-chain Transfer**
  - **URL:** `/transfer`
  - **Method:** POST
  - **Description:** Initiates an off-chain to on-chain transfer (requires OTP)
  - **Authentication:** Required
  - **Body:**
    ```json
    {
      "user_id": 1,
      "amount": 50.0,
      "validator_address": "0x..."
    }
    ```

- **On-chain Withdrawal to Off-chain**
  - **URL:** `/withdraw`
  - **Method:** POST
  - **Description:** Initiates an on-chain withdrawal to an off-chain account (requires OTP)
  - **Authentication:** Required
  - **Body:**
    ```json
    {
      "user_id": 1,
      "amount": 6.0,
      "to": "",
      "is_offchain": true,
      "validator_address": "0x..."
    }
    ```

- **On-chain Withdrawal to External Wallet**
  - **URL:** `/withdraw`
  - **Method:** POST
  - **Description:** Initiates an on-chain withdrawal to an external wallet (requires OTP)
  - **Authentication:** Required
  - **Body:**
    ```json
    {
      "user_id": 1,
      "amount": 1.0,
      "to": "0xExternalWalletAddressHere",
      "is_offchain": false,
      "validator_address": "0x..."
    }
    ```

- **Confirm Transaction with OTP**
  - **URL:** `/confirm_tx`
  - **Method:** POST
  - **Description:** Confirms a transaction using an OTP
  - **Authentication:** Required
  - **Body:**
    ```json
    {
      "user_id": 1,
      "otp": "dgXq8a"
    }
    ```

## Validator Layer (WVM-20) API

- **Create Token**
  - **URL:** `/tokens`
  - **Method:** POST
  - **Description:** Creates a new token
  - **Authentication:** Required
  - **Body:**
    ```json
    {
      "name": "string",
      "symbol": "string",
      "total_supply": "number",
      "decimals": "number"
    }
    ```

- **List Tokens**
  - **URL:** `/tokens`
  - **Method:** GET
  - **Description:** Retrieves a list of all tokens
  - **Authentication:** Required

- **Approve Token (Validators Only)**
  - **URL:** `/tokens/{id}/approve`
  - **Method:** POST
  - **Description:** Approves a token (restricted to validators)
  - **Authentication:** Required (Validator access)
  - **Body:**
    ```json
    {
      "status": "string",
      "validator_signature": "string"
    }
    ```

- **Transfer Tokens**
  - **URL:** `/tokens/{id}/transfer`
  - **Method:** POST
  - **Description:** Transfers tokens to another address
  - **Authentication:** Required
  - **Body:**
    ```json
    {
      "to": "string",
      "amount": "number"
    }
    ```

- **Mint Tokens (Creator Only)**
  - **URL:** `/tokens/{id}/mint`
  - **Method:** POST
  - **Description:** Mints additional tokens for a specific token (restricted to token creator)
  - **Authentication:** Required (Creator access)
  - **Body:**
    ```json
    {
      "amount": "number",
      "to": "string"
    }
    ```

## MetaMask Configuration
To integrate WebChain with MetaMask, use the following configuration:

```javascript
const webchainConfig = {
  chainId: '0xF4241', // 1000001 in hex
  chainName: 'WebChain',
  rpcUrls: ['https://e-talk.xyz/wp-json/webchain/v1/rpc'],
  blockExplorerUrls: ['https://e-talk.xyz/webchain/?tx='],
  nativeCurrency: {
    name: 'ikọbọ',
    symbol: 'ETK',
    decimals: 18
  }
};
