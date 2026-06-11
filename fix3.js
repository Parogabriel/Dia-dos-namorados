const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Change the "Sobre o casal" button
html = html.replace(
    /<button class="btn btn-g anim-fadeUp s5" onclick="goTo\(2\)"[^>]*>Sobre o\s*casal[^<]*<\/button>/,
    '<button class="btn btn-g anim-fadeUp s5" onclick="goTo(1)" style="padding:10px 24px;border-radius:24px;">Abra seu presente. 🎁</button>'
);

// 2. Insert the gift letter
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

// Only insert if it's not already there
if (!html.includes('id="s-1"')) {
    const splitToken = '  <!-- ===== 2 — STATS ===== -->';
    html = html.replace(splitToken, newScreen + '\n' + splitToken);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed button and section 1!');
