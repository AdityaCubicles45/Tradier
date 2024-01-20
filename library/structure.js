import styled from "styled-components";
import { COLORS } from '@/library/theme'
import { SIZING } from '@/library/sizing'

export const Section = styled.section`
display: flex;
height: 100vh;
background-color: ${COLORS.Black900Default};
`
export const ScrollableContainer = styled.section`
display: flex;
flex-direction: column;
width: calc(100vw - 20vw);
padding-right: ${SIZING.px32};
padding-bottom: ${SIZING.px32};
overflow: scroll;
`
export const CardGrid = styled.div`
display: flex;
flex-wrap: wrap;
gap: ${SIZING.px32};
`
