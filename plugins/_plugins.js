const { command } = require("../lib");
const axios = require("axios");
const fs = require("fs");

command(
  {
    pattern: "install",
    fromMe: true,
    desc: "Installs plugins",
    type: "user"
  },
  async (message, match) => {
    if (!match) return await message.reply("_Send a plugin URL_");
    let url;
    try {
       url = new URL(match);
    } catch (e) {
      console.log(e);
      return await message.reply("_Invalid URL_");
    }

    
    if (url.host === "gist.github.com") {
      url.host = "gist.githubusercontent.com";
      url = url.toString() + "/raw";
    } else {
      url = url.toString();
    }

    let plugin_name;
    try {
      const { data, status } = await axios.get(url);
      if (status === 200) {
        const command = data.match(/(?<=pattern:) ["'](.*?)["']/);
        plugin_name = command ? command[0].replace(/["']/g, "").trim().split(" ")[0] : "__" + Math.random().toString(36).substring(8);

        
        fs.writeFileSync(__dirname + "/" + plugin_name + ".js", data);
        try {
          require("./" + plugin_name);
        } catch (e) {
          fs.unlinkSync(__dirname + "/" + plugin_name + ".js");
          return await message.reply("Invalid Plugin\n```" + e + "```");
        }

        
        const success = await global.PluginDB.installPlugin(url, plugin_name);
        if (!success) {
          return await message.reply("_Plugin already installed_");
        }

        await message.reply(`_New plugin installed : ${plugin_name}_`);
      }
    } catch (error) {
      console.error(error);
      return await message.reply("Failed to fetch plugin");
    }
  }
);

command(
  {
    pattern: "plugins",
    fromMe: true,
    desc: "Plugin list",
    type: "user"
  },
  async (message, match) => {
    const plugins = await global.PluginDB.getPlugins();
    if (plugins.length < 1) {
      return await message.reply("_No external plugins installed_");
    }

    const msg = plugins.map(p => `\`${p.name}\`: ${p.url}`).join("\n");
    await message.reply(msg);
  }
);


command(
  {
    pattern: "remove",
    fromMe: true,
    desc: "Remove plugins",
    type: "user"
  },
  async (message, match) => {
    if (!match) return await message.reply("_Need a plugin name_");

    const success = await global.PluginDB.removePluginByName(match);
    if (!success) return await message.reply("_Plugin not found_");

    delete require.cache[require.resolve("./" + match + ".js")];
    fs.unlinkSync(__dirname + "/" + match + ".js");

    await message.reply(`Plugin ${match} deleted`);
  }
);
