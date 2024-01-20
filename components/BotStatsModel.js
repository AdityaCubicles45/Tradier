import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { COLORS } from '@/library/theme'
import { SIZING } from '@/library/sizing'
import { ModalTopBannerHeader } from '@/library/typography'
import { useStateContext } from '@/context/StateContext';
import { MdClose } from 'react-icons/md';
import { MdContentCopy } from "react-icons/md";
import { ethers } from 'ethers'
import Image from 'next/image'
import BTC from '@/public/images/assets/Bitcoin.webp'
import ETH from '@/public/images/assets/ETH.webp'
import LINK from '@/public/images/assets/LINK.webp'
import MANA from '@/public/images/assets/MANA.webp'
import MATIC from '@/public/images/assets/MATIC.webp'
import UNI from '@/public/images/assets/UNI.webp'
import AVAX from '@/public/images/assets/AVAX.webp'
import { useSigner } from '@thirdweb-dev/react'
import { PULL_LATEST_PRICES_CONTRACT_ADDRESS } from '@/CENTERAL_VALUES'

const BotStatsModel = () => {

  const {showBotStatsModal, setShowBotStatsModal, pickedBot} = useStateContext();
  const [ balanceSheet, setBalanceSheet ] = useState();
  const signer = useSigner();

  const priceContractAbi = [ "function getLatestAnswers() public view returns (int[])" ];
  const tokenAbi = ["function balanceOf(address owner) view returns (uint256)"];

  const tokenAddresses = {
    BTC: "0x3ed272fa7054a80C5650fCB3788dA000a4EED711",
    ETH: "0x3766E946C57d281139fAB9656CE50f535E0DfB4d",
    LINK: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
    MATIC: "0x3cC861D8f99f60CE1286B1Cef99eAa8fdE7a69c4",
    MANA: "0xb0C0B9f4F8386883ca3651B03283F3dF4f154199",
    UNI: "0x97dB2DA85708C4cDB73D9601FDE3C1d4f3a0CdaE"
  };
  const cryptoImages = {
    "AVAX": AVAX,
    "BTC": BTC,
    "ETH": ETH,
    "LINK": LINK,
    "MANA": MANA,
    "MATIC": MATIC,
    "UNI": UNI,
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        window.alert('Wallet address copied to clipboard!');
      })
      .catch((err) => {
        console.error('Unable to copy to clipboard', err);
        window.alert('Error copying wallet address to clipboard. Please try again.');
      });
  };

  async function calculateBalances(walletAddress) {
    const provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
    // Fetch AVAX balance
    const avaxBalance = await provider.getBalance(walletAddress);
    const pricesContract = new ethers.Contract(PULL_LATEST_PRICES_CONTRACT_ADDRESS, priceContractAbi, signer);
    const latestTokenPrices = await pricesContract.getLatestAnswers();
    let balances = [{name: "AVAX", balance: ethers.utils.formatEther(avaxBalance), price: latestTokenPrices[0]}];
    // Fetch balances for each token
    let i = 1;
    for (const [tokenName, tokenAddress] of Object.entries(tokenAddresses)) {
        const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
        const balance = await tokenContract.balanceOf(walletAddress);
        balances.push({name:[tokenName],balance: ethers.utils.formatUnits(balance, 18), price: latestTokenPrices[i]}); // Assuming all tokens have 18 decimals
        i += 1;
    }
    for (let token of balances) {
        token.price = (token.price / (10**8))
    }
    return balances;
  }

  useEffect(() => {
    if(pickedBot){
        const AsyncFunc = async () => {
            setBalanceSheet(undefined);
            const balances = await calculateBalances(pickedBot.walletAddress)
            setBalanceSheet(balances)
        }
        AsyncFunc();
    }
  }, [pickedBot])

  return (
    <>
        {(showBotStatsModal) && (
            <Background>

                <ModalBody>

                    <TopBanner>
                        <ModalTopBannerHeader>
                            {pickedBot?.name}
                        </ModalTopBannerHeader>
                        <CloseIcon onClick={() => setShowBotStatsModal(false)}/>
                    </TopBanner>

                    { balanceSheet ? 
                    <BottomContent>
                        <AddressRowColumn>
                            <AddressRow>
                                Manager:
                                <RightRow>
                                {pickedBot?.manager}
                                <ContentCopyIcon onClick={() => copyToClipboard(pickedBot?.manager)} />
                                </RightRow>
                            </AddressRow>
                            <AddressRow>
                                Wallet: 
                                <RightRow>
                                {pickedBot?.walletAddress}
                                <ContentCopyIcon onClick={() => copyToClipboard(pickedBot?.walletAddress)} />
                                </RightRow>
                            </AddressRow>
                        </AddressRowColumn>
                        <FeeRow>
                            <Fee>
                                Management Fee:&nbsp;
                                <FeeRate>
                                    {pickedBot?.ManagementFee}%
                                </FeeRate>
                            </Fee>
                            <Fee>
                                Performance Fee:&nbsp;
                                <FeeRate>
                                    {pickedBot?.PerformanceFee}%
                                </FeeRate>
                            </Fee>
                        </FeeRow>
                        <Description>
                            Description: {pickedBot?.description}
                        </Description>

                        <BalancesHeader>
                            Balance Sheet
                        </BalancesHeader>
                        
                        <BalanceRowsColumn>
                        <MasterRow>
                            <BalanceRow>
                                AVAX:
                            <AmountRow>
                                {Number(balanceSheet[0].balance).toFixed(5)}
                                <Image src={AVAX} alt='AVAX' />
                            </AmountRow>
                            </BalanceRow>
                            <BalanceRow>
                                Value:
                            <AmountRow>
                                {Number(balanceSheet[0].price).toFixed(5)}&nbsp;USD                                 
                            </AmountRow>
                            </BalanceRow>
                        </MasterRow>

                        {(balanceSheet.slice(1)).map((asset) => (
                            <>{asset.balance > 0 && 
                            <MasterRow key={asset}>
                                <BalanceRow>
                                {asset.name}:
                                <AmountRow>
                                    {Number(asset.balance)}
                                    <Image src={cryptoImages[asset.name]} alt={asset} />
                                </AmountRow>
                                </BalanceRow>
                                <BalanceRow>
                                Value:
                                <AmountRow>
                                {new Intl.NumberFormat('en-US', { style: 'decimal', maximumFractionDigits: 3 }).format(
            asset.balance * asset.price)}&nbsp;USD 
            </AmountRow>
                                </BalanceRow>
                            </MasterRow>
                            }</>
                        ))}

                        </BalanceRowsColumn>

                        <TotalValue>
                            Total wallet value:
                            <TotalValueAmount>
                            {new Intl.NumberFormat('en-US', { style: 'decimal', maximumFractionDigits: 2 }).format(
    balanceSheet.reduce((total, item) => total + (item.balance * item.price), 0))}&nbsp;USD
                            </TotalValueAmount>
                        </TotalValue>

                        <InvestButton>
                            invest
                        </InvestButton>

                    </BottomContent> : <LoaderDiv>Loading...</LoaderDiv>}
                    
                </ModalBody>

            </Background>
        )}
    </>
  )
}

