import express, { Request, Response } from 'express';
import { getWalletFromFirestore } from './utils';
import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Load token contract
const abi = JSON.parse(fs.readFileSync(path.join(__dirname, '../token/Token_abi.json'), 'utf8'));
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const tokenContract = new ethers.Contract(process.env.TOKEN_ADDRESS!, abi, provider);

// GET /wallet-info?uid=...
router.get('/wallet-info', async (req: Request, res: Response) => {
  try {
    const { uid } = req.query;
    if (!uid || typeof uid !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid user UID' });
    }

    // Retrieve wallet from Firestore
    const wallet = await getWalletFromFirestore(uid);
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    const { address } = wallet;

    // Get token balance from blockchain
    const balance = await tokenContract.balanceOf(address);
    const balanceInTokens = ethers.formatUnits(balance, 18); // Convert from wei to tokens

    return res.status(200).json({ address, balance: balanceInTokens });
  } catch (error) {
    console.error('Error fetching wallet info:', error);
    return res.status(500).json({ error: 'Failed to fetch wallet info' });
  }
});

export default router; 