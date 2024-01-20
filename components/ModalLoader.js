import React from 'react';
import styled, { keyframes } from 'styled-components';
import { COLORS } from '@/library/theme';
import { SIZING } from '@/library/sizing';

const Loader = () => {
    return <LoaderContainer />;
}

const l14 = keyframes`
0%, 10% { background-position: 0 0, 0 100%, 50% 0, 50% 100%, 100% 0, 100% 100%; }
33% { background-position: 0 100%, 0 0, 50% 0, 50% 100%, 100% 0, 100% 100%; }
66% { background-position: 0 100%, 0 0, 50% 100%, 50% 0, 100% 0, 100% 100%; }
90%, 100% { background-position: 0 100%, 0 0, 50% 100%, 50% 0, 100% 100%, 100% 0; }
`
const LoaderContainer = styled.div`
width: ${SIZING.px80};
aspect-ratio: 1;
--c: linear-gradient(${COLORS.Black700} 0 0);
--m: radial-gradient(farthest-side, ${COLORS.Black700} 92%, ${COLORS.Black700});
background: 
var(--c), var(--m),
var(--c), var(--m), 
var(--c), var(--m);
background-size: ${SIZING.px16} ${SIZING.px48}, ${SIZING.px16} ${SIZING.px16};
background-repeat: no-repeat;
border-radius: ${SIZING.px8};
animation: ${l14} 1s infinite alternate;
`

export default Loader