const Background = styled.div`
display: flex;
justify-content: center;
align-items: center;
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background-color: rgba(20, 20, 20, 0.75);
backdrop-filter: blur(${SIZING.px2});
z-index: 10;
`
const ModalBody = styled.div`
display: flex;
flex-direction: column;
width: ${SIZING.px640};
background-color: ${COLORS.Black850};
border-radius: ${SIZING.px16};
overflow: clip;
z-index: 11;
`
const TopBanner = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
padding: ${SIZING.px20} ${SIZING.px32};
border-bottom: 2px solid rgba(20, 20, 20, 0.75);
`
const CloseIcon = styled(MdClose)`
font-size: ${SIZING.px24};
fill: ${COLORS.Black600};
transition: 0.2s ease-in-out;
cursor: pointer;

&:hover {
fill: ${COLORS.Black400};
}
`
const BottomContent = styled.div`
display: flex;
flex-direction: column;
padding-top: ${SIZING.px16};
padding-left: ${SIZING.px32};
padding-right: ${SIZING.px32};
padding-bottom: ${SIZING.px24};
`
const AddressRowColumn = styled.div`
display: flex;
flex-direction: column;
gap: ${SIZING.px8};
`
const AddressRow = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
font-size: ${SIZING.px16};
color: ${COLORS.Black200};
letter-spacing: -0.02rem;
font-family: "Uncut Sans Medium";
`
const RightRow = styled.div`
display: flex;
align-items: center;
gap: ${SIZING.px8};
font-size: ${SIZING.px14};
color: ${COLORS.Black600};
`
const ContentCopyIcon = styled(MdContentCopy)`
font-size: ${SIZING.px16};
fill: ${COLORS.Black100};
transition: 0.2s ease-in-out;
cursor: pointer;

&:hover{
transform: scale(1.05);
fill: ${COLORS.StandardWhiteDefault};
}
`
const FeeRow = styled.div`
display: flex;
align-items: center;
justify-content: center;
gap: ${SIZING.px32};
margin-top: ${SIZING.px12};
padding-top: ${SIZING.px12};
border-top: 1px solid ${COLORS.Black800};
`
const Fee = styled.div`
display: flex;
align-items: center;
justify-content: center;
font-size: ${SIZING.px12};
color: ${COLORS.Black200};
font-family: "Uncut Sans Medium";
`
const FeeRate = styled.div`
font-size: ${SIZING.px12};
color: ${COLORS.Black500};
`
const Description = styled.p`
max-height: ${SIZING.px96};
line-height: 120%;
margin-top: ${SIZING.px12};
overflow-y: scroll;
font-size: ${SIZING.px12};
border-bottom: 1px solid ${COLORS.Black800};
padding-bottom: ${SIZING.px12};
color: ${COLORS.Black400};
font-family: "Uncut Sans Regular";
letter-spacing: 0rem;

&::-webkit-scrollbar {
display: block;
width: ${SIZING.px8};
}
&::-webkit-scrollbar-thumb {
border-radius: ${SIZING.px12};
background-color: ${COLORS.Black800};
} 
-ms-overflow-style: auto;
scrollbar-width: auto;
`
const BalancesHeader = styled.span`
margin-top: ${SIZING.px12};
font-size: ${SIZING.px16};
color: ${COLORS.Black200};
letter-spacing: -0.02rem;
font-family: "Uncut Sans Medium";
// border-bottom: 1px solid ${COLORS.Black800};
`
const BalanceRowsColumn = styled.div`
display: flex;
flex-direction: column;
margin-top: ${SIZING.px12};
gap: ${SIZING.px6};
`
const MasterRow = styled.div`
display: flex;
align-items: center;
gap: ${SIZING.px32};
`
const BalanceRow = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
width: 50%;
letter-spacing: -0.02rem;
font-size: ${SIZING.px14};
font-family: "Uncut Sans Regular";
color: ${COLORS.Black200};
`
const AmountRow = styled.div`
display: flex;
align-items: center;
gap: ${SIZING.px8};
font-size: ${SIZING.px14};
letter-spacing: 0.10rem;
font-family: "Uncut Sans Medium";
color: ${COLORS.Black100};

