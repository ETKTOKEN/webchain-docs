# WebChain Integration Guidelines

**Version 2.1** | Last Updated: September 24, 2025

## Overview

This document outlines the procedures for integrating with WebChain, a high-performance, decentralized blockchain platform powering the E-Talk Ikọbọ Marketplace for seamless e-commerce transactions. Integration endpoints facilitate off-chain to on-chain transfers, on-chain withdrawals (to off-chain accounts or external wallets), and transaction confirmations. All integrations require authentication and OTP verification to ensure security and accountability. Detailed endpoint specifications, including request and response structures, are available in the [WebChain API Reference](./API_REFERENCE.md).

---

## 1. Off-Chain to On-Chain Transfer

**Endpoint:** `/transfer`  
**Method:** POST  
**Authentication:** Required  

**Description:** Initiates a transfer from an off-chain balance to an on-chain wallet, requiring OTP verification for secure processing.

**Reference:** See the [WebChain API Reference](./API_REFERENCE.md) for request body, response structures, and error codes.

---

## 2. On-Chain Withdrawal to Off-Chain Account

**Endpoint:** `/withdraw`  
**Method:** POST  
**Authentication:** Required  

**Description:** Initiates a withdrawal from an on-chain wallet to an off-chain account, requiring OTP verification for security.

**Reference:** See the [WebChain API Reference](./API_REFERENCE.md) for request body, response structures, and error codes.

---

## 3. On-Chain Withdrawal to External Wallet

**Endpoint:** `/withdraw`  
**Method:** POST  
**Authentication:** Required  

**Description:** Initiates a withdrawal from an on-chain wallet to an external wallet address, requiring OTP verification for secure processing.

**Reference:** See the [WebChain API Reference](./API_REFERENCE.md) for request body, response structures, and error codes.

---

## 4. Confirm Transaction with OTP

**Endpoint:** `/confirm_tx`  
**Method:** POST  
**Authentication:** Required  

**Description:** Confirms a transaction (e.g., transfer or withdrawal) using an OTP sent to the user, finalizing the integration process.

**Reference:** See the [WebChain API Reference](./API_REFERENCE.md) for request body, response structures, and error codes.

---

## 5. Integration with E-Talk Ikọbọ Marketplace

The WebChain integration endpoints support the E-Talk Ikọbọ Marketplace, a hybrid marketplace enabling seamless e-commerce transactions. These endpoints ensure secure fund transfers and withdrawals, leveraging WebChain’s Ethereum-compatible JSON-RPC endpoint (`/rpc`) for MetaMask integration and WebRTC for peer-to-peer validator communication. The WebChain network operates on the mainnet with chain ID `1000001` (0xF4241) and is powered by the PoC+ consensus mechanism.

**Reference:** For MetaMask configuration and additional endpoint details, see the [WebChain API Reference](./API_REFERENCE.md).

---

## 6. Notes

- **Security:** All integration endpoints require authentication and OTP verification to ensure secure transactions.
- **API Base URL:** All endpoints are accessible via `https://e-talk.xyz/wp-json/webchain/v1`.
- **Network Information:** The WebChain JSON-RPC endpoint is active and ready, operating on the mainnet with version 1.0.0, as confirmed by the API status.
- **Additional Endpoints:** For related functionality (e.g., verifying validator status or processing WooCommerce orders), refer to the `/verify-validator` and `/process-order` endpoints in the [WebChain API Reference](./API_REFERENCE.md).
