const BACKEND_URL = "http://192.168.0.188:4000/api/wallet-api"; // Change to your backend URL in production

export async function provisionWallet(uid: string) {
  console.log('Calling backend to provision wallet for:', uid, 'at', `${BACKEND_URL}/provision-wallet`);
  try {
    const res = await fetch(`${BACKEND_URL}/provision-wallet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid }),
    });
    console.log('Provision wallet response status:', res.status);
    if (!res.ok) {
      const text = await res.text();
      console.log('Backend error:', text);
      throw new Error("Failed to provision wallet");
    }
    const data = await res.json();
    console.log('Provision wallet success:', data);
    return data;
  } catch (e) {
    console.log('Fetch error in provisionWallet:', e);
    throw e;
  }
}

export async function getWalletInfo(uid: string) {
  console.log('Calling backend to get wallet info for:', uid, 'at', `${BACKEND_URL}/wallet-info?uid=${uid}`);
  try {
    const res = await fetch(`${BACKEND_URL}/wallet-info?uid=${uid}`);
    console.log('Get wallet info response status:', res.status);
    if (!res.ok) {
      const text = await res.text();
      console.log('Backend error:', text);
      throw new Error("Failed to fetch wallet info");
    }
    const data = await res.json();
    console.log('Get wallet info success:', data);
    return data;
  } catch (e) {
    console.log('Fetch error in getWalletInfo:', e);
    throw e;
  }
} 