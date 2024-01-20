import React, {useEffect} from 'react'
import LeftBar from '@/components/LeftBar'
import TopBar from '@/components/TopBar'
import { COLORS } from '@/library/theme'
import BotCreationWorkspace from '@/components/BotCreationWorkspace'
import {Section, ScrollableContainer} from '@/library/structure'
import Confetti from 'react-confetti'


const CreateABot = () => {

  const confettiColors = [COLORS.PigmentGreen500,
  COLORS.PigmentGreen600, COLORS.PigmentGreen700Default,
  COLORS.PigmentGreen800, COLORS.PigmentGreen900,
  COLORS.DartmouthGreen100, COLORS.DartmouthGreen600,
  COLORS.DartmouthGreen800, COLORS.DartmouthGreen900Default
  ]; 

  return (
    <Section>

      {/* <Confetti colors={confettiColors}/> */}

      <LeftBar selected="createABot"/>

      <ScrollableContainer>

        <TopBar header="Create a bot"/>

        <BotCreationWorkspace />

      </ScrollableContainer>

    </Section>
    
  )
}

export default CreateABot