const axios = require("axios");

async function yts(query) {
	
let bb = await axios.get(`https://ytdownloader.nvlgroup.my.id/search?q=${query}` )
let { title , url , thumbnail , duration , views } = bb.data.videos[0];

return { title , url , thumbnail , duration , views };

}

module.exports = {
  yts,
};
