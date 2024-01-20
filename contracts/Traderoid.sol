// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Imports for the NFT collection contract
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// Imports for ERC6551 wallet-bounded accounts
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC1271.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./interfaces/IERC6551Account.sol";
import "./lib/MinimalReceiver.sol";
import "./lib/ERC6551AccountLib.sol";
// import "./ScriptExecuter.sol";
// NOTE: THE ADDRESSES ARE HARDCODED FOR DEMONSTRATION PURPOSES AND WILL BE CHANGED ON LIVE

// ---------------- INTERFACES ----------------

interface IPullPrices {
    function getLatestAnswers() external view returns (int[] memory);
    function calcCurrentWalletValue(address walletAddress) external view returns(uint256);
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

interface ISushiSwapRouter {

    // Swap an exact amount of input tokens for as many output tokens as possible, along the route determined by the path.
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    // Swap an exact amount of ETH for as many output tokens as possible, along the route determined by the path.
    function swapExactETHForTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable returns (uint[] memory amounts);

    // Swap an exact amount of tokens for as much ETH as possible, along the route determined by the path.
    function swapExactTokensForETH(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}

interface IScriptExecuter {

    struct SwapParams {
        uint256 functionType;
        uint256 amountIn;
        uint256 amountOut;
        address[] path;
        uint256 deadline;
    }

