import React from 'react';
import styled, { keyframes } from 'styled-components';
import { SIZING } from '@/library/sizing';
import { COLORS } from '@/library/theme';

const Loader = () => (
  <LoaderContainer>
    <LoaderDot />
  </LoaderContainer>
);

const l7Animation = keyframes`
  16.67% {background-size: ${SIZING.px16} 30%, ${SIZING.px16} 30%, ${SIZING.px16} 50%, ${SIZING.px16} 50%, ${SIZING.px16} 50%, ${SIZING.px16} 50%}
  33.33% {background-size: ${SIZING.px16} 30%, ${SIZING.px16} 30%, ${SIZING.px16} 30%, ${SIZING.px16} 30%, ${SIZING.px16} 50%, ${SIZING.px16} 50%}
  50%    {background-size: ${SIZING.px16} 30%, ${SIZING.px16} 30%, ${SIZING.px16} 30%, ${SIZING.px16} 30%, ${SIZING.px16} 30%, ${SIZING.px16} 30%}
  66.67% {background-size: ${SIZING.px16} 50%, ${SIZING.px16} 50%, ${SIZING.px16} 30%, ${SIZING.px16} 30%, ${SIZING.px16} 30%, ${SIZING.px16} 30%}
  83.33% {background-size: ${SIZING.px16} 50%, ${SIZING.px16} 50%, ${SIZING.px16} 50%, ${SIZING.px16} 50%, ${SIZING.px16} 30%, ${SIZING.px16} 30%}
`;

const l7DotAnimation = keyframes`
  20%  {left: 0px}
  40%  {left: calc(50% - ${SIZING.px8})}
  60%  {left: calc(100% - ${SIZING.px16})}
  80%, 100% {left: 100%}
`;


const LoaderContainer = styled.div`
  width: ${SIZING.px80};
  aspect-ratio: 1;
  --c: no-repeat linear-gradient(${COLORS.Black800} 0 0);
  background: 
    var(--c) 0    0,
    var(--c) 0    100%, 
    var(--c) 50%  0,  
    var(--c) 50%  100%, 
    var(--c) 100% 0, 
    var(--c) 100% 100%;
  border-radius: ${SIZING.px4};
  background-size: ${SIZING.px16} 50%;
  animation: ${l7Animation} 1s infinite;
  position: relative;
  overflow: hidden;
`;

const LoaderDot = styled.div`
  content: "";
  position: absolute;
  width: ${SIZING.px16};
  height: ${SIZING.px16};
  border-radius: 50%;
  background: ${COLORS.Black200};
  top: calc(50% - ${SIZING.px4});
  left: -${SIZING.px16};
  animation: inherit;
  animation-name: ${l7DotAnimation};
`;



export default Loader;
