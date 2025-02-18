const hre = require("hardhat");

async function main() {
  // Read contract name from environment variable or CLI argument
  const contractName = process.env.CONTRACT_NAME || process.argv[2];

  if (!contractName) {
    console.error("\n❌ Please specify a contract name.");
    console.error("Usage: CONTRACT_NAME=MultiUserBank npx hardhat run scripts/deploy.js --network localhost\n");
    process.exit(1);
  }

  console.log(`🚀 Deploying contract: ${contractName}...\n`);

  try {
    // Load contract dynamically
    const Contract = await hre.ethers.getContractFactory(contractName);
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    console.log(`✅ ${contractName} deployed at: ${contract.target}\n`);
  } catch (error) {
    console.error(`❌ Deployment failed: ${error.message}\n`);
    process.exit(1);
  }
}

// Execute deployment with error handling
main().catch((error) => {
  console.error(`❌ Unexpected error: ${error.message}`);
  process.exitCode = 1;
});
