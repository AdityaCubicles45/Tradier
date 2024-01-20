import React, { useEffect, useState } from 'react';
import styled, {keyframes} from 'styled-components';
import { COLORS } from '@/library/theme';
import { SIZING } from '@/library/sizing';
import { ModalTopBannerHeader, ModalInputLabel, 
ModalTotalAmountSpan, ModalTotalAmountNumber, ModalTotalAvalancheSpan,
ModalTotalAvalancheNumber, ModalSuccessSpan } from '@/library/typography';
import { MdClose, MdOutlineAutoGraph, MdCheck } from 'react-icons/md';
import Image from 'next/image';
import AvalancheLogo from '@/public/images/AvalancheLogo.webp'
import { useStateContext } from '@/context/StateContext';
import { useBalance, useSigner, useStorage } from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import TraderoidAccountABI from "@/contracts/abi/TraderoidAccountABI.json"
import TradioABI from "@/contracts/abi/TraderoidABI.json"
import { Traderiod_NFT_CONTRACT_ADDRESS } from '@/CENTERAL_VALUES';
import { ethers } from 'ethers';
import ModalLoader from './ModalLoader.js'
import Confetti from 'react-confetti'

const InvestModal = () => {
  
  const { pickedBot } = useStateContext();
  const { data: balance, isLoading } = useBalance(NATIVE_TOKEN_ADDRESS);
  const {showInvestModal, setShowInvestModal} = useStateContext();
  const [ invesmentAmount, setInvesmentAmount ] = useState(0.00)
  const [ amountInUSD, setAmountInUSD ] = useState(0.00);
  const [ showLoader, setShowLoader ] = useState(false)
  const [ showSuccess, setShowSuccess ] = useState(false)
  const [ showError, setShowError ] = useState(false)
  const signer = useSigner();
  const storage = useStorage();

  useEffect(() => {
    if(!pickedBot){setShowInvestModal(false)}
    setShowError(false)
    setShowSuccess(false)    
  }, [pickedBot, showInvestModal])

  async function handleInvest(){
    if(!signer || !pickedBot){return}
    if(pickedBot.id){
        setShowLoader(true)
        try{
        const contract = new ethers.Contract(Traderiod_NFT_CONTRACT_ADDRESS, TradioABI, signer);
        const tokenURIs = await contract.getAllTokenURIs();
        let index = 0;
        for (const uri of tokenURIs) {
            const data = await storage.download(uri);
            const metadataResponse = await fetch(data.url);
            const metadata = await metadataResponse.json();
            if(metadata.id === pickedBot.id) {
                console.log(metadata)
                const botWalletAddress = await contract.BotsWalletAddresses(index);
                console.log(invesmentAmount)
                const TraderoidAccountContract = new ethers.Contract(botWalletAddress, TraderoidAccountABI, signer);
                const amountInWei = ethers.utils.parseEther(invesmentAmount);
                console.log(amountInWei);
                console.log(botWalletAddress)
                const tx = await TraderoidAccountContract.invest({ value: amountInWei });
                await tx.wait();
                setShowSuccess(true);
                setShowLoader(false)
                break;
            }
            index += 1;
        }}catch(err){
            setShowLoader(false);
            setShowError(true);
        }
    }
  }

  useEffect(() => {
    setAmountInUSD(parseFloat(invesmentAmount * 22.14))
  }, [invesmentAmount])

  const confettiColors = [COLORS.PigmentGreen500,
    COLORS.PigmentGreen600, COLORS.PigmentGreen700Default,
    COLORS.PigmentGreen800, COLORS.PigmentGreen900,
    COLORS.DartmouthGreen100, COLORS.DartmouthGreen600,
    COLORS.DartmouthGreen800, COLORS.DartmouthGreen900Default
    ]; 

  return (
    <>
    {showInvestModal &&
    <Background>
        
        {showSuccess && <Confetti gravity={3} colors={confettiColors} />}

        <ModalBody>

        { showLoader ?  
        <TopBanner>
            <ModalTopBannerHeader>
                Investing in {pickedBot?.name}
            </ModalTopBannerHeader>
            <CloseIcon onClick={() => setShowInvestModal(false)}/>
        </TopBanner>
        :
        showSuccess ? 
        <TopBanner>
            <ModalTopBannerHeader>
                Congrats!
            </ModalTopBannerHeader>
            <CloseIcon onClick={() => setShowInvestModal(false)}/>
        </TopBanner>
        :
        showError ?
        <TopBanner>
            <ModalTopBannerHeader>
                ERROR
            </ModalTopBannerHeader>
            <CloseIcon onClick={() => setShowInvestModal(false)}/>
        </TopBanner>
        :
        <TopBanner>
            <ModalTopBannerHeader>
                Invest in {pickedBot?.name}
            </ModalTopBannerHeader>
            <CloseIcon onClick={() => setShowInvestModal(false)}/>
        </TopBanner>
        }


        <BottomContent>

            { showLoader ?  
                <LoaderWrapper>
                    <ModalLoader/>
                </LoaderWrapper>
            :
            showSuccess ? 
                <SuccessWrapper>
                    <ModalSuccessSpan>
                        You have successfully invested in {pickedBot?.name}
                    </ModalSuccessSpan>
                    <CheckContainer>
                        <CheckmarkIcon />
                    </CheckContainer>
                </SuccessWrapper>
            :
            showError ?
                <SuccessWrapper>
                    <ModalSuccessSpan>
                        There was an error in processing your request. 
                        Please try again.
                    </ModalSuccessSpan>
                </SuccessWrapper>
            :
            <Column>
                <LabelAndInputColumn>
                    <ModalInputLabel htmlFor="botAddress">
                        Please enter your investment amount in Avalanche
                    </ModalInputLabel>
                    <InputWrapper>
                    <Input  
                        value={invesmentAmount}
                        onChange={(e) => setInvesmentAmount(e.target.value)}
                        placeholder="00.0"
                        type="number"
                        />
                    <Image src={AvalancheLogo} alt="Avalanche" />
                    </InputWrapper>
                </LabelAndInputColumn>

                <TotalAmountColumn>
                    <TotalAmountRow>
                        <ModalTotalAvalancheSpan>
                            Your remaining Avalanche balance:
                        </ModalTotalAvalancheSpan>
                        <ModalTotalAvalancheNumber>
                            {parseFloat(balance.displayValue).toFixed(5)}
                        </ModalTotalAvalancheNumber>
                    </TotalAmountRow>

                    <TotalAmountRow>
                        <ModalTotalAmountSpan>
                            Your total investment amount in USD:
                        </ModalTotalAmountSpan>
                        <ModalTotalAmountNumber>
                            $ {amountInUSD.toFixed(2)}
                        </ModalTotalAmountNumber>
                    </TotalAmountRow>
                </TotalAmountColumn>
                
                <CTAButton onClick={handleInvest}>
                    <InvestIcon />
                    invest
                </CTAButton>
            </Column>
            }

        </BottomContent>

        </ModalBody>
    </Background>
    }</>
  );
};

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
width: ${SIZING.px480};
background-color: ${COLORS.Black850};
border-radius: ${SIZING.px16};
overflow: clip;
z-index: 11;
`
const TopBanner = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
padding: ${SIZING.px24} ${SIZING.px32};
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
align-items: center;
padding-top: ${SIZING.px24};
padding-left: ${SIZING.px32};
padding-right: ${SIZING.px32};
padding-bottom: ${SIZING.px32};
gap: ${SIZING.px24};
`
const LoaderWrapper = styled.div`
margin: auto;
`
const Column = styled.div`
display: flex;
flex-direction: column;
width: 100%;
gap: ${SIZING.px24};
`
const LabelAndInputColumn = styled.div`
display: flex;
flex-direction: column;
gap: ${SIZING.px8};
`
const InputWrapper = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
padding: ${SIZING.px8} ${SIZING.px16};
background-color: ${COLORS.Black850};
border: 1px solid ${COLORS.Black800};
border-radius: ${SIZING.px96};
font-family: "Uncut Sans Bold";
color: ${COLORS.Black700};

