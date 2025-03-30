/* Take with credit ©TSHEPANG MARTIN MASIA
credit: Tshepang  && Toxic Turbo
*/


const { command , reply } = require("../lib")
const imgbbUploader = require("imgbb-uploader");
const { writeFileSync, unlinkSync } = require("fs-extra");
const fetch = require("node-fetch");

command({
	pattern: "scan",
	fromMe: false,
},
async(message,match,m)=>{

let { msg , status , mime } = await reply(m, "image", true);
if(status == 0) return message.reply(msg);
let { key } = await message.send(message.jid , "processing image", {quoted: m});

let buff = await m.quoted.download(); 

await writeFileSync("./temp.jpg", buff);

let { url } = await imgbbUploader({
apiKey:"5735b4c0a758e53b27741a432dee668a",
imagePath: "./temp.jpg",
name: "Iris-MD",
expiration: 30000
});/*do not change it will crash*/

let { ParsedResults } = await (await fetch(`https://api.ocr.space/parse/imageurl?apikey=K85718519688957&url=${url}&language=eng&isOverlayRequired=true`)).json();

await message.client.sendMessage(message.jid , {text: ParsedResults[0].ParsedText , edit: key });
await unlinkSync("./temp.jpg");

}) 
