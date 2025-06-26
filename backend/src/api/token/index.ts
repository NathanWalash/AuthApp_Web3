import express from 'express';
import mintRouter from './mint';
import burnRouter from './burn';

const router = express.Router();

// Combine token-related routes
router.use(mintRouter);
router.use(burnRouter);

export default router; 