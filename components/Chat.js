import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components'
import { COLORS } from '@/library/theme'
import { SIZING } from '@/library/sizing'
import Image from 'next/image';
import ChatBubbles from './ChatBubbles';
import { BsStars } from "react-icons/bs";
import LogoUncolored from '@/public/images/LogoUncolored.webp'
import { ChatTopBarSpan, ChatBottomColumnSmall, ChatInitialScreenHeader,
ChatGridNormalSpan, ChatGridBoldSpan} from '@/library/typography';
import { AssistantChatBubble } from './ChatBubbles';
import { MdArrowUpward } from "react-icons/md";
import ChatLoader from './ChatLoader.js'

const Chat = () => {
  
  const [ thread, setThread ] = useState();

  const [isTyping, setIsTyping] = useState(false);
  const [showInitialScreen, setShowInitialScreen] = useState(true);
  const [showChatContainer, setShowChatContainer] = useState(false);

  const [showLoader, setShowLoader] = useState(false);
  const [messages, setMessages] = useState([]);
  const userMessageRef = useRef();
  const chatContainerRef = useRef(null);
  const chatContainer = chatContainerRef.current;

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    }, [messages]);

  
  function handleInput(event) {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    const inputValue = event.target.value.trim();
    setIsTyping(inputValue.length > 0);
  }

  async function handleSend() {
    
    const prompt = userMessageRef.current.value.trim();

    if (prompt !== '' && showLoader == false) {
        try {
            setShowInitialScreen(false);
            setShowLoader(true)
            userMessageRef.current.value = "";
            const response = await fetch('/api/askDroidvisor', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ prompt }),
            });
            if (!response.ok) {
              throw new Error(`Error: ${response.status}`);
            }        
            const data = await response.json();
            setShowLoader(false)
            setMessages([...messages, { user: prompt, assistant: data.content }]);
            setShowChatContainer(true);
          } catch (err) {
            console.log('Error:', err);
            return;
          }
        }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleExampleSearchClick = (exampleSearch) => {
    // Set the example search as the input value
    userMessageRef.current.value = exampleSearch;
    // Update the isTyping state based on the new input value
    setIsTyping(userMessageRef.current.value.trim().length > 0);
  };


  return (
    <Section>
        <TopBar>
            <ArtificialIntelligenceIcon/>
            <ChatTopBarSpan>
                AI Advisor
            </ChatTopBarSpan>
        </TopBar>

        {showInitialScreen && (
            <InitialScreen>
                <InitialScreenTopColumn>
                    <Image src={LogoUncolored} alt="Tradroid.io"/>
                    <ChatInitialScreenHeader>
                        How can we assist you today?
                    </ChatInitialScreenHeader>
                </InitialScreenTopColumn>
                <InitialScreenBottomGrid>
                    <GridItem onClick={() => handleExampleSearchClick('Tell me about current crypto trends')}>
                        <ChatGridNormalSpan>
                            Tell me about
                        </ChatGridNormalSpan>
                        <ChatGridBoldSpan>
                            current crypto trends
                        </ChatGridBoldSpan>
                    </GridItem>
                    <GridItem onClick={() => handleExampleSearchClick('Tell me awesome bot trading strategies')}>
                        <ChatGridNormalSpan>
                            Tell me awesome 
                        </ChatGridNormalSpan>
                        <ChatGridBoldSpan>
                            bot trading strategies
                        </ChatGridBoldSpan>
                    </GridItem>
                    <GridItem onClick={() => handleExampleSearchClick('Tell me what bots are trending')}>
                        <ChatGridNormalSpan>
                            Tell me
                        </ChatGridNormalSpan>
                        <ChatGridBoldSpan>
                            what bots are trending
                        </ChatGridBoldSpan>
                    </GridItem>
                    <GridItem onClick={() => handleExampleSearchClick('Give me a list of online resources about bot trading')}>                   
                        <ChatGridNormalSpan>
                            Give me a list of
                        </ChatGridNormalSpan>
                        <ChatGridBoldSpan>
                            online resources about bot trading
                        </ChatGridBoldSpan>
                    </GridItem>
                </InitialScreenBottomGrid>
            </InitialScreen>
        )}

        {showLoader ? (
            <LoadingContainer>

                <LoadingSpan>
                    Analyzing market data...
                </LoadingSpan>

                <ChatLoader />
                
            </LoadingContainer>
        ):<>
        {showChatContainer && (
            <ChatContainer ref={chatContainerRef}>
                <ChatBubbles messages={messages} />
            </ChatContainer>
        )}
        </>}



        <BottomColumn>
            <MessageWrapper>
                <MessageInput rows={1} ref={userMessageRef} onInput={handleInput} placeholder="Message Droidviser..." onKeyDown={handleKeyDown}/> 
                <SendButton disabled={!isTyping} onClick={handleSend}>
                    <UpArrow />
                </SendButton>                     
            </MessageWrapper>
            <ChatBottomColumnSmall>
                Droidviser can make mistakes. Consider checking important information.
            </ChatBottomColumnSmall>
        </BottomColumn>

    </Section>
  )
}

