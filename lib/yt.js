const { getBuffer , isYT } = require("./functions");

async function ytdl(res){
	if(!isYT(res)) return "i only work with urls";
	
	try {
		
        let bb = await getBuffer(`https://tshepang.vercel.app/download?url=${res}`)
	
	return bb;
	
    }catch(e) {
       return e;
    };

    }

module.exports = { ytdl };
