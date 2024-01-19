export const FUJI_CL_FUNCTIONS_ROUTER = "0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0";
export const FUJI_CL_FUNCTIONS_DON_ID = "0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000";
export const FUJI_SECERTS_ENCRYPT_GATEAWAY = "https://01.functions-gateway.testnet.chain.link/";
export const SUSHISWAP_ROUTER = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"
export const Traderiod_NFT_CONTRACT_ADDRESS = "0x3d21C03DEF6e610EC67b40E61dA85089C005Ab20"
export const PULL_LATEST_PRICES_CONTRACT_ADDRESS = "0xB0c675e33cc1b246a9287A09983bb9731f2569A9";

// const funcType='1';const amountIn='20000000000000000';const amountOutMin = '0';const address1 = '0xd00ae08403B9bbb9124bB305C09058E32C39A48c';const address2 = '0x97dB2DA85708C4cDB73D9601FDE3C1d4f3a0CdaE';const deadline = '100000000000000000';const string = `${funcType},${amountIn},${amountOutMin},${address1},${address2},${deadline}`;return Functions.encodeString(string.toString());
// 0x92Ef56667832a3a5584Ba18aFf8Bb7177e57e8c6 my testing traderoid account


// SCRIPT EXE: 0xE1617a5822BC555545c79e3f721e225DA19e71C4
// TRADEROID: 0xbeF80d72560bE45D7020AEA455eeA57a3DFae9Fd
// TRAD ACC: 0x0F3d63f37271Dc406Bfec1961Bc96Be538c5A9f6
// testExe" 0xA5adB319539fcb7c8B5fCaa77C75F4d823c550D6

/** DOCUMENTATION
 *  // https://docs.traderjoexyz.com/guides/swap-tokens
 * 
 * Your Script must comply with chainlink's functions JS source code requirments
 * Your script's return function must follow the following format:
 * 
 * return Functinos.encodeString(returnableActions)
 * 
 * returnableActions = "x,x,x,x,x,x" // paramteres seprated by ","
 * 
 * 
 * After minting your NFT, use Chainlink Automation to automatically have excuteTrade();
 * 
 * */ 

/*
const funcType='1';const amountIn='20000000000000000';const amountOutMin = '0';const address1 = '0xd00ae08403B9bbb9124bB305C09058E32C39A48c';const address2 = '0x97dB2DA85708C4cDB73D9601FDE3C1d4f3a0CdaE';const deadline = '100000000000000000';const string = `${funcType}#${amountIn}#${amountOutMin}#${address1}#${address2}#${deadline}`;return Functions.encodeString(string.toString());

const chainlinkApiRequest = {
  url: 'https://api.openai.com/v1/chat/completions',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${secrets[0]}`,
    'Content-Type': 'application/json',
  },
  data: JSON.stringify({
    'model': 'gpt-3.5-turbo-16k',
    'messages': [
      {
        'role': 'system',
        'content': 'You are a cryptocurrency trading bot.'
      },
      {
        'role': 'user',
        'content': 'Who won the world series in 2020?'
      },
    ]
  }),
};

// Execute the API request (Promise)
const apiResponse = await Functions.makeHttpRequest(chainlinkApiRequest);
if (apiResponse.status !== 200) {
  console.error('API request failed:', apiResponse.statusText);
  throw Error('Request failed');
}

const responseText = apiResponse.data.choices[0].message.content;

console.log('ChatGPT response:', responseText);
// Return the response from ChatGPT
return Functions.encodeString(responseText);
*/