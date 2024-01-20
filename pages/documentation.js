import React, { useEffect } from 'react'
import { COLORS } from '@/library/theme'
import { SIZING } from '@/library/sizing'
import { useRouter } from 'next/router'
import TopLeftLogo from '@/components/TopLeftLogo'
import TableOfContent from '@/components/documentation/TableOfContent.js'
import TraderoidChart from '@/public/images/TraderoidChart.png'
import styled from 'styled-components'
import Image from 'next/image'

const Documentation = () => {

  const router = useRouter();

  function scrollFunc(spanId){
    const element = document.getElementById(spanId);
    const container = document.getElementById('content-container');
    if (element && container) {
        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        container.scrollBy({
            top: elementRect.top - containerRect.top,
            behavior: 'smooth'
        });
    }
  }

  return (
    <Section>
        <DocsNav>
            <LogoContainer onClick={() => router.push('/marketplace')}>
                <TopLeftLogo />
            </LogoContainer>
            <BackToAppButton onClick={() => router.push("/marketplace")}>
                Back to App
            </BackToAppButton>
        </DocsNav>
        <TotalHoldingRow>
        <TableOfContent scrollFunc={scrollFunc}/>
            <MainContentContainer id='content-container'>
                
                <MainHeader>Creating a Script & Bot Full Documentation</MainHeader>
                <Divider />
 
                <SectionHeader id='1'>Proccess Overview</SectionHeader>
                <Pargraph>In this documentation we will take you a step by step on how to create your own
                    decentralized transparent crypto trading bot NFT. The proccess is pretty straightforward,
                    the NFT has it{"'"}s own wallet and the wallet has 3 main functionalities, invest, withdraw, 
                    and execute trade.
                </Pargraph>
                <Pargraph>Below is a diagram showing the proccess from start to finish, though 
                the documentaion will mostly cover how to write a Traderoid compatible script.
                </Pargraph>
                <ChartImage>
                    <Image src={TraderoidChart}
                        alt="Traderoid Chart" 
                        // height={431}
                    />
                </ChartImage>
                <Pargraph>As you can see from the chart the proccess starts out with the Traderoid Contract.
                The Traderoid Contract lets you mint Traderoid, which are decentralized algorathmitc trading
                NFTs that lets others invest money transparently in it. When you mint your NFT, you will give
                it some common metadata items such as description, name, fees, etc... but most importantly you
                will assign it a script. So let's get started with how to make the script.
                </Pargraph>
                <Divider />
                <SectionHeader id='2'>Setting up Environment</SectionHeader>
                <Pargraph>To start off, the script must be written in JavaScript and has some limitations
                    in terms of usage of external libraries and functions like &quot;fetch&quot;. Since our 
                    script is primarly calling a Chainlink functions, we must comply with the same regulations.
                    We will go over some of the basics and functions but for more details
                    please refer to the <ExternalLink onClick={() => window.open("https://docs.chain.link/chainlink-functions/api-reference/javascript-source", 
                    "_blank")}>Chainlink Functions Documentation</ExternalLink>
                </Pargraph>
                <Pargraph>The following are our 3 main limitations when it comes to writing the script
                Allowed Modules: Only vanilla <ExternalLink onClick={() => window.open("https://deno.com/","_blank")}>Deno</ExternalLink> is 
                supported, without module imports. Return Type: Must return a JavaScript Buffer object 
                representing the response bytes sent back to the invoking contract. Time Limit: Scripts must 
                execute within a 10-second timeframe; otherwise, they will be terminated, and an error 
                will be returned to the requesting contract. Also while not needed in most JavaScript runtimes,
                in our case it is essential to have a semi-column after every line of code.
                </Pargraph>
                <Pargraph>The recommended approaches you can take for writing and testing your script is using the  <ExternalLink onClick={() => window.open("https://functions.chain.link/playground","_blank")}>Chainlink Playground</ExternalLink>. 
                    This will give you the most releastic testing environment for ensuring your script returns the 
                    desired values.
                </Pargraph>
                <Divider />
                <SectionHeader id='3'>Writing up the script</SectionHeader>
                <Pargraph>There are a 2 main functions that you must be familiar with.</Pargraph>
                <Pargraph>The first one is Functions.makeHttpRequest{"()"}, this allows you to call external 
                    APIs, which could be usefull if you want to call a python trading algorithm you
                    alread have {"assuming it is on a server set up as an API"}. You can think of it 
                    as a fetch request in JavaScript. Below is an example of how this call might be.
                </Pargraph>
                <CodeSnippet>
                const response = await Functions.makeHttpRequest{`({
    url: "http://example.com",
    method: "GET", // Optional
    // Other optional parameters
})`}
                </CodeSnippet>
                <Pargraph>You can use this to also feed your script live data from applications like
                    Coinmarketcap, Coinbase, Coingecko, or even a Chainlink{"'"} data feeds interface.
                    While building it, please ensure that it won't mess up the time limit of the entire
                    script which is 10 minutes. 
                </Pargraph>
                <Pargraph>The next thing that should come to your mind is that most of these external requests
                    will require an API key. So Chainlink provides a solution safely store your API keys in a
                    decentralized encrypted manner. These encrypted secret values can either be uploaded to
                    the DON or hosted at a remote URL. Then, a reference to the encrypted secrets can be 
                    used when making a Functions request. Below is an example of how to embed a secerts varible
                    in the source code, you actually will pass the secert's location when calling the on chain
                    function. For more details of implemntation refer to Chainlink's <ExternalLink onClick={() => window.open("https://docs.chain.link/chainlink-functions/resources/secrets","_blank")}>Secerts Management</ExternalLink>.
                </Pargraph>
                <CodeSnippet>
{`const chainlinkApiRequest = {
  url: 'https://api.openai.com/v1/chat/completions',
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${secrets[0]}\`,
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
const apiResponse = await Functions.makeHttpRequest(chainlinkApiRequest);`
}
                </CodeSnippet>
                <Pargraph>
                    You can see from above pargraph how we can embed secerts, but it is not the only thing we embed,
                    we can also embed arguments to make our script operate more dynamically. Below is an example
                    of how we can use arguments {"(also passed during contract function call)"}, for more 
                    refer to <ExternalLink onClick={() => window.open("https://docs.chain.link/chainlink-functions/api-reference/javascript-source", 
                    "_blank")}>Chainlink Functions</ExternalLink>.
                </Pargraph>
                <CodeSnippet>
{
`// Decimals can be passed from the token contract decimals() function
const srcToken = args[0] // Token source (selling)
const srcDecimals = args[1]
const destToken = args[2] //Token destination (buying)
const destDecimals = args[3]
const amount = args[4] // Amount of source token to trade

// Pull from the Paraswap DEX Aggregator router
const paraswapRequest = await Functions.makeHttpRequest({
  url: \`https://apiv5.paraswap.io/prices?srcToken=\${srcToken}&srcDecimals=\${srcDecimals}&destToken=\${destToken}&destDecimals=\${destDecimals}&amount=\${amount}&network=1\`,
})

if (paraswapRequest.error) {
  console.log(JSON.stringify(paraswapRequest, null, 2));
  throw new Error('Paraswap Request error')
}

console.log("Optimal trade route found! \\n")
console.log(
  \`Swap found to exchange \${10 ** -paraswapRequest.data.priceRoute.srcDecimals * parseInt(paraswapRequest.data.priceRoute.srcAmount)} of \${paraswapRequest.data.priceRoute.srcToken} into \${10 ** -paraswapRequest.data.priceRoute.destDecimals * parseInt(paraswapRequest.data.priceRoute.destAmount)} of \${paraswapRequest.data.priceRoute.destToken}\`
)

//If direct swap is found with one pool return that pool address
if (paraswapRequest.data.priceRoute.bestRoute[0].percent == 100) {
  console.log(
    \`One direct route found through \${JSON.stringify(paraswapRequest.data.priceRoute.bestRoute[0].swaps[0].swapExchanges[0].exchange, null, 2)} \\n\`
  )
  //Sample Output: One direct route found through UniswapV2
  console.log(JSON.stringify(paraswapRequest.data.priceRoute.bestRoute[0].swaps[0].swapExchanges[0].data, null, 2))
}

return Functions.encodeUint256(parseInt(paraswapRequest.data.priceRoute.destAmount));

//Sample Output: "Swap found to exchange 1 of 0x514910771af9ca656af840dff83e8264ecf986ca into 6.732330036871376 of 0x6b175474e89094c44da98b954eedeac495271d0f"
`}
                </CodeSnippet>

                <Divider />
                <SectionHeader id='4'>Script Return Types</SectionHeader>

                <Pargraph>
                    Now that you are familiar with all your options, its time to talk about the return function
                    of your source code. You must use one of the following three functions in your return statement.
                    Functions.encodeUint256, which converts a positive integer to a 32-byte Buffer for a uint256 in Solidity.
                    Functions.encodeInt256, which Converts an integer to a 32-byte Buffer for an int256 in Solidity. <strong>Functions.encodeString{'()'}</strong>, 
                    Converts a string to a Buffer for a string type in Solidity. For the sake of our bot script,
                    we will only use the <strong>Functions.encodeString{'()'}</strong> as it will be foundation for the response type
                    that will be parsed to preform on chain actions.
                </Pargraph>
                <Pargraph>
                    Since Traderoid is currently in beta, we only support very limited actions, but we are planning be expanding
                    very rapidly when it comes to adding more on-chain actions. The current three on chain actions we support are 
                    swapExactTokensForTokens, swapExactETHForTokens,
                    swapExactTokensForETH. They are currently interacting with the sushi swap router pools on the
                    Avalanche C-chain {"(our blockchain of chocie)"}. Your return function will return a string encoded
                    in the "Traderoid format" which is just values seprated by a {'#'} delimeter.
                </Pargraph>
                <Pargraph>
                    <strong>Tradoird Format</strong>: the first value in your encoded string is a number that represenets
                    the function type you will want to code for now, it's 1 for swapExactTokensForTokens, 2 for swapExactETHForTokens,
                    and 3 for swapExactTokensForETH. The seconed parameter of the encoded strings are your amountIn.
                    The third parameter of your encoded string is your amountOutMin. The third parameter is the token{"'s"} address your swapping to
                    for the functionType 2 and 3, as for functionType 1, it's token A{"'s"} adddress, 
                    while paramter 4 would be token B{"'s"} address. The next parameter and final one, will be the deadline
                    for making the trade. In case you are not familiar with SushiSwap or DEXes, here is more information on what those
                    parameters actually do <ExternalLink onClick={() => window.open("https://docs.sushi.com/docs/Products/Classic%20AMM/Contracts/V2Router02", "_blank")}>SushiSwap Docs</ExternalLink>.
                </Pargraph>
                <Pargraph>
                    Here's an example of a <strong>Tradoird Format</strong> and it's breakdown.
                </Pargraph>
                <CodeSnippet>
{`// Example source code returned string:
1#20000000000000000#0#0xd00ae08403B9bbb9124bB305C09058E32C39A48c
#0x97dB2DA85708C4cDB73D9601FDE3C1d4f3a0CdaE#100000000000000000

function type = 1; // indicating a swapExactTokensForTokens.
amountIn = 20000000000000000; // we would like to put 0.2 of token a.
amountOutMin = 0; // minmum limit on how much of token b we would like.
token A address = 0xd00ae08403B9bbb9124bB305C09058E32C39A48c; // WAVAX
token B addess = 0x97dB2DA85708C4cDB73D9601FDE3C1d4f3a0CdaE; // UNISWAP
deadline = 100000000000000000; 
// function will be on-chain excuted if feasible.
`}
                </CodeSnippet>
                <Pargraph>Your final string should of course depend on your algorathmitc script calculations,
                    given that you can interact with APIs, you can rely on more than just math. For example,
                    you can fetch up to date information from any API whther it be sementic or trends.
                </Pargraph>

                <Divider />
                <SectionHeader id='5'>Creating the bot</SectionHeader>
                <Pargraph>Now that you created your script, it's time to talk about minting the 
                    your Traderoid. The proccess is really simple. Navigate to <ExternalLink onClick={() => window.open("/create-a-bot", "_blank")}>Traderoid Create a Bot</ExternalLink> page,
                    and follow the inputs, and drag and drop your javascript source file. 
                </Pargraph>
                <Pargraph>
                    For your bot you will require a name, which helps you brand your bot to investors.
                    Then you will need a description and tags, which will be your place to explain however you like 
                    about your Bot and let people know what your bot is all about. Next you will select from a list 
                    of avalible assets, and these are the assets your bot trades with, and for beta saftey we limited
                    the selection for now. Finally, you will select your preformance and management fees. A 
                    management fee is a percentage that the investor has to pay upfront when he puts money in 
                    your bot's wallet. The preformance fee is depend on the return ROI of your bot, which 
                    secures an addtional cut to th you, the bot manager. Note that the traderoid platform admins
                    also have a platform general mangment fee that is a very small 0.45% for all invesments. A final 
                    note is that once your bot is minted, you cannot change any of it's metadata or source code.
                </Pargraph>

                <Divider />
                <SectionHeader id='6'>Executing the Script</SectionHeader>
                <Pargraph>Now that you succeffly deployed your own Traderoid Bot, there are still some 
                    work to do, namely executing your scripts and automating it. To execute the script 
                    you will be calling your Tradoird's account contract excuteScript. Now you can just 
                    call the execution script.
                </Pargraph>
                <Pargraph> Your execution script requires some parameters. The first parameters are
                encryptedSecretsUrls, donHostedSecretsSlotID, donHostedSecretsVersion. These will only matter
                if your source code used secerts. If you used secerts please plug the values you implemnted 
                for your secerts using Chainlink{"'"}s DON services. Next you will be asked for args and
                bytesArgs, which are once again only relevant id your script utilized dynamic arguments 
                in them, if you did, this is an extra way for you to make your trading more advanced and
                dynamic. Finaly you will be asked for subscriptionId{"(more info below)"} and gasLimit. 
                </Pargraph>
                <Pargraph> You will need a subscriptionId for chainlink functions in order to execute your
                    script, to do that please navigate to <ExternalLink onClick={() => window.open("https://functions.chain.link/","_open")}>
                    Chainlink Functions</ExternalLink> and create a subscription, fund it with some LINK, and
                    then add your Traderoid Account contract address as a consumer. You can then use your
                    subscriptionId to power your script's chainlink function execution. Since this inherintly
                    will cost some value, along with the gas fees, we recommend adding a fee that will take 
                    these factors into consideration, to ensure profit.
                </Pargraph>

                <Divider />
                <SectionHeader id='7'>Automating the Execution</SectionHeader>    
                <Pargraph>As per any trading bot, it is unconvienit for a human to manually run the script
                    , thus we recommend using Chainlink automation, or another prefferable method to you.
                    To use chainlink automation you will need to create an upkeep and fund it, and do the
                    nessercy configurations to make it execute the executeScript function.
                </Pargraph>
                <Pargraph> For more information on Chainlink automation please refer to <ExternalLink onClick={() =>  window.open("https://chain.link/automation", "_blank")}>
                    Chainlink Automation</ExternalLink>. One of the many reasons we recommend 
                    Chainlink automation is due to it{"'s"} reliability and flexibility with triggering logic,
                    we highly recommend you check them out to maximize your power. <ExternalLink onClick={() => window.open("https://docs.chain.link/chainlink-automation/guides/job-scheduler","_blank")}>
                    Time-based automated triggers</ExternalLink>, <ExternalLink onClick={() => window.open("https://docs.chain.link/chainlink-automation/guides/register-upkeep","_blank")}>
                    Custom Logic upkeep automated triggers</ExternalLink> , and <ExternalLink onClick={() => window.open("https://docs.chain.link/chainlink-automation/guides/log-trigger", "_blank")}>
                    Log based automated triggers</ExternalLink>.
                </Pargraph>

                <Divider />
                <SectionHeader id='8'>Final Remarks</SectionHeader>   
                <Pargraph>Thank you for taking the time and developing bots on
                the Traderoid platform.</Pargraph>
                <Pargraph>We would like to thank Chainlink for enabling this innovative platform
                using there amazing blockchain breakthrough technology. In addtion to functions and 
                automation, we also use the data feeds to calculate wallet values for withdrawing.
                Feel free to check out more on <ExternalLink onClick={() => window.open("https://chain.link/","_blank")}>Chainlink</ExternalLink>.
                </Pargraph> 
                <Pargraph>
                We chose the Avalanche C-Chain for our DApp due to its high performance, scalability, 
                and low transaction fees, ensuring a smooth user experience. Its compatibility with the 
                Ethereum ecosystem enhances our DApp's functionality, while its robust security and 
                eco-friendly nature align with our commitment to a sustainable and secure blockchain 
                environment.
                </Pargraph>
                <Pargraph>We would like to thank all developers on the platform as well as all investors.
                    Please note to do you own due diligence before investing in bots.
                </Pargraph>
            
            </MainContentContainer>
        </TotalHoldingRow>
    </Section>
  )
}