    function s_lastResponse() external returns (bytes memory);
    function parseSwapParams(bytes memory response) external pure returns (IScriptExecuter.SwapParams memory);
    function sendRequest(
        string memory source,
        bytes memory encryptedSecretsUrls,
        uint8 donHostedSecretsSlotID,
        uint64 donHostedSecretsVersion,
        string[] memory args,
        bytes[] memory bytesArgs,
        uint64 subscriptionId,
        uint32 gasLimit
    ) external returns (bytes32 requestId) ;

}

// ---------------- CONTRACTS SECTION ----------------

contract TraderoidERC6551Account is IERC165, IERC1271, IERC6551Account {
    uint256 public nonce;
    receive() external payable {}

    // CONTRACTS ADDRESSES !!!!! HARDCODED !!!!!!! 
    ISushiSwapRouter public SushiSwapRouter; 
    IPullPrices public priceCalculatorContract;
    IScriptExecuter public scriptExecuter;

    // Main Contract States
    uint256 public totalShares; // Total shares issued
    mapping(address => uint256) public investments;
    address[] public AssetAddresses;

    // other states
    uint256 public managementFeePercentage;
    address payable public platformAdmin;
    bool private _isInitialized = false;
    string public sourceCode;

    function setScriptExecuter(address _scriptExeAddress) external {
        require(msg.sender == owner(), "only owner");
        scriptExecuter = IScriptExecuter(_scriptExeAddress);
    }
    
    function initialize(
    uint256 _managementFeePercentage, 
    address payable _platformAdmin,
    string calldata _sourceCode
    ) external  {
        require(!_isInitialized, "Already initialized");
        managementFeePercentage = _managementFeePercentage;
        platformAdmin = _platformAdmin;
        sourceCode = _sourceCode;
        SushiSwapRouter = ISushiSwapRouter(0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506);
        priceCalculatorContract = IPullPrices(0xB0c675e33cc1b246a9287A09983bb9731f2569A9);
        scriptExecuter = IScriptExecuter(0xE1617a5822BC555545c79e3f721e225DA19e71C4);
        AssetAddresses = [
            0x3ed272fa7054a80C5650fCB3788dA000a4EED711, // TEST BTC
            0x3766E946C57d281139fAB9656CE50f535E0DfB4d, // TEST ETH
            0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846, // TEST LINK
            0x3cC861D8f99f60CE1286B1Cef99eAa8fdE7a69c4, // TEST MATIC
            0xb0C0B9f4F8386883ca3651B03283F3dF4f154199, // TEST MANA
            0x97dB2DA85708C4cDB73D9601FDE3C1d4f3a0CdaE // TEST UNI
        ];
        _isInitialized = true;
    }
    event TradeExecuted(IScriptExecuter.SwapParams params);

        // ------------- MAIN FUNCTIONS -------------

    function getUserEstimateWithdrawValue(uint256 percentToWithdraw) external view returns(uint256){
        uint256 walletValue = priceCalculatorContract.calcCurrentWalletValue(address(this));
        uint256 investorShare = (investments[msg.sender] * percentToWithdraw) / 100;
        return (investorShare * walletValue) / totalShares;
    }

    function getWalletValue() public view returns(uint256) {
        uint256 currentWalletValue = priceCalculatorContract.calcCurrentWalletValue(address(this));
        return currentWalletValue;
    }

    function invest() external payable {
        require(msg.value > 0, "Investment must be more than 0");

        // fee deduction
        uint256 managerFee = (msg.value * managementFeePercentage) / 100;
        uint256 platformAdminFee = (msg.value * 45) / 10000;
        payable(owner()).transfer(managerFee);
        platformAdmin.transfer(platformAdminFee);
        uint256 amountToInvest = msg.value - (managerFee + platformAdminFee);
        
        // recording invesment
        uint256 sharesToIssue = calculateShares(amountToInvest);
        investments[msg.sender] += sharesToIssue;
        totalShares += sharesToIssue;
    }

    function calculateShares(uint256 amount) internal view returns (uint256) {
        if (totalShares == 0) {
            return amount;
        }
        uint256 walletValue = priceCalculatorContract.calcCurrentWalletValue(address(this));
        return (amount * totalShares) / walletValue;
    }

    function withdraw(uint256 percentToWithdraw) external returns(uint256) {
        require(percentToWithdraw > 0 && percentToWithdraw <= 100, "Invalid withdrawal percentage");
        require(investments[msg.sender] > 0, "No investment to withdraw");

        uint256 investorShare = (investments[msg.sender] * percentToWithdraw) / 100;
        uint256 amountInvestorWithdraws = investorShare / totalShares;
        
        // NATIVE
        uint256 nativeWithdrawalTokenAmount = (address(this).balance * investorShare) / totalShares;
        payable(msg.sender).transfer(nativeWithdrawalTokenAmount);
        
        for (uint i = 0; i < AssetAddresses.length; i++) {
            IERC20 token_asset = IERC20(AssetAddresses[i]);
            uint256 tokenBalance = token_asset.balanceOf(address(this));
            uint256 withdrawalTokenAmount = (tokenBalance * investorShare) / totalShares;
            if(withdrawalTokenAmount > 0){
            require(token_asset.transfer(msg.sender, withdrawalTokenAmount), "Token transfer failed");
            }
        }

        totalShares -= investorShare;
        investments[msg.sender] -= investorShare;
        return amountInvestorWithdraws;
    }

    // add require sender to be owner
    function excuteScript(
        string memory _sourceCode,
        bytes memory _encryptedSecretsUrls,
        uint8 _donHostedSecretsSlotID,
        uint64 _donHostedSecretsVersion,
        string[] memory _args,
        bytes[] memory _bytesArgs,
        uint64 _subscriptionId,
        uint32 _gasLimit
    ) external {
        scriptExecuter.sendRequest(
            _sourceCode, 
            _encryptedSecretsUrls, 
            _donHostedSecretsSlotID, 
            _donHostedSecretsVersion, 
            _args, _bytesArgs, _subscriptionId, _gasLimit);
    }

    // In the future will need a resteriction on the caller
    function selfExcuteTrade() external { 

        bytes memory response = scriptExecuter.s_lastResponse();
        IScriptExecuter.SwapParams memory params = scriptExecuter.parseSwapParams(response);
        emit TradeExecuted(params);

        if (params.functionType == 1) { // swapExactTokensForTokens
            IERC20(params.path[0]).approve(address(SushiSwapRouter), params.amountIn);
            SushiSwapRouter.swapExactTokensForTokens(
                params.amountIn,
                params.amountOut,
                params.path,
                msg.sender,
                params.deadline
            );
        } else if (params.functionType == 2) { // swapExactNATIVEForTokens
            SushiSwapRouter.swapExactETHForTokens{ value: params.amountIn }(
                params.amountOut,
                params.path,
                msg.sender,
                params.deadline
            );
        } else if (params.functionType == 3) { // swapTokensForExactNATIVE
            IERC20(params.path[0]).approve(address(SushiSwapRouter), params.amountIn);
            SushiSwapRouter.swapExactTokensForETH(
                params.amountOut,
                params.amountIn,
                params.path,
                msg.sender,
                params.deadline
            );
        }
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

contract Traderoid is ERC721, Ownable {
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    // Mapping from token ID to metadata URI
    mapping(uint256 => string) private _tokenURIs;

    // NFT Wallet Creation
    ERC6551RegistryInterface ERC6551RegistryContract;
    mapping(uint256 => address) public BotsWalletAddresses;
    
    constructor(address _ERC6551RegistryAddress) 
        ERC721("Traderoid Bots", "TDRB") 
        Ownable(msg.sender) 
    {
        ERC6551RegistryContract = ERC6551RegistryInterface(_ERC6551RegistryAddress);
    }

    function safeMint(string memory metadataURI, uint256 mangerFee, string calldata source) public {
        uint256 tokenId = _tokenIdCounter.current(); 
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, metadataURI); // Link the metadata URI
        _tokenIdCounter.increment();

        // Make the NFT wallet address & account.
        address payable platformAdmin = payable(owner()); 
        TraderoidERC6551Account implmentationAddress = new TraderoidERC6551Account();
        address NFTwalletAddress = ERC6551RegistryContract.createAccount(
            address(implmentationAddress), // implmentation
            43113, // chain ID !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! HARDCODED
            address(this), // token contract
            tokenId, // token id
            0, // salt
            abi.encodeWithSignature("initialize(uint256,address,string)", 
            mangerFee, platformAdmin,source) // init data 
        );
        BotsWalletAddresses[tokenId] = address(NFTwalletAddress);
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function getAllTokenURIs() public view returns (string[] memory) {
        uint256 totalTokens = _tokenIdCounter.current();
        string[] memory uris = new string[](totalTokens);
        for (uint256 i = 0; i < totalTokens; i++) {
            if (ownerOf(i) != address(0)) {
                uris[i] = _tokenURIs[i];
            }
        }
        return uris;
    }

}

