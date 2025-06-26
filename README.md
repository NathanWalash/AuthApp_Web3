# AuthApp_Web3 - Full-Stack Web3 Authentication & Token Management

## 🚀 Project Overview

A comprehensive full-stack Web3 application that combines secure authentication with Ethereum wallet provisioning and ERC-20 token management. Built with React Native (Expo) frontend and Node.js/Express backend, this project demonstrates best practices for Web3 mobile development with proper security measures.

### ✨ Key Features
- **Secure Authentication**: Firebase Auth with email/password
- **Wallet Provisioning**: Automatic Ethereum wallet creation for new users
- **Token Management**: ERC-20 token minting and burning capabilities
- **Real-time Balance**: Live token balance tracking
- **Security First**: Private keys never exposed to frontend
- **Encrypted Storage**: AES-256 encrypted private key storage in Firestore

---

## 🏗️ Architecture

### Frontend (React Native + Expo)
- **Authentication Screens**: Login, Signup, Password Reset
- **Home Screen**: User profile display and wallet management
- **Token Operations**: Mint and burn tokens via backend API
- **Real-time Updates**: Live balance and transaction status

### Backend (Node.js + Express)
- **Wallet API**: Secure wallet provisioning and management
- **Token API**: ERC-20 contract interactions (mint/burn)
- **Firebase Integration**: User and wallet data storage
- **Blockchain Operations**: Ethereum contract interactions

### Smart Contract (Solidity)
- **ERC-20 Token**: Standard token with mint/burn capabilities
- **Ownable**: Admin-only mint/burn functions
- **Hardhat**: Development and deployment framework

---

## 📁 Project Structure

```
AuthApp_Web3/
├── 📱 Frontend (React Native + Expo)
│   ├── src/
│   │   ├── screens/
│   │   │   ├── HomeScreen.tsx          # Main dashboard with token operations
│   │   │   ├── LoginScreen.tsx         # User authentication
│   │   │   ├── SignupScreen.tsx        # User registration
│   │   │   ├── ResetPasswordScreen.tsx # Password recovery
│   │   │   └── AccountSettingsScreen.tsx
│   │   ├── api/
│   │   │   └── walletApi.ts            # Backend API calls
│   │   └── firebase/
│   │       └── config.ts               # Firebase configuration
│   ├── App.tsx                         # Main app component
│   ├── app.config.js                   # Expo configuration
│   └── .env                            # Frontend environment variables
│
├── ⚙️ Backend (Node.js + Express)
│   ├── src/
│   │   ├── api/
│   │   │   ├── wallet-api/             # Wallet management endpoints
│   │   │   │   ├── provisionWallet.ts  # Create new wallets
│   │   │   │   ├── walletInfo.ts       # Get wallet info & balance
│   │   │   │   ├── utils.ts            # Encryption utilities
│   │   │   │   └── index.ts            # Router configuration
│   │   │   └── token/                  # Token contract endpoints
│   │   │       ├── mint.ts             # Mint tokens
│   │   │       ├── burn.ts             # Burn tokens
│   │   │       ├── Token_abi.json      # Contract ABI
│   │   │       └── index.ts            # Token router
│   │   └── app.ts                      # Express server setup
│   ├── contracts/
│   │   └── Token.sol                   # ERC-20 smart contract
│   ├── scripts/
│   │   └── deploy.ts                   # Contract deployment script
│   ├── hardhat.config.js               # Hardhat configuration
│   └── .env                            # Backend environment variables
│
└── 📚 Documentation
    ├── README.md                       # This file
    └── backend/README.md               # Backend-specific documentation
```

---

## 🛠️ Prerequisites

### Required Software
- **Node.js** (v18 or newer)
- **npm** or **Yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Git**

### Required Accounts
- **Firebase Account** (for authentication and database)
- **Ethereum Development Environment** (local Hardhat node for testing)

---

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <YOUR_REPO_URL>
cd AuthApp_Web3

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Return to project root
cd ..
```

### 2. Firebase Project Setup

#### A. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "web3-mobile-auth-starter")
4. Enable Google Analytics (optional)
5. Click "Create project"

#### B. Enable Authentication
1. In Firebase Console, go to **Authentication → Sign-in method**
2. Enable **Email/Password** authentication
3. Click "Save"

#### C. Create Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development)
4. Select a location close to your users
5. Click "Done"

#### D. Configure Firestore Security Rules
In **Firestore → Rules**, replace with:

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

#### E. Get Firebase Configuration
1. Go to **Project Settings → Your apps**
2. Click "Add app" → "Web"
3. Register app with a nickname
4. Copy the Firebase config object

#### F. Download Service Account Key
1. Go to **Project Settings → Service accounts**
2. Click "Generate new private key"
3. Download the JSON file
4. Save as `serviceAccountKey.json` in the `backend/` directory

### 3. Environment Configuration

#### Frontend Environment (`.env` in project root)
```env
# Firebase Configuration
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Optional: Token contract address (if frontend needs to read contract)
TOKEN_ADDRESS=0x... # Will be populated after contract deployment
```

#### Backend Environment (`backend/.env`)
```env
# Firebase Configuration
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
FIREBASE_PROJECT_ID=your_project_id

