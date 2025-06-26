import express from 'express';
import provisionWalletRouter from './provisionWallet';
import walletInfoRouter from './walletInfo';

const router = express.Router();

router.use(provisionWalletRouter);
router.use(walletInfoRouter);

export default router; 