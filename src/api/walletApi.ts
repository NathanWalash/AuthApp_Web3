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

export async function mintTokens(uid: string, amount: number) {
  // Fetch wallet address for the user
  const res1 = await fetch(`${BACKEND_URL}/wallet-info?uid=${uid}`);
  if (!res1.ok) throw new Error('Failed to fetch wallet info');
  const info = await res1.json();
  const address = info.address;
  if (!address) throw new Error('No wallet address');

  // Call backend mint endpoint
  const res2 = await fetch('http://192.168.0.188:4000/api/token/mint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: address, amount }),
  });
  if (!res2.ok) throw new Error('Failed to mint tokens');
  return res2.json();
}

export async function burnTokens(uid: string, amount: number) {
  // Fetch wallet address for the user
  const res1 = await fetch(`${BACKEND_URL}/wallet-info?uid=${uid}`);
  if (!res1.ok) throw new Error('Failed to fetch wallet info');
  const info = await res1.json();
  const address = info.address;
  if (!address) throw new Error('No wallet address');

  // Call backend burn endpoint
  const res2 = await fetch('http://192.168.0.188:4000/api/token/burn', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: address, amount }),
  });
  if (!res2.ok) throw new Error('Failed to burn tokens');
  return res2.json();
} 