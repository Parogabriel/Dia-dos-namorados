const fs = require('fs');
const txt = fs.readFileSync('temp.txt', 'utf16le');
const match = txt.match(/<button class="pbtn[^>]*>.*?<\/button>/g);
if (match) {
  match.slice(0, 4).forEach(m => {
    let hex = [];
    for(let i=0; i<m.length; i++) {
       if(m.charCodeAt(i) > 127) hex.push(m.charCodeAt(i).toString(16));
    }
    console.log(m, hex.join(' '));
  });
}
