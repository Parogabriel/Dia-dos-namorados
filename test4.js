const fs = require('fs');
const txt = fs.readFileSync('index.html', 'utf8');
const match = txt.match(/<section class="screen" id="s-4"[\s\S]*?<\/section>/);
if (match) console.log(match[0].substring(Math.max(0, match[0].length - 500)));
