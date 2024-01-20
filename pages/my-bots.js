import React, { useEffect, useState } from 'react'
import LeftBar from '@/components/LeftBar'
import TopBar from '@/components/TopBar'
import {Section, ScrollableContainer, CardGrid} from '@/library/structure'
import BotCard from '@/components/BotCard'
import TradioABI from "@/contracts/abi/TraderoidABI.json"
import { Traderiod_NFT_CONTRACT_ADDRESS } from '@/CENTERAL_VALUES';
import { useStorage, useAddress, useSigner } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const MyBots = () => {

  const [nftData, setNftData] = useState([]);
  const storage = useStorage();
  const userAddress = useAddress();
  const signer = useSigner();

  useEffect(() => {
    const asyncFunc = async () => {
        if(!signer){return}
        const contract = new ethers.Contract(Traderiod_NFT_CONTRACT_ADDRESS, TradioABI, signer);
        const tokenURIs = await contract.getAllTokenURIs(); // Replace with your contract's method
        const dataPromises = tokenURIs.map(async (uri, index) => {
          const data = await storage.download(uri);
          const metadataResponse = await fetch(data.url);
          const botWalletAddress = await contract.BotsWalletAddresses(index);
          const metadata = await metadataResponse.json();
          metadata.walletAddress = botWalletAddress;
          return metadata;
        });
        const results = await Promise.all(dataPromises);
        const filtredResults = results.filter(metadata => metadata.manager === userAddress)//logiv here
        setNftData(filtredResults);
        console.log(results)
    }
    asyncFunc()
  }, [signer])

  return (
    <Section>

      <LeftBar selected="myBots"/>

      <ScrollableContainer>

        <TopBar header="Bots you've created"/>

        <CardGrid>
          {nftData.map((botObject, index) => (
              <BotCard bot_object={botObject} key={index} />
          ))}
        </CardGrid>

      </ScrollableContainer>

    </Section>
  )
}

export default MyBots