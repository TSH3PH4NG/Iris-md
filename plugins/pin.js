const { command , getBuffer } = require("../lib");


command({
pattern: "pinterest",
fromMe: false,
},
async(message,match, m)=>{
	
if(!match) return message.reply("_i need a query_");

try{
	
let res = await pinterest(match);

for(const data of res){
let bb = await getBuffer(data.url);
await message.client.sendMessage(message.jid, {image: bb , caption: `*Pinterest images*`}, {quoted: m});
}
 }catch(e) {
message.reply(`error: ${e}`);
 }
})
