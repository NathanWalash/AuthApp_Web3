import express from 'express';
import { ethers } from 'ethers';
import { encryptPrivateKey, storeWalletInFirestore } from './utils';

const router = express.Router();

// POST /provision-wallet
router.post('/provision-wallet', async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ error: 'Missing user UID' });
    }

    // Generate Ethereum wallet
    const wallet = ethers.Wallet.createRandom();
    const address = wallet.address;
    const privateKey = wallet.privateKey;

    // Encrypt private key
    const encryptedPrivateKey = encryptPrivateKey(privateKey);

    // Store in Firestore
    await storeWalletInFirestore(uid, address, encryptedPrivateKey);

    // Also update the user's Firestore document with the wallet address
    const admin = require('firebase-admin');
    await admin.firestore().collection('users').doc(uid).set(
      { walletAddress: address },
      { merge: true }
    );

    return res.status(201).json({ address });
  } catch (error) {
    console.error('Provision wallet error:', error);
    return res.status(500).json({ error: 'Failed to provision wallet' });
  }
});

export default router; 