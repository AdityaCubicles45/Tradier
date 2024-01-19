import React, { useState, useRef, useEffect } from 'react';
import styled, {keyframes} from 'styled-components'
import { COLORS } from '@/library/theme'
import { SIZING } from '@/library/sizing'
import { BotCreationWorkspaceInputLabel, BotCreationWorkspaceTagItem, 
BotCreationWorkspaceScriptConfigurationLabel, BotCreationWorkspaceUnderlinedSpan,
BotCreationWorkspaceDragAndDropYourScriptSpan, BotCreationWorkspaceOrSpan,
BotCreationWorkspaceAffirmationSpan, BotCreationWorkspaceFileNameSpan,
BotCreationWorkspaceSuccessSpan } from '@/library/typography'
import { MdClose } from "react-icons/md";
import { MdCloudUpload } from "react-icons/md";
import { useStorage, useAddress, useSigner } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import CreatingBotLoader from './CreatingBotLoader.js'
import TradioABI from "@/contracts/abi/TraderoidABI.json"
import { Traderiod_NFT_CONTRACT_ADDRESS } from '@/CENTERAL_VALUES';
import { MdCheck } from "react-icons/md";
import Confetti from 'react-confetti'

const crypto = require('crypto');

const BotCreationWorkspace = () => {

  const [botName, setBotName] = useState('');
  const [description, setDescription ] = useState('')
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [isMinting, setIsMinting] = useState(false);

  const ManagementFee = useRef();
  const PerformanceFee = useRef()
  const fileInputRef = useRef(null);
  const [fileText, setFileText] = useState('');

  const storage = useStorage();
  const userAddress = useAddress();
  const signer = useSigner();

  const [mintMessege, setMintMessege] = useState('')

  async function handleNFTmint(){
    setIsMinting(true)
    try{
    const metadata = {
        name: botName,
        manager: userAddress,
        tags: selectedTags,
        description: description,
        assets: selectedAssets,
        ManagementFee: parseInt(ManagementFee.current.value),
        PerformanceFee: parseInt(PerformanceFee.current.value),
        script: fileText
    };
    const data = JSON.stringify(metadata) + new Date().toISOString();
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    metadata.id = hash;
    console.log(metadata)
    const contract = new ethers.Contract(Traderiod_NFT_CONTRACT_ADDRESS, TradioABI, signer);
    const url = await storage.upload(metadata);
    const tx = await contract.safeMint(url, metadata.ManagementFee, metadata.script);
    await tx.wait();
    console.log("NFT Minted!");
    setMintMessege("NFT Minted!");
    setIsMinting(false)
    }catch(err){
        console.log(err)
        setMintMessege(`Error: ${err.toString()}`)
        setIsMinting(false)
    }
  }

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tag) => {
    const updatedTags = selectedTags.filter((selectedTag) => selectedTag !== tag);
    setSelectedTags(updatedTags);
  };

  const handleAssetSelect = (asset) => {
    if (!selectedAssets.includes(asset)) {
      setSelectedAssets([...selectedAssets, asset]);
    }
  };

  const handleAssetRemove = (asset) => {
    const updatedAssets = selectedAssets.filter((selectedAsset) => selectedAsset !== asset);
    setSelectedAssets(updatedAssets);
  };

  const PerformanceChange = () => {
    const inputValue = PerformanceFee.current.value;
    if (inputValue > 75) {
        PerformanceFee.current.value = 75;
    }
  };

  const ManagementChange = () => {
    const inputValue = ManagementFee.current.value;
    if (inputValue > 75) {
        ManagementFee.current.value = 75;
    }
  };

  const handleFileInputContainerClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e) => {
    console.log('File input changed:', e.target.files);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setFileText(e.target.result);
      reader.readAsText(file);
      console.log('Selected file:', file);
      setUploadedFileName(file.name);
    }
  };

  const confettiColors = [COLORS.PigmentGreen500,
    COLORS.PigmentGreen600, COLORS.PigmentGreen700Default,
    COLORS.PigmentGreen800, COLORS.PigmentGreen900,
    COLORS.DartmouthGreen100, COLORS.DartmouthGreen600,
    COLORS.DartmouthGreen800, COLORS.DartmouthGreen900Default
    ]; 

  return (
    <Section>

        {isMinting ? (
        <LoadingContainer>

            <LoadingSpan>
                Minting your Traderoid...
            </LoadingSpan>

            <CreatingBotLoader />

        </LoadingContainer>
        ):(<>
        { mintMessege == '' && 
        <>
        <LabelAndInputColumn>
            <BotCreationWorkspaceInputLabel htmlFor="botName">
                Name of your bot
            </BotCreationWorkspaceInputLabel>
            <BotNameInput 
            id="botName" 
            maxLength={50} 
            placeholder="My bot"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            />
        </LabelAndInputColumn>

        <CentralRow>
            <LabelAndInputColumn>
                <BotCreationWorkspaceInputLabel>
                    Tags
                </BotCreationWorkspaceInputLabel>
                <SelectWrapper>
                <SelectedItemRow>
                    {selectedTags.map((tag) => (
                        <TagObject key={tag}>
                        <BotCreationWorkspaceTagItem>{tag}</BotCreationWorkspaceTagItem>
                        <CloseIcon onClick={() => handleTagRemove(tag)} />
                        </TagObject>
                    ))}
                    </SelectedItemRow>
                    <Select onChange={(e) => handleTagSelect(e.target.value)}>
                    <DeselectedOption></DeselectedOption>
                    <Option value="Mean reversion">Mean reversion</Option>
                    <Option value="Risky">Risky</Option>
                    <Option value="Rebalancing">Rebalancing</Option>
                    <Option value="Analytical">Analytical</Option>
                    <Option value='Sentiment Analysis'>Sentiment Analysis</Option>
                    <Option value="Aggressive">Aggressive</Option>
                    <Option value="Trend Following">Trend Following</Option>
                    <Option value="Stable">Stable</Option>
                    <Option value="Dynamic">Dynamic</Option>
                    </Select>
                </SelectWrapper>
            </LabelAndInputColumn>

            <LabelAndInputColumn>
                <BotCreationWorkspaceInputLabel>
                    Assets
                </BotCreationWorkspaceInputLabel>
                <SelectWrapper>
                <SelectedItemRow>
                    {selectedAssets.map((asset) => (
                        <TagObject key={asset}>
                        <BotCreationWorkspaceTagItem>{asset}</BotCreationWorkspaceTagItem>
                        <CloseIcon onClick={() => handleAssetRemove(asset)} />
                        </TagObject>
                    ))}
                    </SelectedItemRow>
                    <Select onChange={(e) => handleAssetSelect(e.target.value)}>
                    <DeselectedOption></DeselectedOption>
                    <Option value="BTC">Bitcoin</Option>
                    <Option value="ETH">ETH</Option>
                    <Option value="LINK">LINK</Option>
                    <Option value="MANA">MANA</Option>
                    <Option value="MATIC">MATIC</Option>
                    <Option value="UNI">UNI</Option>
                    </Select>
                </SelectWrapper>
            </LabelAndInputColumn>

            <LabelAndInputColumn>
                <BotCreationWorkspaceInputLabel>
                    Management Fee
                </BotCreationWorkspaceInputLabel>
                <FeeWrapper>
                    <SmallInput
                    placeholder="0.00"
                    type="number"
                    min="0"
                    max="5"
                    ref={ManagementFee}
                    onChange={ManagementChange}
                    />
                    %
                </FeeWrapper>
            </LabelAndInputColumn>

            <LabelAndInputColumn>
                <BotCreationWorkspaceInputLabel>
                    Performance Fee
                </BotCreationWorkspaceInputLabel>
                <FeeWrapper>
                    <SmallInput
                    placeholder="0.00"
                    type="number"
                    min="0"
                    max="75"
                    ref={PerformanceFee}
                    onChange={PerformanceChange}
                    />
                    %
                </FeeWrapper>
            </LabelAndInputColumn>           
        </CentralRow>

        <LabelAndInputColumn style={{marginTop: SIZING.px24}}>
            <BotCreationWorkspaceInputLabel>
                Description
            </BotCreationWorkspaceInputLabel>
            <Textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)}/>

        </LabelAndInputColumn>

        <LabelAndInputColumn style={{marginTop: SIZING.px24}}>
            <BotCreationWorkspaceScriptConfigurationLabel>
                For more information on how your script should be configured, please refer to this&nbsp;
                <BotCreationWorkspaceUnderlinedSpan onClick={() => window.open('/documentation', '_blank')}>
                    Documentation Link
                </BotCreationWorkspaceUnderlinedSpan>
            </BotCreationWorkspaceScriptConfigurationLabel>

            <FileInputContainer onClick={handleFileInputContainerClick}>
                <FileInput type="file" accept=".js" ref={fileInputRef} onChange={handleFileInputChange}/>
                {uploadedFileName ? (
                    <></>
                    ) : (
                    <CloudIcon />
                )}
                {uploadedFileName ? (
                    <BotCreationWorkspaceAffirmationSpan>
                        You&apos;ve successfully uploaded&nbsp;
                        <BotCreationWorkspaceFileNameSpan>
                            {uploadedFileName}
                        </BotCreationWorkspaceFileNameSpan>
                    </BotCreationWorkspaceAffirmationSpan>
                    ) : (
                    <BotCreationWorkspaceDragAndDropYourScriptSpan>
                        Drag &amp; Drop your script
                    </BotCreationWorkspaceDragAndDropYourScriptSpan>
                )}
                {uploadedFileName ? (
                    <></>
                    ) : (
                    <BotCreationWorkspaceOrSpan>
                        or
                    </BotCreationWorkspaceOrSpan>
                )}
                {uploadedFileName ? (
                    <BrowseFilesButton>
                        Change File
                    </BrowseFilesButton>
                    ) : (
                    <BrowseFilesButton>
                        Browse Files
                    </BrowseFilesButton>
                )}
            </FileInputContainer>

        </LabelAndInputColumn>

        <CreateBotButton onClick={handleNFTmint} disabled={isMinting} >
            Create
        </CreateBotButton>  
        </>}</>
        )}

        {mintMessege == "NFT Minted!" &&
        <LoadingContainer>
            <Confetti colors={confettiColors} />
            <BotCreationWorkspaceSuccessSpan>
                Success! Your Traderdoid has been minted!
            </BotCreationWorkspaceSuccessSpan>

            <CheckContainer>
                <CheckmarkIcon />
            </CheckContainer>

        </LoadingContainer>
        }
        {mintMessege.startsWith('Error:') &&
          <LoadingContainer>
    
          <BotCreationWorkspaceSuccessSpan>
              {mintMessege}
          </BotCreationWorkspaceSuccessSpan>

        </LoadingContainer>      
        }

    </Section>
  )
}

