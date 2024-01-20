// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC1271.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "./interfaces/IERC6551Account.sol";
import "./lib/MinimalReceiver.sol";
import "./lib/ERC6551AccountLib.sol";

// ---------------- INTERFACES ----------------

interface PullPrices {
    function getLatestAnswers() external returns (int[] memory);
}

interface ERC6551RegistryInterface {
    function createAccount(
        address implementation,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        uint256 salt,
        bytes calldata initData
    ) external returns (address);
}

contract TraderoidERC6551Account is IERC165, IERC1271, IERC6551Account {
    uint256 public nonce;
    receive() external payable {}

    // CONTRACTS ADDRESSES !!!!! HARDCODED !!!!!!! 
    address dataPullContract = 0x591F66e155432c171cb24A8644a7C26cb897F712;
    address BTC_token_address = 0x3ed272fa7054a80C5650fCB3788dA000a4EED711;
    address ETH_token_address = 0x3766E946C57d281139fAB9656CE50f535E0DfB4d;
    address LINK_token_address = 0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846;
    address MATIC_token_address = 0x3cC861D8f99f60CE1286B1Cef99eAa8fdE7a69c4;
    address MANA_token_address = 0xb0C0B9f4F8386883ca3651B03283F3dF4f154199;
    address UNI_token_address = 0x97dB2DA85708C4cDB73D9601FDE3C1d4f3a0CdaE;

    // Main Contract States
    uint256 public totalInvested;
    uint256 public currentWalletValue;
    mapping(address => uint256) public investments;

    // other states
    uint256 public managementFeePercentage;
    address payable public platformAdmin;
    bool private _isInitialized = false;
    
    function initialize(
    uint256 _managementFeePercentage, 
    address payable _platformAdmin) external  {
        require(!_isInitialized, "Already initialized");
        managementFeePercentage = _managementFeePercentage;
        platformAdmin = _platformAdmin;
        _isInitialized = true;
    }

        // ------------- MAIN FUNCTIONS -------------

    function invest() external payable {
        require(msg.value > 0, "Investment must be more than 0");

        // fee deduction
        uint256 managerFee = (msg.value * managementFeePercentage) / 100;
        uint256 platformAdminFee = (msg.value * 45) / 10000;
        payable(owner()).transfer(managerFee);
        platformAdmin.transfer(platformAdminFee);
        uint256 amountToInvest = msg.value - (managerFee + platformAdminFee);
        
        // recording invesment
        investments[msg.sender] += amountToInvest;
        totalInvested += amountToInvest;
        updateCurrentWalletValue();
    }

    function updateCurrentWalletValue() internal returns(uint256) {
        // Initialize the price feed contract
        PullPrices priceFeed = PullPrices(dataPullContract);
        IERC20 BTCtoken = IERC20(BTC_token_address);
        IERC20 ETHtoken = IERC20(ETH_token_address);
        IERC20 LINKtoken = IERC20(LINK_token_address);
        IERC20 MATICtoken = IERC20(MATIC_token_address);
        IERC20 MANAtoken = IERC20(MANA_token_address);
        IERC20 UNItoken = IERC20(UNI_token_address);

        // Get the latest prices
        int[] memory prices = priceFeed.getLatestAnswers();

        // Assuming prices array is in the order of BTC, ETH, LINK, MATIC, MANA, UNI
        uint256[] memory convertedPrices = new uint256[](prices.length);
        for (uint256 i = 0; i < prices.length; i++) {
            convertedPrices[i] = uint256(prices[i] / (10**8));
        }

        // Calculate the total value for each token
        uint256 totalValue = 0;
        totalValue += address(this).balance * convertedPrices[0]; // For native token (e.g., Ether)
        totalValue += BTCtoken.balanceOf(address(this)) * convertedPrices[1];
        totalValue += ETHtoken.balanceOf(address(this)) * convertedPrices[2];
        totalValue += LINKtoken.balanceOf(address(this)) * convertedPrices[3];
        totalValue += MATICtoken.balanceOf(address(this)) * convertedPrices[4];
        totalValue += MANAtoken.balanceOf(address(this)) * convertedPrices[5];
        totalValue += UNItoken.balanceOf(address(this)) * convertedPrices[6];
        // Update currentWalletValue
        currentWalletValue = totalValue;
        return currentWalletValue;
    }

    function withdraw(uint256 percentToWithdraw) external returns(uint256) {
        require(percentToWithdraw > 0 && percentToWithdraw <= 100, "Invalid withdrawal percentage");
        require(investments[msg.sender] > 0, "No investment to withdraw");

        uint256 amountToWithdraw = (investments[msg.sender] * percentToWithdraw) / 100;
        require(amountToWithdraw <= investments[msg.sender], "Withdrawal amount exceeds investment");

        uint256 investorShare = investments[msg.sender] / totalInvested;
        uint256 withdrawalAmount = (currentWalletValue * investorShare * percentToWithdraw) / 100;

        // Update the total invested amount and the investor's investment
        totalInvested -= amountToWithdraw;
        investments[msg.sender] -= amountToWithdraw;

        updateCurrentWalletValue(); 

        // Transfer the withdrawal amount to the investor
        payable(msg.sender).transfer(withdrawalAmount);
        return withdrawalAmount;
    }

    function excuteTrade() external view { // TO BE FIXED
        require(msg.sender == owner(), "Not token owner");
        (,, uint256 tokenId) = ERC6551AccountLib.token();        
        // call CL Functtion here
    }

        // ------------- BASE FUNCTIONS -------------

    function executeCall( // TO BE FIXED 
        address to,
        uint256 value,
        bytes calldata data
    ) external payable returns (bytes memory result) {
        require(msg.sender == owner(), "Not token owner");

        ++nonce;

        emit TransactionExecuted(to, value, data);

        bool success;
        (success, result) = to.call{value: value}(data);

        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    function token()
        external
        view
        returns (
            uint256,
            address,
            uint256
        )
    {
        return ERC6551AccountLib.token();
    }

    function owner() public view returns (address) {
        (uint256 chainId, address tokenContract, uint256 tokenId) = this.token();
        if (chainId != block.chainid) return address(0);

        return IERC721(tokenContract).ownerOf(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public pure returns (bool) {
        return (interfaceId == type(IERC165).interfaceId ||
            interfaceId == type(IERC6551Account).interfaceId);
    }

    function isValidSignature(bytes32 hash, bytes memory signature)
        external
        view
        returns (bytes4 magicValue)
    {
        bool isValid = SignatureChecker.isValidSignatureNow(owner(), hash, signature);

        if (isValid) {
            return IERC1271.isValidSignature.selector;
        }

        return "";
    }

}