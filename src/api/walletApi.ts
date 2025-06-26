const BACKEND_URL = "http://192.168.0.188:4000/api/wallet-api"; // Change to your backend URL in production

/**
 * Provisions a wallet for the given user UID by calling the backend API.
 * Returns an object with the wallet address (e.g., { address: string }).
 * Throws an error if the backend call fails.
 */
export async function provisionWallet(uid: string) {
  const res = await fetch(`${BACKEND_URL}/provision-wallet`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid }),
  });
  if (!res.ok) throw new Error("Failed to provision wallet");
  return res.json();
}

/**
 * Fetches wallet info (address and balance) for the given user UID from the backend API.
 * Throws an error if the backend call fails.
 */
export async function getWalletInfo(uid: string) {
  const res = await fetch(`${BACKEND_URL}/wallet-info?uid=${uid}`);
  if (!res.ok) throw new Error("Failed to fetch wallet info");
  return res.json();
} 