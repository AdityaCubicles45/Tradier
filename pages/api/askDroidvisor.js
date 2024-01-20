// pages/api/askDroidvisor.js
import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const axios = require('axios');
      const headers = {'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY, 'Accepts': 'application/json'};
      const responseAxios = await axios.get(
        "https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest", 
        { headers: headers },
      );
      const data = responseAxios.data;
      const dataString = JSON.stringify(data);
      console.log(dataString);

      const { prompt } = req.body;
      const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

      const completion = await openai.chat.completions.create({
        messages: [
            {"role": "system", "content": `
            You are a cryptocurrency advisor who answers in super wise and CONSICE answers. You are in a dex that lets people invest in and build 
            decentralized trading bot NFTs. Here's latest market Info ${dataString}`},
            {"role":"user", "content": `${prompt}`}
          ],
        model: "gpt-3.5-turbo",
      });

      const response = completion.choices[0].message
      console.log(response); 

      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
