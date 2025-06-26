import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// Paths
const artifactPath = path.resolve(__dirname, '../artifacts/contracts/Token.sol/Token.json');
const abiOutputPath = path.resolve(__dirname, '../src/api/token/Token_abi.json');
const envPath = path.resolve(__dirname, '../../.env');

// Load compiled contract artifact
const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
const abi = artifact.abi;
const bytecode = artifact.bytecode;

async function main() {
  // Write ABI to backend/src/api/token/Token_abi.json
  fs.writeFileSync(abiOutputPath, JSON.stringify(abi, null, 2));
  console.log('ABI exported to src/api/token/Token_abi.json');

  // Deploy contract
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  console.log('Deploying contract with:', wallet.address);

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy(wallet.address);
  await contract.waitForDeployment();
  // ethers v6: contract.target is the address
  const contractAddress = (contract as any).target || (contract as any).address;
  console.log('Token deployed to:', contractAddress);

  // Update .env with new TOKEN_ADDRESS
  let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  if (env.match(/^TOKEN_ADDRESS=.*/m)) {
    env = env.replace(/^TOKEN_ADDRESS=.*/m, 'TOKEN_ADDRESS=' + contractAddress);
  } else {
    env += (env.endsWith('\n') ? '' : '\n') + 'TOKEN_ADDRESS=' + contractAddress + '\n';
  }
  fs.writeFileSync(envPath, env);
  console.log('.env updated with TOKEN_ADDRESS');
  console.log('---');
  console.log('Deployment complete. You can now use the backend mint/burn endpoints.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
}); 