import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import { COLORS } from '@/library/theme'
import { SIZING } from '@/library/sizing'
import Image from 'next/image'
import { BotCardManager, BotCardName, BotCardTag, 
BotCardAssetsText, BotCardDescription, BotCardFeeRate, 
BotCardFeeLabel} from '@/library/typography'
import BTC from '@/public/images/assets/Bitcoin.webp'
import ETH from '@/public/images/assets/ETH.webp'
import LINK from '@/public/images/assets/LINK.webp'
import MANA from '@/public/images/assets/MANA.webp'
import MATIC from '@/public/images/assets/MATIC.webp'
import UNI from '@/public/images/assets/UNI.webp'
import ButtonRenderer from './ButtonRenderer'
import { useAddress, useSigner } from '@thirdweb-dev/react';
import TraderoidAccountABI from "@/contracts/abi/TraderoidAccountABI.json"
import { ethers } from 'ethers';
import { useStateContext } from '@/context/StateContext';;


const BotCard = ({ bot_object, myPortfolio }) => {

    const { showBotStatsModal, setShowBotStatsModal, setPickedBot } = useStateContext();


    // MAIN VARIBLES
    const [ hasInvested, setHasInvested ] = useState(false);
    const [ hoveringButton, setHoveringButtons ] = useState(false);
    const userAddress = useAddress();
    const signer = useSigner();
    const myBots = Boolean(bot_object.manger == userAddress)
    useEffect(() => {
        console.log(hoveringButton)
    }, [hoveringButton])
    
    const cryptoImages = {
        "BTC": BTC,
        "ETH": ETH,
        "LINK": LINK,
        "MANA": MANA,
        "MANIA": MANA,
        "MATIC": MATIC,
        "UNI": UNI,
    };
    const [profitLossRatio, setProfitLossRatio] = useState(0); 
    useEffect(() => {
      setProfitLossRatio(getRandomProfitLossRatio());
      const asyncFunc = async () => {
        if(bot_object.walletAddress){
            const TraderoidAccountContract = new ethers.Contract(bot_object.walletAddress, TraderoidAccountABI, signer);
            const BOTinvesmentAmount = await TraderoidAccountContract.investments(userAddress) 
            if(BOTinvesmentAmount > 0){
                setHasInvested(true)
            }
        }
      }
      asyncFunc()
    }, [bot_object]);

    // HELPER FUNCTIONS
    const getRandomProfitLossRatio = () => {
        const randomNumber = (Math.random() * 200) - 50;
        const roundedNumber = Math.round(randomNumber * 100) / 100;
        return roundedNumber;
    };   
    function truncateString(str) {
        if (str.length <= 13) {
            return str;
        }
        return str.substr(0, 8) + '...' + str.substr(-8);
    }

  return (
    <>      
        <Container onClick={() => { if(!hoveringButton){setPickedBot(bot_object);setShowBotStatsModal(true);}}}>
            <TopContainer>
                <UppermostRow>
                    <BotCardManager>
                        @{bot_object.manager ? truncateString(bot_object.manager): "Unkown Manager"}
                    </BotCardManager>
                    <ProfitLossRatio color={profitLossRatio >= 0 ? COLORS.PigmentGreen600 : COLORS.PersianRed500}>
                        {profitLossRatio >= 0 ? `+ ${profitLossRatio.toFixed(2)}% P/L` : `- ${Math.abs(profitLossRatio).toFixed(2)}% P/L`}
                    </ProfitLossRatio>
                </UppermostRow>
                <BotCardName>
                    {bot_object.name}
                </BotCardName>
                <TagRow>
                    {bot_object.tags.map((tag, index) => (
                        <BotCardTag key={index}>{tag}</BotCardTag>
                    ))}
                </TagRow>
            </TopContainer>
            <DividingLine />
            <BottomContainer>
                    <AssetsRow>
                        <BotCardAssetsText>
                            Assets:
                        </BotCardAssetsText>
                        <AssetImagesRow>
                            {bot_object.assets.map((asset, index) => (
                                <Image
                                    key={index}
                                    src={cryptoImages[asset].src}
                                    alt={`Asset ${index}`}
                                    width={cryptoImages[asset].width}
                                    height={cryptoImages[asset].height}
                                />
                            ))}
                        </AssetImagesRow>
                    </AssetsRow>
                <BotCardDescription>
                    {bot_object.description ? bot_object.description : "This bot has no provided description"}
                </BotCardDescription>
                <BottommostRow>
                    {!hasInvested && (
                        <FeeColumn>
                            <BotCardFeeLabel>
                                Management Fee: &nbsp;
                                <BotCardFeeRate>
                                    {bot_object.ManagementFee}%
                                </BotCardFeeRate>
                            </BotCardFeeLabel>
                            <BotCardFeeLabel>
                                Processing Fee: &nbsp;
                                <BotCardFeeRate>
                                    {bot_object.PerformanceFee}%
                                </BotCardFeeRate>
                            </BotCardFeeLabel>
                        </FeeColumn>
                    )}
                     
                     <ButtonRenderer setHoveringButtons={setHoveringButtons} bot_object={bot_object} 
                     hasInvested={hasInvested}/>
                        
                </BottommostRow>

            </BottomContainer>
        </Container>
    </>
  )
}

const Container = styled.div`
display: flex;
flex-direction: column;
width: calc((100% - ${SIZING.px32} - ${SIZING.px32}) / 3);
aspect-ratio: 1 / 1;
background-color: ${COLORS.Black875};
border-radius: ${SIZING.px16};
transition: 0.4s ease-in-out;
cursor: pointer;
`
const TopContainer = styled.div`
display: flex;
flex-direction: column;
padding-left: ${SIZING.px24};
padding-right: ${SIZING.px24};
padding-top: ${SIZING.px24};
padding-bottom: ${SIZING.px16};
`
const UppermostRow = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
`
const ProfitLossRatio = styled.span`
font-size: ${SIZING.px12};
padding: ${SIZING.px8} ${SIZING.px16};
font-family: "Uncut Sans Semibold";
background-color: ${COLORS.Black850};
border-radius: ${SIZING.px96};
color: ${({ color }) => color};
`
const TagRow = styled.div`
display: flex;
align-items: center;
margin-top: ${SIZING.px12};
gap: ${SIZING.px4};
overflow: scroll;
-webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 95%, rgba(0, 0, 0, 0) 100%);
mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 95%, rgba(0, 0, 0, 0) 100%);
`
const DividingLine = styled.div`
width: 100%;
height: 1px;
background-color: ${COLORS.Black900Default};
`
const BottomContainer = styled.div`
display: flex;
flex-direction: column;
flex-grow: 1;
padding-left: ${SIZING.px24};
padding-right: ${SIZING.px24};
padding-top: ${SIZING.px16};
padding-bottom: ${SIZING.px16};
`
const AssetsRow = styled.div`
display: flex;
align-items: center;
gap: ${SIZING.px8};
`
const AssetImagesRow = styled.div`
display: flex;
align-items: center;
gap: ${SIZING.px4};

img{
width: ${SIZING.px16};
height: ${SIZING.px16};
border-radius: 50%;
opacity: 0.6;
}
`
const BottommostRow = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
margin-top: ${SIZING.px12};
`
const FeeColumn = styled.div`
display: flex;
flex-direction: column;
gap: ${SIZING.px4};
`

export default BotCard