// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IPancakeRouter {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}

contract DeFiRebalancer is Ownable {
    IPancakeRouter public immutable router;

    mapping(address => uint256) public tokenAllocations; // Token -> % Allocation
    mapping(address => bool) public allowedTokens; // Whitelisted Tokens

    event AllocationUpdated(address indexed token, uint256 allocation);
    event SwapSuggested(address indexed fromToken, address indexed toToken, uint256 amount);

    constructor() {
        router = IPancakeRouter(0xCc7aDc94F3D80127849D2b41b6439b7CF1eB4Ae0); // ✅ PancakeSwap Testnet Router
    }

    function setTokenAllocation(address token, uint256 allocation) external onlyOwner {
        require(allocation <= 100, "Allocation exceeds 100%");
        tokenAllocations[token] = allocation;
        allowedTokens[token] = true;
        emit AllocationUpdated(token, allocation);
    }

    function suggestSwap(address fromToken, address toToken, uint256 amount) external onlyOwner {
        require(allowedTokens[fromToken] && allowedTokens[toToken], "Tokens not allowed");
        emit SwapSuggested(fromToken, toToken, amount);
    }

    function withdrawTokens(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(msg.sender, amount);
    }
}
