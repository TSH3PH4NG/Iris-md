const axios = require("axios");

const GIST_ID = "29625827ae722e4a2a44786d3bcf0ba1";
const FILE = "credits.json";
const TOKEN = "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";

let cache = null;
let dirty = false;

async function loadDB() {
  if (cache !== null) return cache;
  try {
    const { data } = await axios.get(`https://api.github.com/gists/${GIST_ID}`, {
      headers: { Authorization: `token ${TOKEN}` },
    });
    const content = data.files[FILE]?.content || "{}";
    cache = JSON.parse(content);
    for (const id in cache) {
      if (typeof cache[id] === "number") cache[id] = { credits: cache[id] };
      else if (!cache[id]?.credits) cache[id] = { credits: 0 };
    }
  } catch (e) {
    cache = {};
  }
  return cache;
}

async function saveDB() {
  if (!dirty) return;
  try {
    await axios.patch(
      `https://api.github.com/gists/${GIST_ID}`,
      { files: { [FILE]: { content: JSON.stringify(cache, null, 2) } } },
      { headers: { Authorization: `token ${TOKEN}` } }
    );
    dirty = false;
  } catch (e) {}
}

function addCredit(id, credits = 5) {
  if (!cache) cache = {};
  credits = parseInt(credits);
  if (isNaN(credits) || credits < 1) credits = 1;
  if (!cache[id]) cache[id] = { credits: 0 };
  cache[id].credits += credits;
  dirty = true;
}

function deleteUser(id) {
  if (!cache || !cache[id]) return false;
  delete cache[id];
  dirty = true;
  return true;
}

function modifyCredit(id) {
  if (!cache || !cache[id] || cache[id].credits <= 0) return { ok: false };
  cache[id].credits -= 1;
  dirty = true;
  if (cache[id].credits <= 0) {
    delete cache[id];
    return { ok: false, empty: true };
  }
  return { ok: true, remaining: cache[id].credits };
}

function getUsers() {
  return cache || {};
}

const validateNumber = (number) => {
  const cleaned = number.replace(/\D/g, "");
  return cleaned.length >= 10 && cleaned.length <= 15;
};

const getCleanJid = (jid) => jid.split("@")[0];

module.exports = {
  loadDB,
  saveDB,
  addCredit,
  deleteUser,
  modifyCredit,
  getUsers,
  validateNumber,
  getCleanJid,
};
