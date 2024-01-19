// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract testSol {

    struct SwapParams {
        uint256 functionType;
        uint256 amountIn;
        uint256 amountOut;
        address[] path;
        uint256 deadline;
    }

    function test() external pure returns(SwapParams memory){
        bytes memory source = "1,20000000000000000,0,0xd00ae08403B9bbb9124bB305C09058E32C39A48c,0x97dB2DA85708C4cDB73D9601FDE3C1d4f3a0CdaE,100000000000000000";
        return parseSwapParams(source);
    }

    function parseSwapParams(bytes memory response) public pure returns (SwapParams memory) { 
        string[] memory params = splitString(string(response), ",");
        address wethAddress = 0xd00ae08403B9bbb9124bB305C09058E32C39A48c;

        SwapParams memory swapParams;
        swapParams.functionType = stringToUint(params[0]);
        swapParams.amountIn = stringToUint(params[1]);
        swapParams.amountOut = stringToUint(params[2]);

        if(swapParams.functionType == 1){
            address[] memory path = new address[](2);
            path[0] = parseAddress(params[3]);
            path[1] = parseAddress(params[4]);
            swapParams.path = path;
            swapParams.deadline = stringToUint(params[5]);
        }  else if (swapParams.functionType == 2) {
            address[] memory path = new address[](2);
            path[0] = wethAddress;
            path[1] = parseAddress(params[3]);
            swapParams.path = path;
            swapParams.deadline = stringToUint(params[4]);
        } else if (swapParams.functionType == 2) {
        address[] memory path = new address[](2);
            path[0] = parseAddress(params[3]); // token
            path[1] = wethAddress; // WETH
            swapParams.path = path;
            swapParams.deadline = stringToUint(params[4]);
        }
        return swapParams;
    }

    
}