img{
width: ${SIZING.px14};
height: ${SIZING.px14};
opacity: 0.8;
}
`
const TotalValue = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
margin-top: ${SIZING.px12};
padding-top: ${SIZING.px12};
letter-spacing: 0.10rem;
font-size: ${SIZING.px16};
font-family: "Uncut Sans Medium";
color: ${COLORS.Black500};
border-top: 1px solid ${COLORS.Black800};
`
const TotalValueAmount = styled.span`
display: flex;
font-size: ${SIZING.px16};
font-family: "Uncut Sans Semibold";
color: ${COLORS.StandardWhiteDefault};
`
const InvestButton = styled.button`
margin-top: ${SIZING.px24};
padding: ${SIZING.px12} ${SIZING.px24};
letter-spacing: -0.04rem;
font-size: ${SIZING.px20};
background-color: ${COLORS.DartmouthGreen800};
border-radius: ${SIZING.px24};
font-family: "Uncut Sans Semibold";
border: none;
outline: none;
transition: 0.2s ease-in-out;
cursor: pointer;

&:hover{
background-color: ${COLORS.DartmouthGreen900Default};
}
`

const LoaderDiv = styled.div`
padding-top: ${SIZING.px24};
padding-bottom: ${SIZING.px24};
padding-left: ${SIZING.px24};
font-size: ${SIZING.px24};
`

export default BotStatsModel