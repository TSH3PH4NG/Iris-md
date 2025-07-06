const { command , reply }  = require("../lib");
const axios = require("axios");
const FormData = require("form-data");
const { fromBuffer } = require("file-type");


const userAgentList = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
        'Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.1)',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36 Edg/87.0.664.75',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18363',
    ]

    const randomUserAgent = userAgentList[Math.floor(Math.random()*userAgentList.length)];
  


command({
pattern: "url",
fromMe: false,
desc: "Img/Vid - Url",
type: "converter"
}, async(message,match,m)=>{
    
    let { status , msg } = await reply(m,"all");
    if(status == 0) return message.reply(msg);
    let bb = await m.download();
    const { ext } = await fromBuffer(bb);
    const formData = new FormData();
    formData.append("fileToUpload", bb, `file.${ext}`);
    formData.append("reqtype", "fileupload");
    const response = await axios.post("https://catbox.moe/user/api.php", formData, {
        headers: {
            ...formData.getHeaders(),
            "User-Agent":  randomUserAgent,
        },
    });
    
    await message.reply(response.data.trim())
    
})