const Section = styled.section`
display: flex;
flex-direction: column;
padding: ${SIZING.px36} ${SIZING.px36};
background-color: ${COLORS.Black875};
border-radius: ${SIZING.px16};
`
const LabelAndInputColumn = styled.div`
display: flex;
flex-direction: column;
gap: ${SIZING.px8};
`
const BotNameInput = styled.input`
line-height: 100%;
padding: ${SIZING.px8} ${SIZING.px16};
letter-spacing: -0.02rem;
font-size: ${SIZING.px16};
background-color: ${COLORS.Black850};
border: 1px solid ${COLORS.Black800};
outline: none;
border-radius: ${SIZING.px96};
color: ${COLORS.Black100};
font-family: "Uncut Sans Medium";

&:focus {
border-color: ${COLORS.Black600};
}
&::placeholder {
font-family: "Uncut Sans Regular";
color: ${COLORS.Black600};
}
`
const CentralRow = styled.div`
display: flex;
justify-content: space-between;
margin-top: ${SIZING.px24};
`
const SelectWrapper = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
width: ${SIZING.px352};
padding-left: ${SIZING.px4};
padding-right: ${SIZING.px16};
padding-top: ${SIZING.px4};
padding-bottom: ${SIZING.px4};
letter-spacing: -0.02rem;
font-size: ${SIZING.px16};
background-color: ${COLORS.Black850};
border: 1px solid ${COLORS.Black800};
outline: none;
border-radius: ${SIZING.px96};
color: ${COLORS.Black100};
font-family: "Uncut Sans Medium";
`
const Select = styled.select`
width: 18px;
background-color: transparent;
border: none;
outline: none;
`
const SelectedItemRow = styled.div`
display: flex;
align-items: center;
width: calc(100% - 18px - ${SIZING.px16});
gap: ${SIZING.px4};
-webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 95%, rgba(0, 0, 0, 0) 100%);
mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 95%, rgba(0, 0, 0, 0) 100%);
overflow: scroll;
`
const TagObject = styled.div`
display: flex;
align-items: center;
padding: ${SIZING.px8} ${SIZING.px16};
gap: ${SIZING.px8};
background-color: ${COLORS.Black800};
border-radius: ${SIZING.px96};
`
const CloseIcon = styled(MdClose)`
font-size: ${SIZING.px12};
cursor: pointer;
fill: ${COLORS.Black300};

