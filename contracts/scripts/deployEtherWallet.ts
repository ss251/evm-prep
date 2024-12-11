import { ethers } from "hardhat";

async function main() {
    const [owner] = await ethers.getSigners();
    const wallet = await ethers.deployContract("EtherWallet");

    await wallet.waitForDeployment();

    console.log("EtherWallet deployed to:", wallet.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});