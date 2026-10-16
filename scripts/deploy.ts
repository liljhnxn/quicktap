import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log(`Starting deployment of QuickTap to network: ${network.name}...`);

  const [deployer] = await ethers.getSigners();
  console.log(`Deployer address: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${ethers.formatEther(balance)} BOT`);

  const QuickTap = await ethers.getContractFactory("QuickTap");
  const quickTap = await QuickTap.deploy();

  console.log("Waiting for deployment transaction to be mined...");
  await quickTap.waitForDeployment();

  const contractAddress = await quickTap.getAddress();
  const deploymentTx = quickTap.deploymentTransaction();

  console.log("\n==================================================");
  console.log(" QuickTap Contract Deployed Successfully!");
  console.log("==================================================");
  console.log(`Contract Address: ${contractAddress}`);
  if (deploymentTx) {
    console.log(`Transaction Hash: ${deploymentTx.hash}`);
    if (network.config.chainId === 968) {
      console.log(`Explorer URL: https://scan.bohr.life/address/${contractAddress}`);
      console.log(`Tx Explorer URL: https://scan.bohr.life/tx/${deploymentTx.hash}`);
    }
  }
  console.log("==================================================\n");

  // Save deployed address and ABI to frontend config if frontend exists
  const contractInfo = {
    address: contractAddress,
    network: network.name,
    chainId: network.config.chainId,
    deployedAt: new Date().toISOString(),
  };

  const deployedPath = path.join(__dirname, "../deployed-address.json");
  fs.writeFileSync(deployedPath, JSON.stringify(contractInfo, null, 2));
  console.log(`Saved deployment info to ${deployedPath}`);

  // Automatically update frontend/.env.local
  const frontendEnvPath = path.join(__dirname, "../frontend/.env.local");
  fs.writeFileSync(
    frontendEnvPath,
    `# QuickTap Deployed Contract Address on Botchain Testnet (Chain ID 968)\nNEXT_PUBLIC_QUICK_TAP_CONTRACT_ADDRESS=${contractAddress}\n`
  );
  console.log(`Updated ${frontendEnvPath} with deployed address!`);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
