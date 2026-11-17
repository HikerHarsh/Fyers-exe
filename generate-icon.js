// generate-icon.js — Fyers logo se icon banao (PNG)
// Run: node generate-icon.js

const https = require('https');
const fs = require('fs');
const path = require('path');

const ICON_URL = 'https://fyers.in/favicon.ico';
const OUT_PATH = path.join(__dirname, 'assets', 'icon.ico');

console.log('Fyers favicon download ho raha hai...');

const file = fs.createWriteStream(OUT_PATH);
https.get(ICON_URL, (res) => {
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('✅ icon.ico save ho gaya:', OUT_PATH);
  });
}).on('error', (err) => {
  fs.unlink(OUT_PATH, () => {});
  console.error('❌ Error:', err.message);
  console.log('Manual icon.ico assets/ folder mein rakh do (256x256 recommended)');
});
