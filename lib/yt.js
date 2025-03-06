const { getBuffer , isYT } = require("./functions");
const axios = require("axios");
async function ytdl(res){
	
if(!isYT(res)) return "i only work with urls";
	
try {
		
let { data } = await axios.get(`https://tshepang.vercel.app/download?url=${res}`)
let buff = await (await fetch(data.audio[128])).arrayBuffer();
let final_buffer = Buffer.from(buff);

return final_buffer;

	   }catch(e) {
       return e;
    };

    }

module.exports = { ytdl };
