# AuthApp_Web3 Backend - Node.js/Express Web3 API

## 🚀 Overview

A secure, production-ready backend API for Web3 applications, handling Ethereum wallet provisioning, ERC-20 token management, and blockchain operations. Built with Node.js, Express, and ethers.js, this backend ensures private keys never leave the server while providing seamless Web3 functionality to mobile clients.

### ✨ Key Features
- **Secure Wallet Provisioning**: Automatic Ethereum wallet creation with encrypted storage
- **Token Management**: ERC-20 mint/burn operations with proper authorization
- **Firebase Integration**: User authentication and secure data storage
- **Blockchain Operations**: Direct smart contract interactions
- **Encryption**: AES-256 encrypted private key storage
- **Error Handling**: Comprehensive error handling and logging

---

## 🏗️ Architecture

### Core Components
- **Express Server**: RESTful API with CORS and JSON middleware
- **Firebase Admin**: User authentication and Firestore database
- **Ethers.js**: Ethereum wallet and contract interactions
- **Hardhat**: Smart contract development and deployment
- **Encryption**: AES-256 for private key security

### API Structure
```
/api/
├── wallet-api/           # Wallet management endpoints
│   ├── provision-wallet  # Create new wallets
│   └── wallet-info       # Get wallet info & balance
└── token/                # Token contract endpoints
    ├── mint              # Mint tokens
    └── burn              # Burn tokens
```

---

## 📁 Project Structure

```
backend/
├── 📄 Configuration
│   ├── hardhat.config.js          # Hardhat configuration
│   ├── package.json               # Dependencies and scripts
│   ├── tsconfig.json              # TypeScript configuration
│   └── .env                       # Environment variables
│
├── 🔧 Smart Contracts
│   ├── contracts/
│   │   └── Token.sol              # ERC-20 token contract
│   ├── artifacts/                 # Compiled contract artifacts
│   └── scripts/
│       └── deploy.ts              # Contract deployment script
│
├── 🚀 Source Code
│   └── src/
│       ├── app.ts                 # Express server setup
│       └── api/
│           ├── index.ts           # Main API router
│           ├── wallet-api/        # Wallet management
│           │   ├── index.ts       # Wallet router
│           │   ├── provisionWallet.ts
│           │   ├── walletInfo.ts
│           │   └── utils.ts       # Encryption utilities
│           └── token/             # Token operations
│               ├── index.ts       # Token router
│               ├── mint.ts        # Mint endpoint
│               ├── burn.ts        # Burn endpoint
│               └── Token_abi.json # Contract ABI
│
└── 📚 Documentation
    └── README.md                  # This file
```

---

## 🛠️ Prerequisites

### Required Software
- **Node.js** (v18 or newer)
- **npm** or **Yarn**
- **Git**

### Required Accounts & Services
- **Firebase Project** (for authentication and database)
- **Ethereum Development Environment** (Hardhat for local development)

---

## 🔧 Installation & Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
# Firebase Configuration
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
FIREBASE_PROJECT_ID=your-firebase-project-id

# Security
ENCRYPTION_SECRET=your_32_character_encryption_secret_here

# Ethereum Configuration (Local Development)
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
RPC_URL=http://127.0.0.1:8545

# Token Contract (Auto-populated after deployment)
TOKEN_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### 3. Firebase Setup

#### A. Download Service Account Key
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings → Service accounts**
4. Click "Generate new private key"
5. Download the JSON file
6. Save as `serviceAccountKey.json` in the `backend/` directory

#### B. Configure Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow create: if request.auth != null && request.auth.uid == userId;
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
    }
    
    // Wallets can only be accessed by the owner
    match /wallets/{userId} {
      allow create: if request.auth != null && request.auth.uid == userId;
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Smart Contract Deployment

#### A. Start Local Hardhat Node
```bash
npx hardhat node
```
This starts a local Ethereum node at `http://127.0.0.1:8545`

#### B. Deploy Token Contract
In a new terminal:
```bash
npx ts-node scripts/deploy.ts
```

This script will:
- Compile the Token contract
- Deploy to local Hardhat network
- Export ABI to `src/api/token/Token_abi.json`
- Update `.env` with contract address

### 5. Start Development Server

```bash
npm run dev
```

Server starts on `http://localhost:4000` with auto-restart on file changes.

---

## 🔌 API Endpoints

### Wallet API (`/api/wallet-api`)

#### POST /provision-wallet
Creates a new Ethereum wallet for a user.

**Request:**
```json
{
  "uid": "user123"
}
```

**Response:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  "success": true
}
```

#### GET /wallet-info
Retrieves wallet address and token balance for a user.

**Request:**
```
GET /api/wallet-api/wallet-info?uid=user123
```

**Response:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  "balance": "100.0"
}
```

### Token API (`/api/token`)

#### POST /mint
Mints tokens to a specified address (admin only).

**Request:**
```json
{
  "to": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  "amount": 100
}
```

