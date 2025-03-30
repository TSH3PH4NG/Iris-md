async function reply(m, trigger, mime_data= false) {
    const quoted = m.quoted ? m.quoted.mtype : m.type;
    const mime = quoted; 
    let response = { msg: "", mime: mime , status: 0 };

    switch (trigger) {
    	case "image&video":
            response.msg = "reply to an image or video";
            break;
        case "audio&video":
            response.msg = "reply to an audio or video";
            break;
        case "video":
            response.msg = "reply to a video";
            break;
        case "image":
            response.msg = "reply to an image";
            break;
    }

    if (!/imageMessage|videoMessage|audioMessage/.test(mime)) {
        return response
    } else if(mime_data){
        return { mime: mime , status: 1 };
    }else{
      console.log("success");
   }
}

module.exports = { reply };
