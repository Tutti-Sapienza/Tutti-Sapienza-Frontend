require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Private key should be in a .env file
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    sonic: {
      url: "https://rpc.soniclabs.com",
      chainId: 146,
      accounts: [PRIVATE_KEY]
    },
    hardhat: {
      // Configuration for the Hardhat Network
    }
  }
};
