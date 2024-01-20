// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

interface ITraderoidERC6551Account {
    struct SwapParams {
        uint256 functionType;
        uint256 amountIn;
        uint256 amountOut;
        address[] path;
        uint256 deadline;
    }
}

contract ScriptExecuter is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;
    
    bytes32 public donID;

    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;
    string public latestSource;

    error UnexpectedRequestID(bytes32 requestId);

    event Response(bytes32 indexed requestId, bytes response, bytes err);

    constructor()
    FunctionsClient(0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0) 
    ConfirmedOwner(msg.sender) {
        donID = 0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000;
    }

    /**
     * @notice Send a simple request
     * @param source JavaScript source code
     * @param encryptedSecretsUrls Encrypted URLs where to fetch user secrets
     * @param donHostedSecretsSlotID Don hosted secrets slotId
     * @param donHostedSecretsVersion Don hosted secrets version
     * @param args List of arguments accessible from within the source code
     * @param bytesArgs Array of bytes arguments, represented as hex strings
     * @param subscriptionId Billing ID
     */
    function sendRequest(
        string memory source,
        bytes memory encryptedSecretsUrls,
        uint8 donHostedSecretsSlotID,
        uint64 donHostedSecretsVersion,
        string[] memory args,
        bytes[] memory bytesArgs,
        uint64 subscriptionId,
        uint32 gasLimit
    ) external returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        latestSource = source;
        req.initializeRequestForInlineJavaScript(source);
        if (encryptedSecretsUrls.length > 0)
            req.addSecretsReference(encryptedSecretsUrls);
        else if (donHostedSecretsVersion > 0) {
            req.addDONHostedSecrets(
                donHostedSecretsSlotID,
                donHostedSecretsVersion
            );
        }
        if (args.length > 0) req.setArgs(args);
        if (bytesArgs.length > 0) req.setBytesArgs(bytesArgs);
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );
        return s_lastRequestId;
    }

    /**
     * @notice Send a pre-encoded CBOR request
     * @param request CBOR-encoded request data
     * @param subscriptionId Billing ID
     * @param gasLimit The maximum amount of gas the request can consume
     * @return requestId The ID of the sent request
     */
    function sendRequestCBOR(
        bytes memory request,
        uint64 subscriptionId,
        uint32 gasLimit
    ) external onlyOwner returns (bytes32 requestId) {
        s_lastRequestId = _sendRequest(
            request,
            subscriptionId,
            gasLimit,
            donID
        );
        return s_lastRequestId;
    }

    /**
     * @notice Store latest result/error
     * @param requestId The request ID, returned by sendRequest()
     * @param response Aggregated response from the user code
     * @param err Aggregated error from the user code or from the execution pipeline
     * Either response or error parameter will be set, but never both
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId);
        }
        s_lastResponse = response;
        s_lastError = err;
        emit Response(requestId, s_lastResponse, s_lastError);
    }

    // HELPER FUNCTIONS ( SUPER COMPUTATIONALLY EXPENSIVE, NEED A CHEAPER METHOD )
    function parseSwapParams(bytes memory response) public pure returns (ITraderoidERC6551Account.SwapParams memory) {
        string[] memory params = splitString(string(response), "#");
        address wethAddress = 0xd00ae08403B9bbb9124bB305C09058E32C39A48c;

        ITraderoidERC6551Account.SwapParams memory swapParams;
        swapParams.functionType = stringToUint(params[0]);
        swapParams.amountIn = stringToUint(params[1]);
        swapParams.amountOut = stringToUint(params[2]);
        
        if(swapParams.functionType == 1){
            address[] memory path = new address[](2);
            path[0] = parseAddress(params[3]); // token A
            path[1] = parseAddress(params[4]); // token B
            swapParams.path = path;
            swapParams.deadline = stringToUint(params[5]);
        } else if (swapParams.functionType == 2) {  // Logic for swapExactETHForTokens
            address[] memory path = new address[](2);
            path[0] = wethAddress; // WETH
            path[1] = parseAddress(params[3]); // token
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

    function parseAddress(string memory _a) internal pure returns (address _parsedAddress) {
        bytes memory tmp = bytes(_a);
        uint160 iaddr = 0;
        uint160 b1;
        uint160 b2;
        for (uint i = 2; i < 2 + 2 * 20; i += 2) {
            iaddr *= 256;
            b1 = uint160(uint8(tmp[i]));
            b2 = uint160(uint8(tmp[i + 1]));
            if ((b1 >= 97) && (b1 <= 102)) {
                b1 -= 87;
            } else if ((b1 >= 48) && (b1 <= 57)) {
                b1 -= 48;
            }
            if ((b2 >= 97) && (b2 <= 102)) {
                b2 -= 87;
            } else if ((b2 >= 48) && (b2 <= 57)) {
                b2 -= 48;
            }
            iaddr += (b1 * 16 + b2);
        }
        return address(iaddr);
    }

}
