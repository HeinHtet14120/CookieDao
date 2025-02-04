// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IUniswapV3Router {
    function exactInputSingle(
        address tokenIn,
        address tokenOut,
        uint24 fee,
        address recipient,
        uint256 deadline,
        uint256 amountIn,
        uint256 amountOutMinimum,
        uint160 sqrtPriceLimitX96
    ) external payable returns (uint256 amountOut);
}

contract DeFiRebalancer is Ownable {
    IUniswapV3Router public immutable router;

    mapping(address => uint256) public tokenAllocations; // Token -> % Allocation
    mapping(address => bool) public allowedTokens; // Whitelisted Tokens

    event AllocationUpdated(address indexed token, uint256 allocation);
    event SwapExecuted(address indexed fromToken, address indexed toToken, uint256 amountIn, uint256 amountOut);

    constructor() {
        // ✅ UniswapV3 Router (works on Ethereum L2 chains)
        router = IUniswapV3Router(0xE592427A0AEce92De3Edee1F18E0157C05861564); // ✅ Fixed checksummed address
    }

    function setTokenAllocation(address token, uint256 allocation) external onlyOwner {
        require(allocation <= 100, "Allocation exceeds 100%");
        tokenAllocations[token] = allocation;
        allowedTokens[token] = true;
        emit AllocationUpdated(token, allocation);
    }

    function swapTokens(
        address fromToken,
        address toToken,
        uint256 amountIn
    ) external onlyOwner {
        require(allowedTokens[fromToken] && allowedTokens[toToken], "Tokens not allowed");

        IERC20(fromToken).transferFrom(msg.sender, address(this), amountIn);
        IERC20(fromToken).approve(address(router), amountIn);

        uint256 amountOut = router.exactInputSingle(
            fromToken,
            toToken,
            3000, // Uniswap Fee Tier (0.3%)
            msg.sender,
            block.timestamp + 600,
            amountIn,
            0,
            0
        );

        emit SwapExecuted(fromToken, toToken, amountIn, amountOut);
    }

    function withdrawTokens(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(msg.sender, amount);
    }
}
