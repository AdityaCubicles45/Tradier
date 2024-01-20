import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import Logo from '@/public/images/LogoColored.webp'
import { COLORS } from '@/library/theme'
import { SIZING } from '@/library/sizing'
import "@fontsource/syne/700.css"; 

const TopLeftLogo = () => {
  return (
    <Container>
        <Image src={Logo} alt="Traderoid.io"/>
        <LogoText>
          Traderoid
        </LogoText>
        

    </Container>
  )
}

const Container = styled.div`
display: flex;
align-items: center;
gap: ${SIZING.px8};

img{
width: ${SIZING.px32};
height: ${SIZING.px32};
}
`
export const LogoText = styled.h1`
letter-spacing: -0.075rem;
font-size: ${SIZING.px24};
color: ${COLORS.DartmouthGreen600};
font-family: "Syne";
font-weight: 700;
`

export default TopLeftLogo