const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Shift screen IDs: s-12 -> s-13, s-11 -> s-12 ... s-1 -> s-2
// We do this by replacing id="s-X" and goTo(X)
html = html.replace(/id="s-(\d+)"/g, (match, p1) => {
    let num = parseInt(p1);
    if (num >= 1) return `id="s-${num + 1}"`;
    return match;
});

html = html.replace(/goTo\((\d+)\)/g, (match, p1) => {
    let num = parseInt(p1);
    if (num >= 1) return `goTo(${num + 1})`;
    return match;
});

// Update the section comments for clarity
html = html.replace(/<!-- ===== (\d+) (.*?) ===== -->/g, (match, p1, p2) => {
    let num = parseInt(p1);
    if (num >= 1) return `<!-- ===== ${num + 1} ${p2} ===== -->`;
    return match;
});

// 2. Change the button on the first page
// The button was: <button class="btn btn-g anim-fadeUp s6" onclick="goTo(1)">Continuar →</button>
// Wait! I just shifted goTo(1) to goTo(2) above!
// So it currently says: onclick="goTo(2)">Continuar →</button>
// Let's replace the first instance of this button in s-0.
// I will target the exact button in the first screen.
html = html.replace(
    /<button class="btn btn-g anim-fadeUp s6" onclick="goTo\(2\)">Continuar →<\/button>/,
    '<button class="btn btn-g anim-fadeUp s6" onclick="goTo(1)">Abra seu presente. 🎁</button>'
);

// 3. Insert the new section s-1
const newScreen = `
  <!-- ===== 1 — PRESENTE ===== -->
  <section class="screen" id="s-1" style="background:linear-gradient(180deg,#2a0812,#0a0a0a 80%); overflow-y:auto; padding-bottom: 2rem;">
    <div class="flex flex-col items-center min-h-screen px-6 py-16 gap-6 w-full max-w-sm" style="margin:0 auto;">
      <div class="anim-fadeUp s1" style="width:100%; text-align:center;">
        <h2 class="font-caveat text-4xl text-center" style="color:#ff4d8d; text-shadow: 0 0 15px rgba(255,77,141,0.4); margin-bottom: 1.5rem;">Feliz Dia dos Namorados!</h2>
        
        <div class="glass p-6 w-full text-left" style="line-height: 1.7; font-size: 15px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,77,141,0.2); box-shadow: 0 0 30px rgba(255,77,141,0.05);">
          <p class="mb-4 text-white">
            Feliz Dia dos Namorados, meu amor. Esse site é só uma das formas que eu encontrei de te agradecer por todo o apoio, pela parceria e por cada momento de alegria que você entrega na minha vida todos os dias. Estar do seu lado faz tudo ficar mais leve.
          </p>
          <p class="mb-4 text-white">
            Você é, sem dúvidas, o melhor presente que Deus colocou na minha vida, e sou grato a Ele todas as noites por ter cruzado os nossos caminhos.
          </p>
          <p class="mb-4 text-white">
            Desejo do fundo do meu coração que esse dia seja só mais um de tantos e tantos outros que ainda vamos viver juntos. E que, com o passar dos anos, a gente nunca perca esse carinho, essa nossa cumplicidade e o empenho de fazer de tudo para alegrar a vida do outro.
          </p>
          <p class="mb-4 text-white">
            Você é o grande amor da minha vida e eu quero que você entenda e sinta isso de todas as formas possíveis, todos os dias. Obrigado por ser essa companheira incrível, a melhor namorada e a minha futura esposa do mundo.
          </p>
          <p class="font-bold text-center" style="color:#ff4d8d; font-size:18px;">
            Eu te amo mais que tudo nesse mundo. ❤️
          </p>
        </div>
      </div>
      <button class="btn btn-g anim-fadeUp s3 mt-4" onclick="goTo(2)" style="background:#ff4d8d; color:white; border:none; box-shadow: 0 0 15px rgba(255,77,141,0.5);">Nossa Jornada →</button>
    </div>
  </section>
`;

const splitToken = '  <!-- ===== 2 — INTRO WRAPPED ===== -->';
html = html.replace(splitToken, newScreen + '\n' + splitToken);

// 4. Update the TOTAL constant
html = html.replace('const TOTAL = 13;', 'const TOTAL = 14;');

// 5. Update the init logic in goTo
html = html.replace('if (i === 1) initWrapped();', 'if (i === 2) initWrapped();');
html = html.replace('if (i === 2) initUniverse();', 'if (i === 3) initUniverse();');
html = html.replace('if (i === 3) initWordle();', 'if (i === 4) initWordle();');
html = html.replace('if (i === 4) initTimeline();', 'if (i === 5) initTimeline();');
html = html.replace('if (i === 5 && !mapInit', 'if (i === 6 && !mapInit');

// 6. Replace the Moon with Constellation
// The Moon screen was originally s-3, now it's s-4
const cssToInsert = `
    .star-map-container {
      position: relative;
      width: 250px;
      height: 250px;
      margin: 0 auto 1rem;
      border-radius: 50%;
      box-shadow: 0 0 40px rgba(160, 196, 255, 0.1);
    }
    
    #starMap {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: radial-gradient(circle at center, #0a1128 0%, #03050a 100%);
      box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
    }
    
    .overlay-ring {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.15);
      pointer-events: none;
    }
  </style>`;

if (!html.includes('.star-map-container')) {
    html = html.replace('</style>', cssToInsert);
}

const bigMoonRegex = /<div class="anim-fadeUp s1" style="animation:float 4s ease-in-out infinite;">\s*<svg width="80" height="80"[\s\S]*?<\/svg>\s*<\/div>/;
const starMapHtml = `<div class="anim-fadeUp s1">
        <div class="star-map-container">
          <canvas id="starMap"></canvas>
          <div class="overlay-ring"></div>
        </div>
      </div>`;
html = html.replace(bigMoonRegex, starMapHtml);

const luaCardRegex = /<div class="glass p-5 w-full anim-fadeUp s4">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
const constelacaoCard = `<div class="glass p-5 w-full anim-fadeUp s4">
        <div class="flex items-center justify-center gap-4">
          <svg width="32" height="32" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="#0a1128" />
            <circle cx="30" cy="40" r="2" fill="#fff" />
            <circle cx="50" cy="30" r="3" fill="#fff" />
            <circle cx="70" cy="60" r="2" fill="#fff" />
            <path d="M 30 40 L 50 30 L 70 60" stroke="#fff" stroke-width="1" fill="none" opacity="0.6"/>
          </svg>
          <div>
            <p class="font-outfit font-semibold text-sm">Céu Noturno</p>
            <p class="text-xs" style="color:rgba(255,255,255,0.5);">Estrelas de 23/12/2023</p>
          </div>
        </div>
      </div>`;
html = html.replace(luaCardRegex, constelacaoCard);

if (!html.includes('<script src="script.js"></script>')) {
    html = html.replace('</body>', '  <script src="script.js"></script>\n</body>');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log("Changes applied flawlessly.");
