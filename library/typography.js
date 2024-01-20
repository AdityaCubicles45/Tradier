import styled from "styled-components";
import { COLORS } from '@/library/theme'
import { SIZING } from '@/library/sizing'

export const TopBarPageHeader = styled.h1`
font-size: ${SIZING.px24};
letter-spacing: -0.075rem;
color: ${COLORS.Black100};
font-family: "Uncut Sans Semibold";
`
export const TopBarFilterText = styled.span`
font-size: ${SIZING.px14};
letter-spacing: -0.0175rem;
color: ${COLORS.Black200};
`
export const LeftBarTrademarkText = styled.small`
font-size: ${SIZING.px12};
color: ${COLORS.Black600};
`
export const BotCardManager = styled.span`
font-size: ${SIZING.px12};
letter-spacing: -0.045rem;
color: ${COLORS.Black700};
font-family: "Uncut Sans Regular";
`
export const BotCardName = styled.h1`
line-height: normal;
white-space: nowrap;
margin-top: ${SIZING.px8};
font-size: ${SIZING.px36};
letter-spacing: -0.0675rem;
color: ${COLORS.Black100};
overflow-y: scroll;
-webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 95%, rgba(0, 0, 0, 0) 100%);
mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 95%, rgba(0, 0, 0, 0) 100%);
`
export const BotCardTag = styled.span`
padding: ${SIZING.px8} ${SIZING.px12};
font-size: ${SIZING.px12};
letter-spacing: -0.03rem;
color: ${COLORS.Black400};
border-radius: ${SIZING.px96};
background-color: ${COLORS.Black850};
font-family: "Uncut Sans Medium";
`
export const BotCardAssetsText = styled.span`
font-size: ${SIZING.px12};
letter-spacing: -0.015rem;
color: ${COLORS.Black400};
font-family: "Uncut Sans Regular";
`
export const BotCardDescription = styled.p`
display: -webkit-box;
height: 3.6rem;
line-height: 120%;
margin-top: ${SIZING.px8};
font-size: ${SIZING.px12};
color: ${COLORS.Black400};
font-family: "Uncut Sans Regular";
text-overflow: ellipsis;
-webkit-line-clamp: 4;
-webkit-box-orient: vertical;
overflow: hidden;
`
export const BotCardFeeLabel = styled.span`
font-size: ${SIZING.px12};
letter-spacing: -0.03rem;
color: ${COLORS.Black600};
font-family: "Uncut Sans Regular";
`
export const BotCardFeeRate = styled.span`
font-size: ${SIZING.px12};
letter-spacing: 0rem;
color: ${COLORS.Black400};
font-family: "Uncut Sans Regular";
`
export const BotCreationWorkspaceInputLabel = styled.label`
font-size: ${SIZING.px14};
letter-spacing: -0.0175rem;
color: ${COLORS.Black500};
font-family: "Uncut Sans Medium";
`
export const BotCreationWorkspaceTagItem = styled.span`
font-size: ${SIZING.px16};
letter-spacing: -0.035rem;
color: ${COLORS.Black100};
font-family: "Uncut Sans Medium";
`
export const BotCreationWorkspaceScriptConfigurationLabel = styled.span`
text-align: center;
font-size: ${SIZING.px14};
letter-spacing: -0.0175rem;
color: ${COLORS.Black600};
font-family: "Uncut Sans Regular";
`
export const BotCreationWorkspaceUnderlinedSpan = styled.span`
font-size: ${SIZING.px14};
letter-spacing: -0.0175rem;
color: ${COLORS.Black600};
text-decoration: underline;
cursor: pointer;
`
export const BotCreationWorkspaceDragAndDropYourScriptSpan = styled.span`
font-size: ${SIZING.px24};
letter-spacing: -0.06rem;
color: ${COLORS.Black700};
font-family: "Uncut Sans Medium";
`
export const BotCreationWorkspaceAffirmationSpan = styled.span`
font-size: ${SIZING.px24};
letter-spacing: -0.06rem;
color: ${COLORS.Black100};
font-family: "Uncut Sans Medium";
`
export const BotCreationWorkspaceOrSpan = styled.span`
margin-top: ${SIZING.px32};
font-size: ${SIZING.px16};
letter-spacing: -0.04rem;
color: ${COLORS.Black800};
font-family: "Uncut Sans Medium";
`
export const BotCreationWorkspaceFileNameSpan = styled.span`
font-size: ${SIZING.px24};
letter-spacing: -0.06rem;
color: ${COLORS.DartmouthGreen600};
font-family: "Uncut Sans Semibold";
`
export const ChatTopBarSpan = styled.span`
font-size: ${SIZING.px16};
letter-spacing: -0.04rem;
color: ${COLORS.DartmouthGreen600};
font-family: "Uncut Sans Medium";
`
export const ChatBottomColumnSmall = styled.small`
font-size: ${SIZING.px12};
letter-spacing: -0.03rem;
color: ${COLORS.Black700};
font-family: "Uncut Sans Regular";
`
export const ChatInitialScreenHeader = styled.span`
font-size: ${SIZING.px24};
letter-spacing: -0.06rem;
color: ${COLORS.Black400};
font-family: "Uncut Sans Medium";
`
export const ChatGridNormalSpan = styled.span`
font-size: ${SIZING.px12};
letter-spacing: -0.03rem;
color: ${COLORS.Black600};
font-family: "Uncut Sans Regular";
`
export const ChatGridBoldSpan = styled.span`
font-size: ${SIZING.px12};
letter-spacing: -0.03rem;
color: ${COLORS.Black400};
font-family: "Uncut Sans Medium";
`
export const ChatMessageText = styled.div`
max-width: ${SIZING.px416};
line-height: 130%;
letter-spacing: 0.01rem;
font-family: "Uncut Sans Regular";
`
export const MyPortfolioChartCurrentBalanceSpan = styled.span`
font-size: ${SIZING.px16};
letter-spacing: -0.04rem;
color: ${COLORS.Black700};
font-family: "Uncut Sans Semibold";
`
export const MyPortfolioChartCurrentBalanceNumber = styled.span`
font-size: ${SIZING.px48};
color: ${COLORS.StandardWhiteDefault};
font-family: "Uncut Sans Bold";
`
export const MyPortfolioChartDollarSignSpan = styled.span`
font-size: ${SIZING.px48};
color: ${COLORS.StandardWhiteDefault};
font-family: "Uncut Sans Semibold";
`
export const MyPortfolioChartUnselectedToggleSpan = styled.span`
font-size: ${SIZING.px12};
letter-spacing: -0.015rem;
color: ${COLORS.Black400};
font-family: "Uncut Sans Medium";
`
export const MyPortfolioChartSelectedToggleSpan = styled.span`
font-size: ${SIZING.px12};
letter-spacing: -0.015rem;
color: ${COLORS.Black100};
font-family: "Uncut Sans Medium";
`
export const ModalTopBannerHeader = styled.span`
width: 90%;
line-height: normal;
font-size: ${SIZING.px24};
letter-spacing: -0.05rem;
color: ${COLORS.StandardWhiteDefault};
font-family: "Uncut Sans Semibold";
overflow-x: scroll;
-webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 95%, rgba(0, 0, 0, 0) 100%);
mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 95%, rgba(0, 0, 0, 0) 100%);
`
export const ModalInputLabel = styled.label`
font-size: ${SIZING.px14};
letter-spacing: -0.0175rem;
color: ${COLORS.Black500};
font-family: "Uncut Sans Medium";
`
export const ModalTotalAmountSpan = styled.span`
font-size: ${SIZING.px16};
letter-spacing: -0.03rem;
color: ${COLORS.Black500};
font-family: "Uncut Sans Medium";
`
export const ModalTotalAmountNumber = styled.span`
font-size: ${SIZING.px16};
color: ${COLORS.Black100};
font-family: "Uncut Sans Medium";
`
export const ModalTotalAvalancheSpan = styled.span`
font-size: ${SIZING.px16};
letter-spacing: -0.03rem;
color: ${COLORS.Black600};
font-family: "Uncut Sans Medium";
`
export const ModalTotalAvalancheNumber = styled.span`
font-size: ${SIZING.px16};
color: ${COLORS.Black300};
font-family: "Uncut Sans Medium";
`
export const BotCreationWorkspaceSuccessSpan = styled.span`
font-size: ${SIZING.px24};
color: ${COLORS.Black100};
font-family: "Uncut Sans Medium";
`
export const ModalSuccessSpan = styled.span`
text-align: center;
font-size: ${SIZING.px24};
color: ${COLORS.Black100};
font-family: "Uncut Sans Medium";
`