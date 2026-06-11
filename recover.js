const fs = require('fs');

const win1252ToByte = {
  '\u20AC': 0x80,
  '\u201A': 0x82,
  '\u0192': 0x83,
  '\u201E': 0x84,
  '\u2026': 0x85,
  '\u2020': 0x86,
  '\u2021': 0x87,
  '\u02C6': 0x88,
  '\u2030': 0x89,
  '\u0160': 0x8A,
  '\u2039': 0x8B,
  '\u0152': 0x8C,
  '\u017D': 0x8E,
  '\u2018': 0x91,
  '\u2019': 0x92,
  '\u201C': 0x93,
  '\u201D': 0x94,
  '\u2022': 0x95,
  '\u2013': 0x96,
  '\u2014': 0x97,
  '\u02DC': 0x98,
  '\u2122': 0x99,
  '\u0161': 0x9A,
  '\u203A': 0x9B,
  '\u0153': 0x9C,
  '\u017E': 0x9E,
  '\u0178': 0x9F
};

let txt = fs.readFileSync('index.html', 'utf8');
let buf = Buffer.alloc(txt.length);

let offset = 0;
for (let i = 0; i < txt.length; i++) {
  let char = txt[i];
  if (win1252ToByte[char] !== undefined) {
    buf[offset++] = win1252ToByte[char];
  } else {
    // Regular latin1 maps 1-to-1 with Unicode up to 0xFF
    let code = char.charCodeAt(0);
    if (code > 0xFF) {
      // If it's still > 0xFF and not in our map, it might be something we injected manually
      // like the "Abra seu presente. 🎁" button!
      // Since it's a mix of double encoded and correctly encoded (my injected gift letter)
      // Wait! I injected the gift letter AFTER the file was double encoded!
      // This means my injected UTF-8 characters are CORRECT in the file!
      // If I map them to Latin1, they will be corrupted!
      // This is slightly tricky.
    }
    buf[offset++] = code & 0xFF; // we'll just handle it basically for now
  }
}
buf = buf.slice(0, offset);

let restored = buf.toString('utf8');
console.log(restored.substring(34000, 35000));