**Response:**
```json
{
  "status": "success",
  "txHash": "0x3e9fc17e1126eb5d2eb5428aad7f3e1c8147b71d822bfcb1d438fdb21d43978f"
}
```

#### POST /burn
Burns tokens from a specified address (admin only).

**Request:**
```json
{
  "from": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  "amount": 50
}
```

**Response:**
```json
{
  "status": "success",
  "txHash": "0x3e9fc17e1126eb5d2eb5428aad7f3e1c8147b71d822bfcb1d438fdb21d43978f"
}
```

---

## 🔐 Security Features

### Private Key Management
- **Server-side Storage**: Private keys never leave the backend
- **AES-256 Encryption**: All private keys encrypted before storage
- **Firestore Security**: Encrypted keys stored with proper access controls
- **No Exposure**: Frontend only receives wallet addresses

### Authentication & Authorization
- **Firebase Auth**: Secure user authentication
- **User Isolation**: Users can only access their own wallets
- **Admin Functions**: Mint/burn operations restricted to authorized accounts

### Smart Contract Security
- **Ownable Pattern**: Only contract owner can mint/burn
- **Input Validation**: All inputs validated before blockchain operations
- **Error Handling**: Comprehensive error handling for failed transactions

---

## 🚀 Development Workflow

### Local Development
1. **Start Hardhat Node**: `npx hardhat node`
2. **Deploy Contract**: `npx ts-node scripts/deploy.ts`
3. **Start Backend**: `npm run dev`
4. **Test Endpoints**: Use curl, Postman, or frontend app

### Contract Development
1. **Modify Contract**: Edit `contracts/Token.sol`
2. **Recompile**: `npx hardhat compile`
3. **Redeploy**: `npx ts-node scripts/deploy.ts`
4. **Update ABI**: Script automatically exports new ABI

### Testing
```bash
# Test wallet provisioning
curl -X POST http://localhost:4000/api/wallet-api/provision-wallet \
  -H "Content-Type: application/json" \
  -d '{"uid":"testuser123"}'

# Test token minting
curl -X POST http://localhost:4000/api/token/mint \
  -H "Content-Type: application/json" \
  -d '{"to":"0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6","amount":100}'

# Test wallet info
curl http://localhost:4000/api/wallet-api/wallet-info?uid=testuser123
```

---

## 🐛 Troubleshooting

### Common Issues

#### Contract Deployment Issues
- **Problem**: "Cannot find module" errors
- **Solution**: Ensure Hardhat node is running and contract is compiled
- **Commands**: 
  ```bash
  npx hardhat compile
  npx ts-node scripts/deploy.ts
  ```

#### Firebase Connection Issues
- **Problem**: "Failed to initialize Firebase Admin"
- **Solution**: Verify service account key path and Firebase project ID
- **Check**: `.env` file and `serviceAccountKey.json` location

#### Token Balance Issues
- **Problem**: Balance always returns 0
- **Solution**: Ensure token contract is deployed and backend is querying correct contract
- **Debug**: Check backend logs for contract interaction errors

#### Network Issues
- **Problem**: "Failed to connect to RPC"
- **Solution**: Ensure Hardhat node is running on correct port
- **Check**: `RPC_URL` in `.env` matches Hardhat node URL

### Error Logging
- **Backend Logs**: Check console output for detailed error messages
- **Contract Errors**: Hardhat node shows transaction details and errors
- **Firebase Errors**: Check Firebase console for authentication issues

### Development Tips
- **Hot Reload**: Backend auto-restarts with `npm run dev`
- **Contract Testing**: Use Hardhat console for direct contract interaction
- **Network Switching**: Change `RPC_URL` in `.env` for different networks
- **Environment Variables**: Always restart server after changing `.env`

---

## 📚 Additional Resources

### Documentation
- [Express.js Documentation](https://expressjs.com/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin)
- [Hardhat Documentation](https://hardhat.org/docs)

### Security Resources
- [Web3 Security Best Practices](https://consensys.net/blog/developers/ethereum-developer-security-toolbox/)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Smart Contract Security](https://consensys.net/diligence/audits/)

### Development Tools
- [Postman](https://www.postman.com/) - API testing
- [Hardhat Console](https://hardhat.org/hardhat-runner/docs/guides/hardhat-console) - Contract interaction
- [Etherscan](https://etherscan.io/) - Blockchain explorer

---

## 🔄 Production Deployment

### Environment Setup
1. **Production Network**: Update `RPC_URL` to production Ethereum network
2. **Private Key**: Use production wallet private key
3. **Firebase**: Ensure production Firebase project is configured
4. **Security**: Use strong encryption secret and secure environment variables

### Deployment Checklist
- [ ] Environment variables configured for production
- [ ] Smart contract deployed to production network
- [ ] Firebase security rules updated
- [ ] Error logging and monitoring configured
- [ ] SSL/TLS certificates installed
- [ ] Rate limiting implemented
- [ ] Backup and recovery procedures in place

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review the API documentation
- Consult the additional resources

---

**Happy Web3 Backend Development! 🚀** 