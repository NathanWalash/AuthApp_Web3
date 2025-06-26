import express, { Request, Response } from 'express';
import { getWalletFromFirestore } from './utils';

const router = express.Router();

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

    // TODO: Retrieve token balance from blockchain
    const balance = 0;

    return res.status(200).json({ address, balance });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch wallet info' });
  }
});

export default router; 