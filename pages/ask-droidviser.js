import React from 'react'
import styled from 'styled-components'
import LeftBar from '@/components/LeftBar'
import TopBar from '@/components/TopBar'
import { COLORS } from '@/library/theme'
import { SIZING } from '@/library/sizing'
import { Section } from '@/library/structure'
import Chat from '@/components/Chat'


const AskDroidviser = () => {
  return (
    <Section>

      <LeftBar selected="askDroidviser"/>

      <MainContainer>

        <TopBar header="What can we help you with?"/>

        <Chat />

      </MainContainer>

    </Section>
  )
}

const MainContainer = styled.section`
display: flex;
flex-direction: column;
width: calc(100vw - 20vw);
padding-right: ${SIZING.px32};
padding-bottom: ${SIZING.px32};
`

export default AskDroidviser