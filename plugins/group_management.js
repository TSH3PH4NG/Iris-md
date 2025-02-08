const { command , isAdmin } = require("../lib");


command({
	pattern: "group",
	fromMe: true,
}, async(message,match, m)=>{
	if(!message.jid.endsWith("@g.us")) return message.reply("only for groups");
	let bb = await isAdmin(message.jid , message.user , message.client)
	if(!bb) return message.reply("bot is not admin")
	if(!match) return message.reply("_choose from: open , close , modify and lock_");
	match = match.toLowerCase();
	
	let options = {
		"open": "not_announcement",
		"close": "announcement",
		"modify": "unlocked",
		"lock": "locked"
    };
    
    switch(options[match]){
    	case "not_announcement":
        await message.client.groupSettingUpdate(message.jid, 'not_announcement');
        break;
        case "announcement":
        await message.client.groupSettingUpdate(message.jid, 'announcement');
        break;
        case "unlocked":
        await message.client.groupSettingUpdate(message.jid, 'unlocked');
        break;
        case "locked":
        await message.client.groupSettingUpdate(message.jid, 'locked');
        break;
      }

})
