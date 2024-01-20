import React from 'react'
import styled from 'styled-components'
import { COLORS } from '@/library/theme'
import { SIZING } from '@/library/sizing'
import { TopBarPageHeader, TopBarFilterText} from '@/library/typography'
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdSearch } from "react-icons/md";
import { MdOutlineNotifications } from "react-icons/md";
import { ConnectWallet, ThirdwebProvider, useWallet, useAddress } from '@thirdweb-dev/react'


const TopBar = ({header, type}) => {

  const isConnected = Boolean(useAddress() != undefined);
//   console.log(isConnected)
  return (
    <Section>

        <TopBarPageHeader>
            {header}
        </TopBarPageHeader>

        <LeftContainer>

            {type && (
                <FilterResults>
                    <TopBarFilterText>
                        Recent
                    </TopBarFilterText>
                    <FilterArrowIcon />
                </FilterResults>
            )}

            <SearchWrapper>
                <SearchIcon />
                <Search placeholder="Search"/>
            </SearchWrapper>

            <NotificationIcon />

            {isConnected ? <StyledConnectedWallet theme="dark" modalSize="compact"  /> 
            : <StyledConnectWallet theme="dark" modalSize="compact" /> }

        </LeftContainer>  

    </Section>
  )
}

const Section = styled.section`
display: flex;
align-items: center;
justify-content: space-between;
min-height: ${SIZING.px96};
max-height: ${SIZING.px96};
`
const LeftContainer = styled.div`
display: flex;
align-items: center;
`
const FilterResults = styled.div`
display: flex;
align-items: center;
gap: ${SIZING.px4};
margin-right: ${SIZING.px32};
cursor: pointer;
`
const FilterArrowIcon = styled(MdKeyboardArrowDown)`
font-size: ${SIZING.px14};
fill: ${COLORS.Black400};
transition: 0.4s ease-in-out;

${FilterResults}:hover & {
fill: ${COLORS.Black100};
}
`
const SearchWrapper = styled.div`
display: flex;
align-items: center;
gap: ${SIZING.px4};
margin-right: ${SIZING.px16};
background-color: ${COLORS.Black850};
padding: ${SIZING.px8} ${SIZING.px12};
border-radius: ${SIZING.px96};
transition: 0.4s ease-in-out;
cursor: pointer;

&:hover{
outline: 1px solid ${COLORS.Black800};
}
`
const SearchIcon = styled(MdSearch)`
font-size: ${SIZING.px14};
fill: ${COLORS.Black400};
transition: 0.4s ease-in-out;

${SearchWrapper}:hover & {
fill: ${COLORS.Black100};
}
`
const Search = styled.input.attrs({ type: 'search' })`
width: ${SIZING.px256};
padding: 0;
border: none;
outline: none;
background-color: transparent;
letter-spacing: -0.04375rem;
color: ${COLORS.Black100};
font-size: ${SIZING.px14};
font-family: "Uncut Sans Medium";


&::placeholder {
color: ${COLORS.Black400};
}

&::-webkit-search-cancel-button {
appearance: none; 
}
`
const NotificationIcon = styled(MdOutlineNotifications)`
margin-right: ${SIZING.px32};
font-size: ${SIZING.px20};
fill: ${COLORS.Black200};
transition: 0.2s ease-in-out;
cursor: pointer;

&:hover{
fill: ${COLORS.Black100};
}
`
const StyledConnectWallet = styled(ConnectWallet)`
display: flex;
padding: ${SIZING.px12} 0;
font-size: ${SIZING.px16};
letter-spacing: -0.05rem;
font-family: "Uncut Sans Bold";
border-radius: ${SIZING.px96};
background-color: ${COLORS.Black100};
transition: 0.4s ease-in-out;

&:hover{
background-color: ${COLORS.StandardWhiteDefault};
}
`
const StyledConnectedWallet = styled(ConnectWallet)`
padding: ${SIZING.px8} ${SIZING.px24};
border-radius: ${SIZING.px96};
background-color: transparent;
border: 1px solid ${COLORS.Black850};
transition: 0.4s ease-in-out;

&:hover{
background-color: ${COLORS.Black875};
}
`

export default TopBar