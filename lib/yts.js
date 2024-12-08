const a = require("axios");
const cheerio = require("cheerio");
 
async function yts(query){

let  { status , data } = await a.get("https://m.youtube.com/results?sp=mAEA&search_query="+encodeURIComponent(query),
{
	headers: {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.5481.178 Safari/537.36",
  "Accept-Language": "en-US , en",
  "Cookie": "SID=g.a000qAhsr3JUvKW987ir-KQ0CTsDqYlSMkjlqIt12k2mDd1wwrWamb09sLt2yqvrmjdm2V6qSgACgYKAZ4SARUSFQHGX2MinXcTL-OYH4cWxIRgZnQLjRoVAUF8yKr_HRBL5rbIOecGeKfPjGF-0076; APISID=aBbQngFfaGm-udQy/A1Kq76kPHJAsqWve5; SAPISID=AQIvTmVazLglFXhr/Ap5SpwSlj7Gcs7PwT; __Secure-1PAPISID=AQIvTmVazLglFXhr/Ap5SpwSlj7Gcs7PwT; __Secure-3PAPISID=AQIvTmVazLglFXhr/Ap5SpwSlj7Gcs7PwT; SIDCC=AKEyXzUpaW-i7_IMXHHD9T2gIoI4skBgbFUO04BhedT8zsqW2OZeAR_EHYJttlrBLMQmZAVh6g; PREF=f6=40000000&tz=Africa.Johannesburg;",
  "Referer": "https://m.youtube.com/"
 
}
}
)

if(!status == 200){
return message.reply("failed")
}

const $ = cheerio.load(data)
let dt;
let Res = {
video: [],
}

$("script").each((i,e) =>{
	
const content = $(e).html()

if(content &&  content.includes("var ytInitialData =")){
const res = content
          .replace(/^var ytInitialData = /, "")
          .replace(/;$/, "")
          
         dt = JSON.parse(res)
         
}})

const f = dt.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];

let items = f[0]?.itemSectionRenderer?.contents || []

items.forEach((v)=>{
const res = Object.keys(v)[0]
const values = v[res]

if (res === "videoRenderer") {
Res.video.push({
title: values.title?.runs[0]?.text,
duration: values.lengthText?.simpleText,
url: `https://youtu.be/${values?.videoId}`,
thumbnail: values.thumbnail?.thumbnails?.pop()?.url,
views:  values.viewCountText?.simpleText,
})
}


})/*end*/

return Res.video[0]

}

module.exports = { yts }

   
