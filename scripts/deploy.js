const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Deploying DeFiRebalancer contract...");

    const Rebalancer = await ethers.getContractFactory("DeFiRebalancer");
    const rebalancer = await Rebalancer.deploy();

    await rebalancer.waitForDeployment();

    console.log(`✅ Contract deployed at: ${await rebalancer.getAddress()}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
