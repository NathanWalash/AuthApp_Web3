import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import walletApiRouter from './api/wallet-api';

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const app = express();
app.use(cors());
app.use(express.json());

// Mount wallet API
app.use('/api/wallet-api', walletApiRouter);

// Root route
app.get('/', (req, res) => {
  res.send('AuthApp_Web3 Backend API');
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
}); 