// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PullPrices {

    address[] public dataFeedAddresses;

    // CONRACT ADDRESES TO CALCULATE TEST BALANCES
    address BTC_token_address = 0x3ed272fa7054a80C5650fCB3788dA000a4EED711;
    address ETH_token_address = 0x3766E946C57d281139fAB9656CE50f535E0DfB4d;
    address LINK_token_address = 0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846;
    address MATIC_token_address = 0x3cC861D8f99f60CE1286B1Cef99eAa8fdE7a69c4;
    address MANA_token_address = 0xb0C0B9f4F8386883ca3651B03283F3dF4f154199;
    address UNI_token_address = 0x97dB2DA85708C4cDB73D9601FDE3C1d4f3a0CdaE;

    /**
     * Network: C-chain Fuji
     */
    constructor() {
        // for more: https://docs.chain.link/data-feeds/price-feeds/addresses?network=avalanche&page=1
        dataFeedAddresses = [
            0x5498BB86BC934c8D34FDA08E81D444153d0D06aD, // AVAX/USD
            0x31CF013A08c6Ac228C94551d535d5BAfE19c602a, // BTC/USD
            0x86d67c3D38D2bCeE722E601025C25a575021c6EA, // ETH/USD
            0x34C4c526902d88a3Aa98DB8a9b802603EB1E3470, // LINK/USD
            0xB0924e98CAFC880ed81F6A4cA63FD61006D1f8A0, // MATIC/USD
            0x38a9B7d0BEEc7e63E373853B5772FeF57633FE1E, // Mana/USD
            0x7b219F57a8e9C7303204Af681e9fA69d17ef626f  // UNI/USD
        ];
    }

    /**
     * Returns the latest answer.
     */
    function getLatestAnswers() public view returns (int[] memory) {
        int[] memory answers = new int[](dataFeedAddresses.length);
        for (uint i = 0; i < dataFeedAddresses.length; i++) {
            AggregatorV3Interface dataFeed = AggregatorV3Interface(dataFeedAddresses[i]);
            (, int answer,,,) = dataFeed.latestRoundData();
            answers[i] = answer;
        }
        return answers;
    }

    function calcCurrentWalletValue(address walletAddress) external view returns(uint256) {
        IERC20 BTCtoken = IERC20(BTC_token_address);
        IERC20 ETHtoken = IERC20(ETH_token_address);
        IERC20 LINKtoken = IERC20(LINK_token_address);
        IERC20 MATICtoken = IERC20(MATIC_token_address);
        IERC20 MANAtoken = IERC20(MANA_token_address);
        IERC20 UNItoken = IERC20(UNI_token_address);

        int[] memory prices = getLatestAnswers();
        // Assuming prices array is in the order of BTC, ETH, LINK, MATIC, MANA, UNI
        uint256[] memory convertedPrices = new uint256[](prices.length);
        for (uint256 i = 0; i < prices.length; i++) {
            convertedPrices[i] = uint256(prices[i] / (10**8));
        }
        uint256 totalValue = 0;
        totalValue += walletAddress.balance * convertedPrices[0]; // For native token (e.g., Ether)
        totalValue += BTCtoken.balanceOf(walletAddress) * convertedPrices[1];
        totalValue += ETHtoken.balanceOf(walletAddress) * convertedPrices[2];
        totalValue += LINKtoken.balanceOf(walletAddress) * convertedPrices[3];
        totalValue += MATICtoken.balanceOf(walletAddress) * convertedPrices[4];
        totalValue += MANAtoken.balanceOf(walletAddress) * convertedPrices[5];
        totalValue += UNItoken.balanceOf(walletAddress) * convertedPrices[6];
        
        return totalValue;
    }
}
