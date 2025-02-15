const hre = require("hardhat");

async function main() {
  // Get contract name from command-line argument
  const contractName = process.argv[2];

  if (!contractName) {
    console.error("Please specify a contract name.");
    console.error("Usage: npx hardhat run scripts/deploy.js --network localhost <ContractName>");
    process.exit(1);
  }

  console.log(`Deploying contract: ${contractName}...`);

  // Dynamically get contract factory
  const Contract = await hre.ethers.getContractFactory(contractName);
  const contract = await Contract.deploy();
  await contract.deployed();

  console.log(`${contractName} deployed at: ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
