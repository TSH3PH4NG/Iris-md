const { getJson } = require("./functions");

async function yts(query) {
	
let bb = await getJson(`https://jazxcode.biz.id/search/youtube?q=${query}`)

let { title , imageUrl , link , duration } = bb.result[0]

return { title , thumbnail: imageUrl, link , duration }
	
module.exports = {
  yts,
};
