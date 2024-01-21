const hre = require("hardhat");

async function main() {

  const contract = await hre.ethers.getContractFactory("lfgho");
  const lfgho = await hre.ethers.deployContract(contract)
  await lfgho.waitForDeployment();
  console.log("lfgho deployed to:", lfgho.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
