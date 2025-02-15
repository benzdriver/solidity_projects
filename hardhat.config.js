require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const CONTRACT_DIR = process.env.CONTRACT_DIR || "Day2_BankContract";

module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    // coinmarketcap: "<YOUR_COINMARKETCAP_API_KEY>" // Optional for gas price estimation
  },
  paths: {
    sources: `./${CONTRACT_DIR}/contracts`,
    tests: `./${CONTRACT_DIR}/test`,
    cache: `./${CONTRACT_DIR}/cache`,
    artifacts: `./${CONTRACT_DIR}/artifacts`,
  },
};
