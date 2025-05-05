const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "database.json");


if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ plugins: [] }, null, 2));
}

function readDB() {
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

async function installPlugin(url, name) {
  const db = readDB();
  const exists = db.plugins.find(p => p.url === url);
  if (exists) return false;

  db.plugins.push({ name, url });
  writeDB(db);
  return true;
}

async function getPlugins() {
  const db = readDB();
  return db.plugins;
}


async function removePluginByName(name) {
  const db = readDB();
  const index = db.plugins.findIndex(p => p.name === name);
  if (index === -1) return false;

  db.plugins.splice(index, 1);
  writeDB(db);
  return true;
}

global.PluginDB = {
  installPlugin,
  getPlugins,
  removePluginByName
};
