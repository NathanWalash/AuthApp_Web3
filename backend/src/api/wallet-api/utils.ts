import crypto from 'crypto';
import admin from 'firebase-admin';

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || 'default_secret';
const WALLETS_COLLECTION = 'wallets';

console.log('ENCRYPTION_SECRET:', ENCRYPTION_SECRET, 'length:', ENCRYPTION_SECRET.length);

export function encryptPrivateKey(privateKey: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_SECRET, 'utf8'), iv);
  let encrypted = cipher.update(privateKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decryptPrivateKey(encrypted: string): string {
  const [ivHex, encryptedData] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_SECRET, 'utf8'), iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export async function storeWalletInFirestore(uid: string, address: string, encryptedPrivateKey: string) {
  const db = admin.firestore();
  await db.collection(WALLETS_COLLECTION).doc(uid).set({ address, encryptedPrivateKey });
}

export async function getWalletFromFirestore(uid: string) {
  const db = admin.firestore();
  const doc = await db.collection(WALLETS_COLLECTION).doc(uid).get();
  return doc.exists ? doc.data() : null;
} 