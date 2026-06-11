const fs = require('fs');
const txt = fs.readFileSync('index.html', 'utf8');
const match = txt.match(/<section class="screen[^>]+>/g);
if (match) console.log(match.join('\n'));
