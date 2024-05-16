const {
  default: makeWASocket,
      useMultiFileAuthState,
      Browsers,
      makeInMemoryStore
  } = require("@whiskeysockets/baileys");
  const path = require("path");
  const {
      Image,
      Message,
      Sticker,
      Video
  } = require("./lib/Messages");
  let fs = require("fs");
  let config = require("./config");
  const pino = require("pino");
  const port = 3000;
  logger = pino({
      level: "silent"
  });
  const {
      serialize,
      Greetings
  } = require("./lib");
  const events = require("./lib/events");
  const express = require("express");
  const app = express();
  const store = makeInMemoryStore({
   logger: pino().child({ level: "silent", stream: "store" }),
   });



 const {
      MakeSession
  } = require("./lib/session");
  if (!fs.existsSync("./resources/auth/creds.json")) {
      MakeSession(config.SESSION_ID, "./resources/auth/creds.json").then(
          console.log("vesrion : " + require("./package.json").version)
      );
  }
  fs.readdirSync(__dirname + "/resources/database/").forEach((db) => {
      if (path.extname(db).toLowerCase() == ".js") {
          require(__dirname + "/resources/database/" + db);
      }
  });
  async function Iris() {
      const {
          state, saveCreds
      } = await useMultiFileAuthState(
          __dirname + "/resources/auth"
      );
      let conn = makeWASocket({
          auth: state,
          printQRInTerminal: true,
          logger: pino({
              level: "silent"
          }),
          browser: Browsers.macOS("Desktop"),
          downloadHistory: false,
          syncFullHistory: false,
          markOnlineOnConnect: false,
          emitOwnEvents: true,
      });


      conn.ev.on("connection.update",
          async (s) => {
              const {
                  connection,
                  lastDisconnect
              } = s;
              if (connection === "connecting") {
                  console.log("X-AsenaDuplicated");
                  console.log("ℹ️ Connecting to WhatsApp... Please Wait.");
              }
              if (connection === "open") {
                  console.log("✅ Login Successful!");
                  console.log("Syncing Database");
                  config.DATABASE.sync();
                  conn.ev.on("creds.update", saveCreds);

                  console.log("⬇️  Installing Plugins...");
                  fs.readdirSync(__dirname + "/plugins").forEach((plugin) => {
                      if (path.extname(plugin).toLowerCase() == ".js") {
                          require(__dirname + "/plugins/" + plugin);
                      }
                  });
                  console.log("✅ Plugins Installed!");

                  let str = `\`\`\`Iris connected \nversion : ${
                  require(__dirname + "/package.json").version
                  }\nTotal Plugins : ${events.commands.length}\nWorktype: ${
                  config.WORK_TYPE
                  }\`\`\``;
                  conn.sendMessage(conn.user.id,
                      {
                          text: str
                      });
                
    conn.ev.on("group-participants.update",
                      async (data) => {
                          Greetings(data, conn);
                      });
                  conn.ev.on("messages.upsert",
                      async (m) => {
                          if (m.type !== "notify") return;
                          let msg = await serialize(
                              JSON.parse(JSON.stringify(m.messages[0])),
                              conn
                          );
                          if (!msg) return;

                          let su = msg.sender.split("@")[0]
                          su = su.split(":")[0]
                          let text_msg = msg.body;
                          if (text_msg && config.LOGS)
                              console.log(
                              `At : ${
                              msg.from.endsWith("@g.us")
                              ? (await conn.groupMetadata(msg.from)).subject: msg.from
                              }\nFrom : ${msg.sender}\nMessage:${text_msg}\nSudo:${msg.sudo.includes(
                                      su
                                  )}`
                          );

                          

                          events.commands.map(async (command) => {

                              if (
                                  command.fromMe &&
                                  !msg.sudo.includes(
                                      su
                                  )
                              ) {
                                  return;
                              }
                              let prefix =  config.HANDLERS.trim();

                              let comman = text_msg;
                               try{
                              if(typeof comman === "string" && !comman.startsWith(prefix)) comman = false;
                              }catch(e){
                              	comman = false
                               }
      
                              msg.prefix = prefix;


                              let whats;
                              switch (true) {


                                  case command.pattern && command.pattern.test(comman):

                                          try{
                                          match = text_msg
                                          .replace(new RegExp(command.pattern, "i"), "")
                                          .trim();
                                          } catch(e){
                                          match = false;
                                           }

                                      whats = new Message(conn, msg);
                                      command.function(whats, match, msg, conn);
                                      break;

                                     case text_msg && command.on === "text":
                                      whats = new Message(conn, msg);
                                      command.function(whats, text_msg, msg, conn, m);
                                      break;

                                  case command.on === "image" || command.on === "photo":
                                      if (msg.type === "imageMessage") {
                                          whats = new Image(conn, msg);
                                          command.function(whats, text_msg, msg, conn, m);
                                      }
                                      break;

                                  case command.on === "sticker":
                                      if (msg.type === "stickerMessage") {
                                          whats = new Sticker(conn, msg);
                                          command.function(whats, msg, conn, m);
                                      }
                                      break;
                                  case command.on === "video":
                                      if (msg.type === "videoMessage") {
                                          whats = new Video(conn, msg);
                                          command.function(whats, msg, conn, m);
                                      }
                                      break;

                                  default:
                                      break;
                              }
                          });
                      });
              }
              if (
                  connection === "close" &&
                  lastDisconnect &&
                  lastDisconnect.error &&
                  lastDisconnect.error.output.statusCode != 401
              ) {
                  Iris();
              }
          });
  };

  app.get("/", (req, res) => res.type('html').send(`<p2>Hello world</p2>`));
app.listen(port, () => console.log(` Server listening on port http://localhost:${port}!`));
  setTimeout(() => {
      Iris();
  }, 6000);
