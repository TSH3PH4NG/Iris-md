const axios = require("axios");


async function yts(query) {
	
let { data } = await axios.get(`https://jazxcode.biz.id/search/youtube?q=${query}`)

let { title , imageUrl , link , duration } = data.result[0]

return { title , thumbnail: imageUrl, link , duration }
	
}
	
module.exports = {
  yts,
};