&:hover{
fill: ${COLORS.Black100};
}
`
const DeselectedOption = styled.option`
display: none;
`
const Option = styled.option`
background-color: ${COLORS.Black900Default};
`
const FeeWrapper = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
width: ${SIZING.px128};
padding: ${SIZING.px8} ${SIZING.px16};
background-color: ${COLORS.Black850};
border: 1px solid ${COLORS.Black800};
border-radius: ${SIZING.px96};
font-family: "Uncut Sans Bold";
color: ${COLORS.Black700};
`
const SmallInput = styled.input`
width: 80%;
line-height: 100%;
letter-spacing: -0.02rem;
font-size: ${SIZING.px16};
outline: none;
border: none;
background-color: transparent;
color: ${COLORS.Black100};
font-family: "Uncut Sans Medium";

&::-webkit-outer-spin-button,
&::-webkit-inner-spin-button {
-webkit-appearance: none;
margin: 0;
}

&[type=number] {
-moz-appearance: textfield;
}

&:focus {
border-color: ${COLORS.Black600};
}

&::placeholder {
font-family: "Uncut Sans Regular";
color: ${COLORS.Black600};
}
`
const Textarea = styled.textarea`
line-height: 130%;
padding: ${SIZING.px16};
font-size: ${SIZING.px16};
background-color: ${COLORS.Black850};
border: 1px solid ${COLORS.Black800};
outline: none;
border-radius: ${SIZING.px16};
color: ${COLORS.Black200};
font-family: "Uncut Sans Regular";
resize: none;

&:focus {
border-color: ${COLORS.Black600};
}
`
const FileInput = styled.input`
display: none;
`
const FileInputContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
padding: ${SIZING.px64};
font-size: ${SIZING.px16};
background-color: ${COLORS.Black850};
border: 1px dashed ${COLORS.Black800};
border-radius: ${SIZING.px16};
cursor: pointer;    
`
const CloudIcon = styled(MdCloudUpload)`
font-size: ${SIZING.px128};
fill: ${COLORS.Black800};
`
const BrowseFilesButton = styled.div`
margin-top: ${SIZING.px32};
padding: ${SIZING.px16} ${SIZING.px24};
letter-spacing: -0.05rem;
font-size: ${SIZING.px20};
font-family: "Uncut Sans Medium";
border: 1px solid ${COLORS.Black800};
color: ${COLORS.Black700};
border-radius: ${SIZING.px96};
transition: 0.4s ease-in-out;

&:hover{
color: ${COLORS.Black500};
border: 1px solid ${COLORS.Black600};
}
`
const CreateBotButton = styled.button`
margin-top: ${SIZING.px24};
padding: ${SIZING.px16} 0;
letter-spacing: -0.025rem;
font-size: ${SIZING.px20};
font-family: "Uncut Sans Semibold";
color: ${COLORS.StandardWhiteDefault};
background-color: ${COLORS.DartmouthGreen900Default};
border-radius: ${SIZING.px96};
border: none;
outline: none;
transition: 0.4s ease-in-out;
cursor: pointer;

&:hover{
background-color: ${COLORS.DartmouthGreen800};
}
`
const LoadingContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
height: ${SIZING.px480};
justify-content: center;
gap: ${SIZING.px48};
`
const loadingSpanAnimation = keyframes`
0% {
letter-spacing: -0.15rem;
}
50% {
letter-spacing: -0.12rem;
}
100% {
letter-spacing: -0.15rem;
}
`
const LoadingSpan = styled.div`
font-size: ${SIZING.px36};
letter-spacing: -0.15rem;
color: ${COLORS.Black200};
font-family: "Uncut Sans Medium";
animation: ${loadingSpanAnimation} 0.4s infinite;
`

const checkmarkAnimation = keyframes`
0% {
opacity: 0;
}
100% {
opacity: 1;
}
`
const checkmarkContainerAnimation = keyframes`
0% {
background-color: transparent;
border-radius: ${SIZING.px8};
}
100% {
background-color: ${COLORS.DartmouthGreen900Default};
border-radius: 50%;
}
`

const CheckContainer = styled.div`
padding: ${SIZING.px24};
animation: ${checkmarkContainerAnimation} 1s forwards;
animation-delay: 1.4s;
`

const CheckmarkIcon = styled(MdCheck)`
font-size: ${SIZING.px64};
fill: ${COLORS.Black100};
opacity: 0;
animation: ${checkmarkAnimation} 1s forwards;
animation-delay: 0.4s;
`


export default BotCreationWorkspace