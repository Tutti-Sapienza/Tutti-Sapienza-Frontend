# Tutti Sapienza frontend

React frontend for Tutti Sapienza, an education project combining AI, multilingual learning, and a proposed Web3 protocol.

## Run locally

Use Node.js and npm with the committed `package-lock.json`:

```sh
npm ci
npm start
```

```sh
npm test -- --watchAll=false --runInBand
npm run build
```

The production frontend is written to `build/`. The existing frontend does not need an API key or a private key to build.

## Current working scope

- The landing page presents the mission and expandable explanations of planned capabilities.
- Wallet selection uses [EIP-6963 provider discovery](https://eips.ethereum.org/EIPS/eip-6963), with a legacy injected-provider fallback. Each connect button requests access from its own provider.
- Account, network, and disconnect updates follow [EIP-1193 events](https://eips.ethereum.org/EIPS/eip-1193). Existing wallet access is restored without a prompt when only one provider is discovered at startup. When multiple providers are present at startup, the visitor chooses one.
- Disconnect from Tutti clears the current page connection and its listeners. It does not revoke permissions in the wallet extension; an already approved wallet can reconnect on reload. Disconnect first to choose a different wallet if another provider is discovered later.
- Visitors without a browser wallet can still explore every project section.
- The page uses the existing Tutti artwork and links to this repository. The Discord invite remains pending.

## Next milestone: testnet Whitepaper NFT

Minting remains disabled. This repository has no verified deployment configuration or usable metadata URI for the active frontend. Before enabling it:

1. Repair and test the incomplete `contracts/TuttiSapienzanft.sol`, including the inherited Solidity overrides. Pin the matching contract development dependencies. The existing Hardhat configuration points at Sonic; the earlier project plan called for a Base Sepolia trial, so establish the intended test network explicitly before deploying.
2. Deploy a tested contract on the selected testnet and record its network, address, and ABI. The hard-coded address in the legacy code is not verification of a live deployment.
3. Publish the real whitepaper metadata, then implement and test the intended minting function, pricing, recipient, transaction confirmation, and network checks.
4. Verify `tutti-sapienza.eth` resolution and the intended treasury before displaying a live balance or accepting funds. The current page shows the project ENS name only.

The DAO, TUTTI token, vaults, learning credentials, and AI tutoring described on the landing page are roadmap items. They are not active services in this frontend. This change introduces no signing, payments, or contract deployment.

`src/App.js` is the active entrypoint. `src/pages/LandingPage.js`, `src/components/contracts/utils/ConnectButton.js`, and the empty `src/context/Web3Context.js` are legacy scaffolding, not a working mint flow.

Wallet tests use mocked providers. A production build and these tests do not replace a real browser-wallet check before a release involving transactions.
