require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    arbitrumSepolia: {
      url: "https://arb-sepolia.g.alchemy.com/v2/GgqNEJtHS2Li3xF0t2ZiGbnxJWqGXVwq",
      accounts: [
        "379dd2289c08efbcd7b16541fa8b863bc271a10d4c7d1f5ef623270118e73d4c",
      ],
      chainId: 421614,
    },
  },
};
