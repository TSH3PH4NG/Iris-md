/*created on 13 January by Tshephang , don't remove credit.*/

const {command} = require("../lib");
const fetch = require("node-fetch");
const axios = require('axios');
const fs = require('fs');

const apiUrl = 'https://api.elevenlabs.io/v1/text-to-speech/ErXwobaYiN019PkySvjV/stream';
const apiKey = '527cdd000ff0fca268a9d8eaf5d218a8';




command({
pattern: "tts",
fromMe: true,
desc: "Text - VN",
type: "converter"
},
async(message,match, m)=>{
	
if(match.length > 80 || !match ) return message.send(message.jid , "i need something short/i need a query" , {quoted: m})
const requestBody = {
  model_id: 'eleven_multilingual_v2',
  text: match,
};

  const { data } = await axios.post(apiUrl, requestBody, {
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
    responseType: 'arraybuffer',
  });

  await fs.writeFileSync('temp.mp3', data);
  

let bb = await fs.readFileSync("temp.mp3");

await message.client.sendMessage(message.jid , {audio: bb , mimetype: "audio/mp4", waveform: [20,60,70,54,69,80,39] , ptt: true} , {quoted: m})

await fs.unlinkSync("temp.mp3")
})
