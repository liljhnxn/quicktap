import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log(`Starting deployment of QuickTap to network: ${network.name} (Chain ID: ${network.config.chainId})...`);

  const [deployer] = await ethers.getSigners();
  console.log(`Deployer address: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${ethers.formatEther(balance)} BOT`);

  // Query network fee data to use minimum necessary gas price
  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice || ethers.parseUnits("20", "gwei");
  console.log(`Network gas price: ${ethers.formatUnits(gasPrice, "gwei")} Gwei`);

  const QuickTap = await ethers.getContractFactory("QuickTap");

  // Accurately estimate gas to avoid gas spikes or wasteful limits
  const deployTxReq = await QuickTap.getDeployTransaction();
  const estimatedGas = await ethers.provider.estimateGas(deployTxReq);
  const gasLimit = (estimatedGas * 115n) / 100n; // Safe 15% buffer
  const estimatedCost = estimatedGas * gasPrice;

  console.log(`Estimated deployment gas: ${estimatedGas.toString()} gas units`);
  console.log(`Estimated deployment cost: ~${ethers.formatEther(estimatedCost)} BOT`);

  if (balance < estimatedCost) {
    throw new Error(
      `Insufficient balance! Required: ~${ethers.formatEther(estimatedCost)} BOT, Current: ${ethers.formatEther(balance)} BOT`
    );
  }

  // Deploy with exact gas parameters
  console.log("Submitting deployment transaction with optimized gas parameters...");
  const quickTap = await QuickTap.deploy({
    gasPrice: gasPrice,
    gasLimit: gasLimit,
  });

  console.log("Waiting for deployment transaction to be mined...");
  await quickTap.waitForDeployment();

  const contractAddress = await quickTap.getAddress();
  const deploymentTx = quickTap.deploymentTransaction();

  const explorerBase = "https://scan.botchain.ai";
  const networkTitle = `Botchain Mainnet (Chain ID ${network.config.chainId || 677})`;

  console.log("\n==================================================");
  console.log(` QuickTap Contract Deployed Successfully on ${networkTitle}!`);
  console.log("==================================================");
  console.log(`Contract Address: ${contractAddress}`);
  if (deploymentTx) {
    console.log(`Transaction Hash: ${deploymentTx.hash}`);
    console.log(`Explorer Address URL: ${explorerBase}/address/${contractAddress}`);
    console.log(`Explorer Tx URL:      ${explorerBase}/tx/${deploymentTx.hash}`);
  }
  console.log("==================================================\n");

  // Save deployed address and ABI to JSON config
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
    `# QuickTap Deployed Contract Address on ${networkTitle}\nNEXT_PUBLIC_QUICK_TAP_CONTRACT_ADDRESS=${contractAddress}\n`
  );
  console.log(`Updated ${frontendEnvPath} with deployed address!`);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