img{
width: ${SIZING.px16};
height: ${SIZING.px16};
}
`
const Input = styled.input`
width: 90%;
line-height: 100%;
letter-spacing: -0.02rem;
font-size: ${SIZING.px16};
outline: none;
border: none;
background-color: transparent;
color: ${COLORS.Black100};
font-family: "Uncut Sans Medium";

&::-webkit-outer-spin-button,
&::-webkit-inner-spin-button {
-webkit-appearance: none;
margin: 0;
}

&[type=number] {
-moz-appearance: textfield;
}

&:focus {
border-color: ${COLORS.Black600};
}

&::placeholder {
font-family: "Uncut Sans Regular";
color: ${COLORS.Black600};
}
`
const CTAButton = styled.button`
display: flex;
align-items: center;
justify-content: center;
gap: ${SIZING.px4};
background-color: ${COLORS.DartmouthGreen800};
padding: ${SIZING.px12} ${SIZING.px24};
letter-spacing: -0.04rem;
color: ${COLORS.StandardWhiteDefault};
font-family: 'Uncut Sans Semibold';
border: none;
outline: none;
border-radius: ${SIZING.px96};
transition: 0.4s ease-in-out;
cursor: pointer;

&:hover {
background-color: ${COLORS.DartmouthGreen900Default};
}
`
const InvestIcon = styled(MdOutlineAutoGraph)`
font-size: ${SIZING.px16};
`
const TotalAmountRow = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
`
const TotalAmountColumn = styled.div`
display: flex;
flex-direction: column;
gap: ${SIZING.px8};
`
const SuccessWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
margin: auto;
gap: ${SIZING.px32};
`
const checkmarkAnimation = keyframes`
0% {
opacity: 0;
}
100% {
opacity: 1;
}
`
const checkmarkContainerAnimation = keyframes`
0% {
background-color: transparent;
border-radius: ${SIZING.px8};
}
100% {
background-color: ${COLORS.DartmouthGreen900Default};
border-radius: 50%;
}
`

const CheckContainer = styled.div`
padding: ${SIZING.px12};
animation: ${checkmarkContainerAnimation} 1s forwards;
animation-delay: 1.4s;
`

const CheckmarkIcon = styled(MdCheck)`
font-size: ${SIZING.px32};
fill: ${COLORS.Black100};
opacity: 0;
animation: ${checkmarkAnimation} 1s forwards;
animation-delay: 0.4s;
`


export default InvestModal
