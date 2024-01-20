import React from 'react';
import styled, { keyframes } from 'styled-components';
import { COLORS } from '@/library/theme';
import { SIZING } from '@/library/sizing';

const loaderAnimation1 = keyframes`
0%, 100% {
width: ${SIZING.px192};
height: ${SIZING.px192};
}
35%, 65% {
width: ${SIZING.px256};
height: ${SIZING.px256};
}
`

const loaderAnimation2 = keyframes`
0%, 40% {
background-position: 0 0, 0 50%, 0 100%, 50% 100%, 100% 100%, 100% 50%, 100% 0, 50% 0, 50% 50%;
}
60%, 100% {
background-position: 0 50%, 0 100%, 50% 100%, 100% 100%, 100% 50%, 100% 0, 50% 0, 0 0, 50% 50%;
}
`

const Loader = styled.div`
--a: no-repeat linear-gradient(${COLORS.Black700} 0 0);
--b: no-repeat linear-gradient(${COLORS.Black600} 0 0);
--c: no-repeat linear-gradient(${COLORS.Black800} 0 0);
background: 
var(--b), var(--a), var(--c),
var(--b), var(--a), var(--c),
var(--b), var(--a), var(--c);
background-size: ${SIZING.px64} ${SIZING.px64};
border-radius: ${SIZING.px8};

animation: 
${loaderAnimation1} 1s infinite,
${loaderAnimation2} 1s infinite;
`

const MyComponent = () => {
  return (
    <Loader className="loader" />
  );
};

export default MyComponent;
