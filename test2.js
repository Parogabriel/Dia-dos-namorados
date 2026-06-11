const fs = require('fs');
const txt = fs.readFileSync('index.html', 'utf8');
const start = txt.indexOf('id="s-2"');
console.log(txt.substring(start - 200, start + 50));
