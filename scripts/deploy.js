// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const TuttiSapienzaNFT = await hre.ethers.getContractFactory("TuttiSapienzaNFT");
  
  // Deploy the contract
  const tuttiNFT = await TuttiSapienzaNFT.deploy();
  
  // Wait for deployment to finish
  await tuttiNFT.deployed();
  
  console.log("TuttiSapienzaNFT deployed to:", tuttiNFT.address);
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });