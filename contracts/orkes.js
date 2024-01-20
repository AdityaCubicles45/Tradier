const express = require('express');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');

const app = express();
const port = 3000;

// Your Ethereum smart contract ABI and address
const contractABI = './contracts/abi/'
const contractAddress = '0x1234567890abcdef1234567890abcdef12345678';

// Connect to Ethereum network using ethers.js
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_API_KEY');
const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);

// Instantiate the smart contract
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

app.use(bodyParser.json());

// API endpoint to get wallet value
app.get('/walletValue', async (req, res) => {
  try {
    const walletValue = await contract.getWalletValue();
    res.json({ walletValue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to make an investment
app.post('/invest', async (req, res) => {
  try {
    const { value } = req.body;
    // Perform necessary validations and processing
    const result = await contract.invest(value);
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add more API endpoints for other functionalities as needed

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
