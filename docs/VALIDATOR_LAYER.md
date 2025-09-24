# WebChain Validator Layer (WVM-20 Tokens)

## Overview
The WebChain Validator Layer enables creation and management of native tokens (WVM-20) without smart contracts.

## Core Features
- Token Creation
- Validator Governance
- Wallet Integration
- Token Transfers
- Minting Capability
- Balance Tracking

## Database Structure
- webchain_tokens
- webchain_token_approvals
- webchain_token_balances
- webchain_token_transfers
- webchain_governance_proposals
- webchain_governance_votes

## Token Creation Lifecycle
1. User sets wallet address
2. User submits token creation request
3. Token enters "pending" status
4. Validators vote
5. Token is finalized when approvals reached
6. Token broadcast to blockchain
7. Initial supply minted to creator

## Developer Hooks
```php
add_filter('webchain_token_data', function($token_data, $token_id) {
  return $token_data;
}, 10, 2);

add_action('webchain_token_approved', function($token_id, $token_row) {
  // Custom logic
}, 10, 2);
