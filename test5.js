const fs = require('fs');
const txt = fs.readFileSync('index.html', 'utf8');
const match = txt.match(/<section class="screen" id="s-\d+"[\s\S]*?WORDLE/);
if (match) console.log(match[0].substring(0, 50));
