import express from 'express';
import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Load ABI
const abi = JSON.parse(fs.readFileSync(path.join(__dirname, 'Token_abi.json'), 'utf8'));
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
const token = new ethers.Contract(process.env.TOKEN_ADDRESS!, abi, wallet);

// POST /burn
// { from: "0xUserAddr", amount: "30" }
router.post('/burn', async (req, res) => {
  try {
    // TODO: Add authentication/authorization for admin-only access
    const { from, amount } = req.body;
    const wei = ethers.parseUnits(amount.toString(), 18);
    const tx = await token.burn(from, wei);
    await tx.wait();
    res.json({ status: 'success', txHash: tx.hash });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router; 