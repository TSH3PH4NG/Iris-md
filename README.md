# Iris-MD

Powerful, lightweight WhatsApp bot built for speed, simplicity, and control.

---

## Features

* Fast and optimized Baileys MD base
* Media downloader (TikTok, YouTube, Instagram)
* Smart commands and automation
* Anti-ban and anti-detection tweaks
* Easy plugin system
* Works on Termux

---

## Installation (Termux)

```bash
pkg update && pkg upgrade -y
pkg install git nodejs ffmpeg -y
pkg install yarn -y
```

### Clone Repository

```bash
git clone https://github.com/TSH3PH4NG/Iris-md
cd Iris-md
```

### Install Dependencies

```bash
npm install
```

### Start the Bot

```bash
node index.js
```

---

## Session Setup

It is recommended to use QR login instead of pair code (pairing is currently unstable).

<div align="center">

<svg width="420" height="140" viewBox="0 0 420 140" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="420" height="140" rx="16" fill="#0f172a"/>
  <text x="210" y="45" font-size="18" text-anchor="middle" fill="#e5e7eb" font-family="Arial, sans-serif">
    Scan QR to connect your WhatsApp
  </text>
  <a href="https://qr-qwdj.onrender.com/">
    <rect x="110" y="70" width="200" height="40" rx="10" fill="#2563eb"/>
    <text x="210" y="95" font-size="14" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif">
      QR Page
    </text>
  </a>
</svg>

</div>

* Run the bot
* Open the QR link above
* Scan using WhatsApp
* Done

---

## Deployment

## Deployment & new updates Coming soon way sooner...:
[![Deploy to Koyeb](https://www.koyeb.com/static/images/deploy/button.svg)](https://app.koyeb.com/deploy?name=iris-md&type=git&repository=TSH3PH4NG%2FIris-md&branch=master&build_command=npm+install&run_command=node+index.js&instance_type=free&regions=fra&instances_min=0&autoscaling_sleep_idle_delay=3900&env%5BSESSION_ID%5D=&env%5BSUDO%5D=)

---

## Project Structure

```
Iris-md/
├── lib/
├── plugins/
├── resources/
├── index.js
├── config.js
└── package.json
```

---

## Configuration

Edit your settings inside:

```
config.js
```

---

## Upcoming Updates

* Advanced plugin loader
* AI-powered responses
* Better audio metadata system
* Auto-update system

---

## Contributing

Pull requests are welcome.
Keep it clean, optimized, and modular.

---

## Disclaimer

This project is for educational purposes only.
Use responsibly.

---

## Author

Tshephang Masia

---

## Support

* Star the repo
* Fork it
* Share it
