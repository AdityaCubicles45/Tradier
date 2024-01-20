import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { COLORS } from '@/library/theme';
import { SIZING } from '@/library/sizing';
import { ChatMessageText } from '@/library/typography';
import { BsRobot } from "react-icons/bs";

const Typewriter = ({ text, speed }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText((prevText) => {
          const nextChar = text[currentIndex];
          currentIndex += 1;
          return prevText + nextChar;
        });
      } else {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return <>{displayedText}</>;
};

const ChatBubbles = ({ messages }) => {
  return (
    <div>
      {messages.map((pair, index) => (
        <div key={index}>
          <ChatBubble isUser={true} message={pair.user} />
          <IconAndTextRow>
            <RobotIcon />
            <ChatBubble isUser={false} messages={messages} message={pair.assistant} index={index}/>
          </IconAndTextRow>
        </div>
      ))}
    </div>
  );
};

const ChatBubble = ({ isUser, message, messages, index }) => {
  return (
    <BubbleWrapper isUser={isUser}>
      <BubbleContent isUser={isUser}>
        {!(isUser == false && index == messages.length - 1) ? (
          <ChatMessageText>{message}</ChatMessageText>
        ) : (
          <Typewriter text={message} speed={20} />
          // <ChatMessageText>{message}</ChatMessageText>
        )}
      </BubbleContent>
    </BubbleWrapper>
  );
};

const BubbleWrapper = styled.div`
display: flex;
justify-content: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
margin-bottom: ${SIZING.px8};
`

const IconAndTextRow = styled.div`
display: flex;
flex-direction: row;
`

const RobotIcon = styled(BsRobot)`
color: ${COLORS.DartmouthGreen100};
font-size: ${SIZING.px32};
margin-right: ${SIZING.px16};
`

const BubbleContent = styled.div`
width: fit-content;
max-width: calc(${SIZING.px416} + ${SIZING.px24});
padding: ${SIZING.px12};
background-color: ${COLORS.Black850};
color: ${(props) => (props.isUser ? COLORS.StandardWhiteDefault : COLORS.Black100)};
border-radius: ${SIZING.px16};
overflow-wrap: break-word;
`

export default ChatBubbles;
