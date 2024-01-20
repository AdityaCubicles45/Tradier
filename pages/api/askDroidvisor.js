// pages/api/askDroidvisor.js
import OpenAI from "openai";

export default async function handler(req, res) {
  console.log("I called handler") // added by himan
  if (req.method === 'POST') {
    try {
      console.log("I called handler1")
      const axios = require('axios');
      console.log("123")

      const headers = { 'X-CMC_PRO_API_KEY': process.env.NEXT_PUBLIC_COINMARKETCAP_API_KEY, 'Accepts': 'application/json' };
      console.log("1234")

      const responseAxios = await axios.get(
        "https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest",
        { headers: headers },
      );
      console.log("I called handler2")

      const data = responseAxios.data;
      const dataString = JSON.stringify(data);
      console.log("I called handler3")

      console.log(dataString);
      

      const { prompt } = req.body;
      console.log("I called handler4.2")

      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPEN_AI_API_KEY,
      });    
        console.log("I called handler4.5")

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "system", "content": `
            You are a cryptocurrency advisor who answers in super wise and CONSICE answers. You are in a dex that lets people invest in and build 
            decentralized trading bot NFTs. Here's latest market Info ${dataString}`
          },
          { "role": "user", "content": `${prompt}` }
        ],
      });
      
     
    
      
      console.log("I called handler4")

      console.log(completion.choices[0].message)
      const response = completion.choices[0].message
      // document.write(response)
      console.log(response);
      console.log("I called handler5")

      res.json(response)
      res.status(200).send(response);
      console.log("I called handler6")

    } catch (err) {
      console.log(err)
      res.status(500).send({ message: err.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
