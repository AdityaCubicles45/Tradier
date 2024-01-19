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

    function stringToUint(string memory s) internal pure returns (uint256 result) {
        bytes memory b = bytes(s);
        uint256 i;
        result = 0;
        for (i = 0; i < b.length; i++) {
            uint8 c = uint8(b[i]);
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
                require(result >= (c - 48), "Overflow occurred"); // Check for overflow
            }
        }
    }

    function splitString(string memory _base, string memory _value) internal pure returns (string[] memory) {
        bytes memory base = bytes(_base);
        bytes memory value = bytes(_value);

        uint count = 1;
        for (uint i = 0; i < base.length; i++) {
            if (keccak256(abi.encodePacked(base[i])) == keccak256(abi.encodePacked(value))) {
                count++;
            }
        }

        string[] memory splitArr = new string[](count);
        uint index = 0;
        uint lastIndex = 0;
        for (uint i = 0; i < base.length; i++) {
            if (keccak256(abi.encodePacked(base[i])) == keccak256(abi.encodePacked(value))) {
                bytes memory word = new bytes(i - lastIndex);
                for (uint j = lastIndex; j < i; j++) {
                    word[j - lastIndex] = base[j];
                }
                splitArr[index] = string(word);
                lastIndex = i + 1; // skip the delimiter
                index++;
            }
        }
        bytes memory lastWord = new bytes(base.length - lastIndex);
        for (uint j = lastIndex; j < base.length; j++) {
            lastWord[j - lastIndex] = base[j];
        }
        splitArr[index] = string(lastWord);

        return splitArr;
    }

    // function parseAddress(string memory _a) internal pure returns (address _parsedAddress) {
    //     bytes memory tmp = bytes(_a);
    //     uint160 iaddr = 0;
    //     uint160 b1;
    //     uint160 b2;
    //     for (uint i = 2; i < 2 + 2 * 20; i += 2) {
    //         iaddr *= 256;
    //         b1 = uint160(uint8(tmp[i]));
    //         b2 = uint160(uint8(tmp[i + 1]));
    //         if ((b1 >= 97) && (b1 <= 102)) {
    //             b1 -= 87;
    //         } else if ((b1 >= 48) && (b1 <= 57)) {
    //             b1 -= 48;
    //         }
    //         if ((b2 >= 97) && (b2 <= 102)) {
    //             b2 -= 87;
    //         } else if ((b2 >= 48) && (b2 <= 57)) {
    //             b2 -= 48;
    //         }
    //         iaddr += (b1 * 16 + b2);
    //     }
    //     return address(iaddr);
    // }
}
