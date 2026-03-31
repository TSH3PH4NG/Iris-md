const axios = require("axios")

const GIST_ID = "c802700af9209e4f6efb84514e0f67ee"
const FILE = "sudo.json"
const TOKEN = "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"

let loaded = false
let dirty = false

const normalize = v => String(v).replace(/\D/g, "")

function ensureConfig() {
  if (!global.config) global.config = {}
  if (!Array.isArray(global.config.SUDO)) global.config.SUDO = []
}

async function loadSudo() {
  if (loaded) return global.config.SUDO
  ensureConfig()
  try {
    let bb = await axios.get(`https://api.github.com/gists/${GIST_ID}`, {
      headers: { Authorization: `token ${TOKEN}` }
    })
    let content = bb.data.files[FILE]?.content || "[]"
    let list = JSON.parse(content)
    if (Array.isArray(list)) {
      global.config.SUDO = list.map(normalize)
    }
  } catch {}
  loaded = true
  return global.config.SUDO
}

async function saveSudo() {
  if (!dirty) return
  ensureConfig()
  await axios.patch(
    `https://api.github.com/gists/${GIST_ID}`,
    { files: { [FILE]: { content: JSON.stringify(global.config.SUDO, null, 2) } } },
    { headers: { Authorization: `token ${TOKEN}` } }
  )
  dirty = false
}

async function isSudo(id) {
  await loadSudo()
  return global.config.SUDO.includes(normalize(id))
}

async function addSudo(id) {
  await loadSudo()
  id = normalize(id)
  if (global.config.SUDO.includes(id)) return false
  global.config.SUDO.push(id)
  dirty = true
  await saveSudo()
  return true
}

async function removeSudo(id) {
  await loadSudo()
  id = normalize(id)
  let i = global.config.SUDO.indexOf(id)
  if (i === -1) return false
  global.config.SUDO.splice(i, 1)
  dirty = true
  await saveSudo()
  return true
}

async function listSudo() {
  await loadSudo()
  return global.config.SUDO
}

module.exports = {
  loadSudo,
  saveSudo,
  isSudo,
  addSudo,
  removeSudo,
  
  listSudo
}