# Security
ENCRYPTION_SECRET=your_32_character_encryption_secret_here

# Ethereum Configuration (for local development)
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
RPC_URL=http://127.0.0.1:8545

# Token Contract (will be populated after deployment)
TOKEN_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### 4. Smart Contract Deployment

#### A. Start Local Hardhat Node
```bash
cd backend
npx hardhat node
```
This starts a local Ethereum node at `http://127.0.0.1:8545`

#### B. Deploy Token Contract
In a new terminal:
```bash
cd backend
npx ts-node scripts/deploy.ts
```

This will:
- Compile the Token contract
- Deploy it to the local Hardhat network
- Export the ABI to `src/api/token/Token_abi.json`
- Update `backend/.env` with the contract address

### 5. Start the Application

#### A. Start Backend Server
```bash
cd backend
npm run dev
```
Server will start on `http://localhost:4000`

#### B. Start Frontend
```bash
# In project root
npx expo start
```

#### C. Test on Device
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app on physical device

---

## 🔐 Security Features

### Private Key Management
- **Server-side Only**: Private keys never leave the backend
- **AES-256 Encryption**: All private keys encrypted before storage
- **Firestore Storage**: Encrypted keys stored securely in Firestore
- **No Frontend Exposure**: Frontend only receives wallet addresses

### Authentication
- **Firebase Auth**: Secure email/password authentication
- **JWT Tokens**: Stateless authentication with Firebase
- **User Isolation**: Users can only access their own data

### Smart Contract Security
- **Ownable Pattern**: Only authorized accounts can mint/burn
- **Input Validation**: All inputs validated before blockchain operations
- **Error Handling**: Comprehensive error handling for failed transactions

---

## 🚀 Usage Guide

### User Registration Flow
1. User opens app and taps "Sign Up"
2. Enters name, email, date of birth, and password
3. Backend creates Firebase Auth user
4. Backend provisions Ethereum wallet
5. Encrypted private key stored in Firestore
6. Wallet address added to user profile
7. User redirected to Home screen

### Token Operations
1. **View Balance**: Tap "Get Wallet Info" to see current token balance
2. **Mint Tokens**: Tap "Mint 100 Tokens" to receive tokens (admin only)
3. **Burn Tokens**: Tap "Burn 100 Tokens" to destroy tokens (admin only)
4. **Real-time Updates**: Balance updates automatically after operations

### Development Workflow
1. **Local Development**: Use Hardhat local node for testing
2. **Contract Changes**: Modify `Token.sol`, recompile, redeploy
3. **Backend Changes**: Server auto-restarts with `npm run dev`
4. **Frontend Changes**: Expo hot reloads automatically

---

## 🔧 API Endpoints

### Wallet API (`/api/wallet-api`)
- `POST /provision-wallet` - Create new wallet for user
- `GET /wallet-info?uid={uid}` - Get wallet address and token balance

### Token API (`/api/token`)
- `POST /mint` - Mint tokens to specified address
- `POST /burn` - Burn tokens from specified address

### Request/Response Examples

#### Provision Wallet
```bash
curl -X POST http://localhost:4000/api/wallet-api/provision-wallet \
  -H "Content-Type: application/json" \
  -d '{"uid":"user123"}'
```

#### Get Wallet Info
```bash
curl http://localhost:4000/api/wallet-api/wallet-info?uid=user123
```

#### Mint Tokens
```bash
curl -X POST http://localhost:4000/api/token/mint \
  -H "Content-Type: application/json" \
  -d '{"to":"0x...","amount":100}'
```

---

## 🐛 Troubleshooting

### Common Issues

#### Backend Connection Issues
- **Problem**: Frontend can't connect to backend
- **Solution**: Update `BACKEND_URL` in `src/api/walletApi.ts` to your computer's IP address
- **Example**: `http://192.168.1.100:4000/api/wallet-api`

#### Contract Deployment Issues
- **Problem**: "Cannot find module" errors during deployment
- **Solution**: Ensure Hardhat node is running and contract is compiled
- **Command**: `npx hardhat compile` then `npx ts-node scripts/deploy.ts`

