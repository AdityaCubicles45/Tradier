import { ThirdwebProvider, metamaskWallet, 
    coinbaseWallet, walletConnect, localWallet, 
    embeddedWallet} from "@thirdweb-dev/react";
    import { createGlobalStyle } from 'styled-components'
    import { COLORS } from "@/library/theme";
    import { StateContext } from "@/context/StateContext";
    import WithdrawModal from '@/components/WithdrawModal'
    import InvestModal from '@/components/InvestModal';
    import BotStatsModel from "@/components/BotStatsModel";
    import Head from "next/head";
    
    export const GlobalStyle = createGlobalStyle`
      * 
      {
        font-size: 1.157vw;
        line-height: 100%;
        font-family: "Uncut Sans Regular";
        color: ${COLORS.StandardWhiteDefault};
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        ::-webkit-scrollbar {
          display: none;
        }
        -ms-overflow-style: none;
        scrollbar-width: none; 
        a {
          color: inherit; 
          text-decoration: none; 
        }
    
        @font-face {
          font-family: "Uncut Sans Bold";
          src: url("/fonts/UncutSans/Bold.otf");
        }
        @font-face {
          font-family: "Uncut Sans Book";
          src: url("/fonts/UncutSans/Book.otf");
        }
        @font-face {
          font-family: "Uncut Sans Light";
          src: url("/fonts/UncutSans/Light.otf");
        }
        @font-face {
          font-family: "Uncut Sans Medium";
          src: url("/fonts/UncutSans/Medium.otf");
        }
        @font-face {
          font-family: "Uncut Sans Regular";
          src: url("/fonts/UncutSans/Regular.otf");
        }
        @font-face {
          font-family: "Uncut Sans Semibold";
          src: url("/fonts/UncutSans/Semibold.otf");
        }
      }
    `
    
    export default function App({ Component, pageProps }) {
      return (
      <>    
        <Head>
          <title>Traderoid</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="Transparent, decentralized trading bot NFT marketplace!" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
    
        <StateContext>
          <ThirdwebProvider
              activeChain="avalanche-fuji" clientId="cc42b11c37e27d6f284c1fd4203573d1"
              supportedWallets={[ metamaskWallet({ recommended: true }), coinbaseWallet(),walletConnect(),
                localWallet(), embeddedWallet({ auth: { options: ["email","google","apple","facebook",],},}),
              ]}
          >
            <WithdrawModal />
            <InvestModal />
            <BotStatsModel />
            <Component {...pageProps} />
          </ThirdwebProvider>
        </StateContext>
    
        <GlobalStyle />
      </>
      )
    }