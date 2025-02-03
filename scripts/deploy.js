const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying the contract...");

    const Rebalancer = await ethers.getContractFactory("DeFiRebalancer");
    const rebalancer = await Rebalancer.deploy(); // Deploys the contract

    await rebalancer.waitForDeployment(); // Correct for ethers v6

    console.log(`✅ Contract deployed to: ${await rebalancer.getAddress()}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