#### Firebase Configuration Issues
- **Problem**: Authentication or Firestore not working
- **Solution**: Verify Firebase config in `.env` and service account key
- **Check**: Firebase project settings and security rules

#### Token Balance Issues
- **Problem**: Balance always shows 0
- **Solution**: Ensure token contract is deployed and backend is querying correct contract
- **Debug**: Check backend logs for contract interaction errors

### Development Tips
- **Hot Reload**: Backend auto-restarts with `npm run dev`
- **Contract Testing**: Use Hardhat console for direct contract interaction
- **Network Switching**: Change `RPC_URL` in backend `.env` for different networks
- **Error Logging**: Check backend console for detailed error messages

---

## 📚 Additional Resources

### Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Hardhat Documentation](https://hardhat.org/docs)

### Security Best Practices
- [Web3 Security Guidelines](https://consensys.net/blog/developers/ethereum-developer-security-toolbox/)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Smart Contract Security](https://consensys.net/diligence/audits/)

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

**Happy Web3 Development! 🚀**

```
AuthApp_Web3/
  ├── backend/      # Node.js/Express backend (API, wallet provisioning, Firestore)
  ├── src/          # React Native frontend (screens, firebase config, etc.)
  ├── App.tsx       # Frontend entry point
  └── ...etc
```

- **Frontend**: Handles user interface, authentication, and calls backend APIs.
- **Backend**: Handles secure wallet creation, private key encryption/storage, and blockchain operations. Never exposes private keys to the frontend.

---

# AuthApp

A React Native Expo application that implements persistent email/password authentication with Firebase and user profiles stored in Cloud Firestore. Provides a Login/Signup flow, password reset, and account settings screens.

## Prerequisites

* Node.js (v14 or newer)
* npm or Yarn
* Expo CLI (available via `npx expo`)
* A Firebase account

## Installation

1. **Clone the repository**

   ```bash
   git clone <YOUR_REPO_URL>
   cd AuthApp
   ```

2. **Install dependencies**

   ```bash
   npm install
   # Install Expo native modules
   npx expo install expo-constants @react-native-async-storage/async-storage
   ```

3. **Configure Firebase**

   1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
   2. Under **Authentication → Sign-in method**, enable **Email/Password**.
   3. Under **Firestore Database**, click **Create database**, choose a location, and start in **Test mode** or **Production mode**.
   4. In **Firestore → Rules**, use:

      ```js
      service cloud.firestore {
        match /databases/{database}/documents {
          match /users/{userId} {
            allow create: if request.auth != null && request.auth.uid == userId;
            allow read, update, delete: if request.auth != null && request.auth.uid == userId;
          }
        }
      }
      ```
   5. Under **Project Settings → Your apps**, register a **Web** app and copy the Firebase config.

4. **Create `.env` file**
   In the project root, create `.env` and add your Firebase config values:

   ```env
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

   > Ensure `.env` is in `.gitignore` to keep your keys private.

5. **Update `app.config.js`**
   Make sure `app.config.js` reads from `process.env` and exposes them via `expo-constants`:

   ```js
   import 'dotenv/config';
   export default {
     expo: {
       name: 'AuthApp',
       slug: 'AuthApp',
       extra: {
         firebaseApiKey: process.env.FIREBASE_API_KEY,
         firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
         firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
         firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
         firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
         firebaseAppId: process.env.FIREBASE_APP_ID,
       },
     },
   };
   ```

6. **Run the app**

   ```bash
   npx expo start
   ```

   * Press `a` for Android
   * Press `i` for iOS
   * Press `w` for Web

## Project Structure

```
AuthApp/
├── src/
│   ├── firebase/
│   │   └── config.ts             # Firebase initialization (Auth & Firestore)
│   └── screens/
│       ├── LandingScreen.tsx     # Welcome with Login/Create
│       ├── LoginScreen.tsx       # Email/Password login
│       ├── SignupScreen.tsx      # Email/Password signup
│       ├── ResetPasswordScreen.tsx # Password reset flow
│       ├── AccountSettingsScreen.tsx # Edit profile, change email/password
│       └── HomeScreen.tsx        # Authenticated home
├── App.tsx                       # Root entrypoint
├── app.config.js                 # Expo config loading .env
├── .env                          # Firebase keys (ignored)
├── package.json
└── README.md
```

## Environment Variables

Exposed via Expo Constants in code (`Constants.expoConfig.extra`):

* `firebaseApiKey`
* `firebaseAuthDomain`
* `firebaseProjectId`
* `firebaseStorageBucket`
* `firebaseMessagingSenderId`
* `firebaseAppId`
