import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import LeftBar from '@/components/LeftBar'
import TopBar from '@/components/TopBar'
import Chart from 'chart.js/auto'
import { COLORS } from '@/library/theme';
import { SIZING } from '@/library/sizing';
import { Section, ScrollableContainer, CardGrid } from '@/library/structure'
import MyPortfolioChart from '@/components/MyPortfolioChart'
import BotCard from '@/components/BotCard'
import { useAddress, useStorage, useSigner } from '@thirdweb-dev/react';
import TraderoidAccountABI from "@/contracts/abi/TraderoidAccountABI.json"
import TradioABI from "@/contracts/abi/TraderoidABI.json"
import { Traderiod_NFT_CONTRACT_ADDRESS } from '@/CENTERAL_VALUES';
import { ethers } from 'ethers';

const MyPortfolio = () => {

  const [ loadingProfile, setLoadingProfile ] = useState(true);
  const [ total_invesment_amount, set_total_invesment_amount] = useState();
  const [ nftData, setNftData ] = useState([]);
  const signer = useSigner();
  const storage = useStorage();
  const userAddress = useAddress();

  useEffect(() => { 
    const asyncFunc = async () => {
        if(!signer){return}
        if(!userAddress){return}
        let total_invesment_amount_inner = 0;
        const invested_NFTs = [];
        const contract = new ethers.Contract(Traderiod_NFT_CONTRACT_ADDRESS, TradioABI, signer);
        const tokenURIs = await contract.getAllTokenURIs(); // Replace with your contract's method
        const dataPromises = tokenURIs.map(async (uri, index) => {
          const data = await storage.download(uri);
          const metadataResponse = await fetch(data.url);
          const botWalletAddress = await contract.BotsWalletAddresses(index);
          const metadata = await metadataResponse.json();
          metadata.walletAddress = botWalletAddress;
          const TraderoidAccountContract = new ethers.Contract(botWalletAddress, TraderoidAccountABI, signer);
          const BOTinvesmentAmount = await TraderoidAccountContract.investments(userAddress) 
          metadata.BOTinvesmentAmount = BOTinvesmentAmount;
          total_invesment_amount_inner += Number(BOTinvesmentAmount);
          console.log(Number(BOTinvesmentAmount))
          if(BOTinvesmentAmount > 0){
            invested_NFTs.push(metadata)
          }
          return metadata;
        });
        const results = await Promise.all(dataPromises);
        setNftData(invested_NFTs);
        set_total_invesment_amount(total_invesment_amount_inner / (10**18));
        setLoadingProfile(false);
    }
    asyncFunc()
  }, [signer, userAddress])

  return (
    <Section>

      <LeftBar selected="myPortfolio"/>

      <ScrollableContainer>

        <TopBar header="Your portfolio"/>

        {loadingProfile ?
          <div>Loading Profile..</div>
        : <>
        
        <MyPortfolioChart total_invesment_amount={total_invesment_amount} nftData={nftData}/>

        <BotsYouHaveInvestedInHeader>
          Bots you&apos;ve invested in
        </BotsYouHaveInvestedInHeader>

        <CardGrid>
          {nftData.map((botObject, index) => (
              <BotCard bot_object={botObject} key={index} myPortfolio myBots={false}/>
          ))}
        </CardGrid>
        </>
        }

      </ScrollableContainer>

    </Section>
  )
}

const BotsYouHaveInvestedInHeader = styled.h1`
margin-top: ${SIZING.px48};
margin-bottom: ${SIZING.px32};
font-size: ${SIZING.px24};
letter-spacing: -0.075rem;
color: ${COLORS.Black100};
font-family: "Uncut Sans Semibold";
`

export default MyPortfolio