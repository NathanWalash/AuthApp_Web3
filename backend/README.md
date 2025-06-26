# AuthApp_Web3 Backend

This is the backend API for AuthApp_Web3, responsible for secure Ethereum wallet provisioning, private key encryption/storage, and blockchain operations. It is designed to be used with the React Native frontend in the monorepo.

## Main Endpoints

- `POST /api/wallet-api/provision-wallet` — Provision a new Ethereum wallet for a user (requires UID).
- `GET /api/wallet-api/wallet-info?uid=...` — Fetch the wallet address and token balance for a user.

## Tech Stack
- Node.js + Express
- ethers.js (Ethereum wallet management)
- Firestore (wallet storage)
- Encryption for private keys

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Add your Firestore service account JSON and set the path in `.env`:
   ```env
   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
   ENCRYPTION_SECRET=your-strong-secret
   FIREBASE_PROJECT_ID=your-project-id
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

---

See the main project README for monorepo structure and integration details. 