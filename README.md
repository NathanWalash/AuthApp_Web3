# AuthApp_Web3

## Project Overview

This project is a full-stack Web3 authentication and wallet onboarding app, built with React Native (Expo) for the frontend and Node.js/Express for the backend. It enables users to sign up, receive a secure Ethereum wallet, and view their wallet address and token balance.

---

## User Flow

- **Signup:**
  - User signs up with name, email, date of birth, and password.
  - A Firebase Auth user and Firestore user document are created.
  - The backend provisions an Ethereum wallet and stores the encrypted private key in Firestore.
  - The wallet address is also written to the user's Firestore document.

- **Login:**
  - User logs in with email and password.
  - The Home screen fetches and displays the user's profile info (name, email, DOB) from Firestore.
  - The wallet address and balance are fetched and displayed only when the user presses the "Get Wallet Info" button.

---

## Frontend Structure

- **HomeScreen:**
  - Fetches and displays user profile info on mount.
  - Fetches and displays wallet address and balance on demand (button press).
- **SignupScreen:**
  - Handles user registration and triggers wallet provisioning via the backend.
- **LoginScreen:**
  - Handles user authentication.

---

## Backend Structure

- **/backend/src/api/wallet-api/provisionWallet.ts**
  - Provisions a new Ethereum wallet for a user.
  - Stores the encrypted private key in Firestore.
  - Updates the user's Firestore document with the wallet address.
- **/backend/src/api/wallet-api/walletInfo.ts**
  - Returns the wallet address and token balance for a user.

---

## Backend Environment Setup

1. In the `backend/` folder, create a `.env` file with the following content:
   ```env
   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
   ENCRYPTION_SECRET=your-strong-32-char-secret-here
   FIREBASE_PROJECT_ID=your-firebase-project-id
   ```
   - `GOOGLE_APPLICATION_CREDENTIALS` should point to your Firebase service account JSON file.
   - `ENCRYPTION_SECRET` must be a strong, random 32-character string (required for AES-256 encryption).
   - `FIREBASE_PROJECT_ID` is your Firebase project ID.
2. **Never commit your `.env` or `serviceAccountKey.json` to git!**

---

## Running the Project

### Backend
1. `cd backend`
2. `npm install`
3. `npm run dev` (for development)

### Frontend
1. `npm install`
2. `npx expo start`

#### Troubleshooting: Backend URL
- If you are testing from a physical device or emulator, you may need to change the `BACKEND_URL` in `src/api/walletApi.ts` to your computer's local IP address (e.g., `http://192.168.1.42:4000/api/wallet-api`).
- `localhost` will only work if running the app in a web browser on the same machine as the backend.

---

## Notes
- The wallet address is only fetched and displayed when the user requests it, ensuring up-to-date info and avoiding race conditions.
- All sensitive wallet operations are handled server-side; the private key is never exposed to the frontend.
- User profile and wallet info are stored in Firestore for easy access and management.

---

For more details, see the code in `/src/screens` (frontend) and `/backend/src/api/wallet-api` (backend).

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