const Section = styled.section`
width: 100%;
height: 100vh;
background-color: ${COLORS.Black875};
overflow: hidden;
`

const DocsNav = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
background-color: ${COLORS.Black900Default};
`

const LogoContainer = styled.div`
display: flex;
align-items: center;
padding: 0 ${SIZING.px32};
height: ${SIZING.px96};
cursor: pointer;
`

const BackToAppButton = styled.button`
color: ${COLORS.DartmouthGreen600};
background-color: ${COLORS.Black850};
font-size: ${SIZING.px16};
outline: none;
border: none;
font-family: "Uncut Sans Medium";
margin-right: ${SIZING.px24};
padding: ${SIZING.px20} ${SIZING.px24};
border-radius: ${SIZING.px12};
cursor: pointer;
transition: 0.3s ease-in-out all;
&:hover{
    border: 0.2vw double ${COLORS.DartmouthGreen600};
    border-radius: ${SIZING.px20};
}
`

const TotalHoldingRow = styled.div`
display: flex;
flex-direction: row;
width: 100%;
height: 100%;
`

const MainContentContainer = styled.div`
display: flex;
flex-direction: column;
margin-top: ${SIZING.px24};
padding-left: ${SIZING.px32}; 
padding-bottom: ${SIZING.px128};
width: 79vw;
overflow-y: scroll;
overflow: auto;
&::-webkit-scrollbar {
  display: block;
  width: 8px;
  height: 8px;
}
&::-webkit-scrollbar-thumb {
    border-radius: ${SIZING.px12};
    background-color: ${COLORS.Black600};
} 
-ms-overflow-style: auto;
scrollbar-width: auto;
`

const MainHeader = styled.span`
font-family: "Uncut Sans Bold";
font-size: ${SIZING.px40};
margin-bottom: ${SIZING.px20};
`

const Divider = styled.div`
width: 80%;
border-bottom: 0.1vw solid ${COLORS.Black200};
margin-bottom: ${SIZING.px24};
`

const SectionHeader = styled.span`
font-family: "Uncut Sans Medium";
font-size: ${SIZING.px32};
margin-bottom: ${SIZING.px24};
`

const Pargraph = styled.p`
width: 80%;
text-align: justify;
margin-bottom: ${SIZING.px24};
font-size: ${SIZING.px20};
color: ${COLORS.Black100};
`

const ExternalLink = styled.a`
color: ${COLORS.PersianRed500};
cursor: pointer;
text-decoration: underline;
`

const CodeSnippet = styled.pre`
  width: 80%;
  height: auto;
  background-color: ${COLORS.Black800}; /* VS Code background color */
  color: #d4d4d4; /* Default text color */
  font-family: 'Fira Code', 'Courier New', monospace;
  font-weight: bold;
  padding: ${SIZING.px24} 0;
  border-radius: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-bottom: ${SIZING.px24};
`

const ChartImage = styled.div`
display: flex;
width: 80%; 
margin-bottom: ${SIZING.px24};

img{
display: block;
width: 100%;
height: auto;
border: 1px solid ${COLORS.Black100};
}
`

export default Documentation