const Section = styled.section`
display: flex;
flex-direction: column;
height: calc(100% - ${SIZING.px96});
max-height: calc(100% - ${SIZING.px96});
justify-content: space-between;
padding: ${SIZING.px16} ${SIZING.px16};
background-color: ${COLORS.Black875};
border-radius: ${SIZING.px16};
`
const TopBar = styled.div`
display: flex;
align-items: center;
gap: ${SIZING.px4};
margin-bottom: ${SIZING.px24};
`
const ArtificialIntelligenceIcon = styled(BsStars)`
font-size: ${SIZING.px14};
fill: ${COLORS.DartmouthGreen600};
`
const BottomColumn = styled.div`
display: flex;
flex-direction: column;
align-items: center;
gap: ${SIZING.px16};
`
const MessageWrapper = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
width: 100%;
padding-left: ${SIZING.px12};
padding-right: ${SIZING.px12};
padding-top: ${SIZING.px12};
padding-bottom: ${SIZING.px12};
background-color: ${COLORS.Black850};
border: 1px solid ${COLORS.Black800};
border-radius: ${SIZING.px16};
`
const MessageInput = styled.textarea`
max-height: ${SIZING.px128};
line-height: 130%;
width: calc(100% - ${SIZING.px48} - ${SIZING.px16});
font-size: ${SIZING.px16};
letter-spacing: -0.02rem;
font-family: "Uncut Sans Medium";
color: ${COLORS.Black100};
background-color: transparent;
border: none;
outline: none;
resize: none;

&::placeholder {
font-family: "Uncut Sans Medium";
color: ${COLORS.Black600};
}
`
const UpArrow = styled(MdArrowUpward)`
font-size: ${SIZING.px16};
fill: ${props => (props.disabled ? COLORS.Black200 : COLORS.StandardWhiteDefault)};
`
const SendButton = styled.div`
display: flex;
align-items: center;
justify-content: center;
margin-top: auto;
width: ${SIZING.px48};
height: ${SIZING.px32};
background-color: ${props => (props.disabled ? COLORS.Black800 : COLORS.DartmouthGreen900Default)};
border-radius: ${SIZING.px96};
cursor: ${props => (props.disabled ? 'auto' : 'pointer')};

`
const InitialScreen = styled.div`
display: flex;
flex-direction: column;
margin-top: auto;
margin-bottom: ${SIZING.px64};
gap: ${SIZING.px96};
`
const InitialScreenTopColumn = styled.div`
display: flex;
flex-direction: column;
align-items: center;
gap: ${SIZING.px16};

img{
width: ${SIZING.px64};
height: ${SIZING.px64};
}
`
const InitialScreenBottomGrid = styled.div`
display: grid;
margin: 0 auto;
grid-template-columns: repeat(2, 1fr);
grid-template-rows: repeat(2, 1fr);
grid-column-gap: ${SIZING.px8};
grid-row-gap: ${SIZING.px8};
width: 70%;
`
const GridItem = styled.button`
display: flex;
flex-direction: column;
gap: ${SIZING.px2};
padding: ${SIZING.px8} ${SIZING.px24};
background-color: ${COLORS.Black850};
border: 1px solid ${COLORS.Black800};
border-radius: ${SIZING.px96};
transition: 0.2s ease-in-out;
cursor: pointer;

&:hover{
background-color: transparent;
}
`
const ChatContainer = styled.div`
display: flex;
flex-direction: column;
margin-top: auto;
margin-bottom: ${SIZING.px24};
max-height: ${SIZING.px416};
overflow-y: scroll;
overflow-x: hidden;
`
const LoadingContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
margin: auto;
gap: ${SIZING.px32};
`
const loadingSpanAnimation = keyframes`
0% {
letter-spacing: -0.1rem;
}
50% {
letter-spacing: -0.08rem;
}
100% {
letter-spacing: -0.1rem;
}
`
const LoadingSpan = styled.div`
font-size: ${SIZING.px24};
letter-spacing: -0.1rem;
color: ${COLORS.Black200};
font-family: "Uncut Sans Medium";
animation: ${loadingSpanAnimation} 0.4s infinite;
`

export default Chat