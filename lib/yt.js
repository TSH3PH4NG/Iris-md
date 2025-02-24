const { getJson , isYT } = require("./functions");

async function ytdl(res){
	if(!isYT(res)) return "i only work with urls";
	
	try {
		
        let bb = await getJson(`https://tshepang.vercel.app/download?url=${res}`)
	
	return Buffer.from(bb.buffer?.data)
	
    }catch(e) {
       return e;
    };

    }

module.exports = { ytdl };
