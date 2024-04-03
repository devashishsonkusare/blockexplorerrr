# Multi-Chain Block Explorer DApp

## Introduction

Welcome to the Multi-Chain Block Explorer DApp, powered by Krypcore Web3. This DApp allows users to explore multiple blockchain networks seamlessly, providing insights into recent blocks, transactions, addresses, and more.

## About

This project is part of a series dedicated to building decentralized applications (DApps) with Krypcore Web3. By leveraging Krypcore's RPC Nodes and RPC APIs, developers can create customized block explorers for various blockchain networks.

## Features

- View the recent 10 blocks processed on the chain
- Search for a specific transaction hash to find more details
- Lookup any address on the chain
- Search for a specific block number or block hash to get block details
- Get the list of transactions in a block
- Toggle between multiple chains for exploration

## Getting Started

### Prerequisites

- Create an account on [Krypcore Web3](https://www.krypcore.com/) to obtain the necessary RPC Endpoints for your project.
- Ensure Node.js v12 is installed on your system.
- Familiarize yourself with React.js.

### Installation

1. Clone this repository:

```bash
git clone https://github.com/krypc-code/krypcore-block-explorer.git
```


2. Navigate to the project directory:

```bash
cd krypcore-block-explorer
```


3. Install dependencies:

```bash
npm install
```


4. Create a `.env` file based on the `.env.example` file and replace all variables with the respective endpoint URLs from your Krypcore Web3 dashboard.

### Usage

1. Start the development server:

```bash
npm start
```


2. Access the application at `localhost:3000`.

### API Used

- `eth_getBalance`: Fetches the balance of a given address.
- `eth_getTransactionCount`: Fetches the nonce/total transactions performed by a given address.
- `eth_getBlock`: Gets the block details for a given block number.
- `eth_getTransactionReceipt`: Provides information about a given transaction hash.
- `eth_getTransaction`: Provides details regarding the transaction.
- `eth_getBlockNumber`: Fetches the current/latest block number.
- `eth_getGasPrice`: Fetches the current gas price.

## Conclusion

We hope this guide helps you get started with creating your multi-chain block explorer with Krypcore Web3. Feel free to customize it further or add any other custom networks. Join our developer community on Discord to discuss any DApp ideas you're building!
