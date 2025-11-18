Spec técnica — Easter Egg: “DevMaster — 99 Cestas”

Cobre tudo: trigger, animações, canvas effects, persistência (local + backend opcional), botão de share pra X, geração de imagem do scoreboard, acessibilidade, testes e rollout.

Visão rápida

Quando o contador de cestas do usuário atingir 99 (transição 98→99), disparar uma experiência única e festiva uma vez por usuário com:

fogos em neon/pixel/glitch vindo de cantos da tela (canvas)

overlay cinematográfico com mensagem de parabéns e CTA para compartilhar no X (@Shuktv)

spotlight (escurecer o resto da tela)

animação do scoreboard + pulso da cesta

persistência que garante aparecer apenas uma vez por usuário (localStorage + backend opcional)

gerar imagem (canvas) do momento para compartilhar

1 — Trigger e condição

Condição: previousScore < 99 && newScore === 99

Onde checar: no fluxo que salva/atualiza score (cliente ao receber confirmação do POST /api/scores ou leitura do state).

Ação imediata no cliente:

if (prevCestas < 99 && newCestas === 99) {
  if (!localStorage.getItem('egg_99_unlocked')) {
    showDevMasterEasterEgg();
  } else {
    // já visto — não mostrar
  }
}


Observação: se o usuário estiver logado, também verificar / salvar backend flag (opcional) para persistência server-side.

2 — Persistência (para garantir “uma vez por usuário”)

Local (obrigatório):

localStorage key: "compilechill_egg_99_v1" (use versão para permitir mudanças depois)

Valor: JSON com { unlockedAt: ISOString, device: navigator.userAgent }

Server-side (opcional, recomendado se quiser registro cross-device):

Endpoint: POST /api/users/me/eggs

body: { eggId: "egg_99", unlockedAt }

Prisma model example:

model User {
  id        String @id
  // ...
  eggs      Json?    // or a separate table UserEggs { id, userId, eggId, unlockedAt }
}


Recomendação: server + client — client fallback to localStorage if offline.

3 — UX Flow (ordem das coisas)

detect trigger → pause user interactions (but keep audio/mute control accessible)

overlay fade-in (0 → 1 em 300ms) + backdrop dim (opacity ~0.7)

spotlight: desaturate/blur leve do resto do canvas (CSS filter)

iniciar fogos: spawn fireworks at corners and around hoop (canvas effects)

banner descendo (cinemático) com texto e emojis — letras animadas (type-in or stagger)

scoreboard shine + pulse + confetti/particles around scoreboard

botão “Compartilhar no X” + botão “Fechar” + botão “Guardar badge” (opcional)

persistir unlock (localStorage + API call)

finalizar: overlay auto-hide após 12s ou ao clicar “Fechar”

4 — Assets / Imagens

Nenhuma imagem externa necessária. Tudo será gerado proceduralmente via Canvas + CSS:

fogos: partículas circulares / star shapes + additive blend (globalCompositeOperation = 'lighter')

banner: Canvas + DOM overlay (use DOM for crisp text + accessibility)

scoreboard image for share: render snapshot of the scoreboard area via canvas.toDataURL() (see share section)

5 — Implementação técnica (exemplos)
5.1 showDevMasterEasterEgg (esqueleto)
async function showDevMasterEasterEgg() {
  // 1. lock UI interaction lightly
  disableGameInput();

  // 2. create overlay DOM
  const overlay = createOverlay(); // DOM node with role="dialog"
  document.body.appendChild(overlay);

  // 3. start fireworks canvas in overlay
  const fx = new FireworksCanvas(overlay.querySelector('canvas#fx'));
  fx.start();

  // 4. animate banner in
  animateBannerIn(overlay.querySelector('.banner'));

  // 5. pulse scoreboard & hoop
  pulseScoreboard();
  pulseHoop();

  // 6. persist unlock
  localStorage.setItem('compilechill_egg_99_v1', JSON.stringify({unlockedAt: new Date().toISOString()}));
  if (isLoggedIn) {
    await api.post('/api/users/me/eggs', { eggId: 'egg_99', unlockedAt: new Date().toISOString() });
  }

  // 7. attach share button behavior
  overlay.querySelector('.share-btn').addEventListener('click', shareOnX);

  // 8. attach close
  overlay.querySelector('.close-btn').addEventListener('click', () => {
    fx.stop();
    overlay.remove();
    enableGameInput();
  });

  // auto close fallback
  setTimeout(() => {
    if (document.contains(overlay)) { overlay.remove(); enableGameInput(); fx.stop(); }
  }, 12000);
}

5.2 FireworksCanvas (esboço)

Use a double-buffered canvas; particles with additive blend

Each firework = emitter with particles: color theme-aware, lifetime 700–1400ms

Spawn positions: corners and random around hoop coords

Pseudo:

class FireworksCanvas {
  constructor(canvas) { this.ctx = canvas.getContext('2d'); }
  start() { this.running = true; requestAnimationFrame(this.loop); }
  stop() { this.running = false; /* clear */ }
  loop = (t) => {
    // update particles, spawn new ones occasionally
    // draw with ctx.globalCompositeOperation = 'lighter';
    if (this.running) requestAnimationFrame(this.loop);
  }
}


Tips de visual:

ctx.globalCompositeOperation = 'lighter' para additive glow

shapes: small circles plus star polygons for variety

blur effect via shadowBlur + shadowColor

6 — Banner / Texto cinematográfico

Usar DOM (melhor acessibilidade & text selection) com CSS animado:

<div class="egg-banner" role="dialog" aria-labelledby="egg-title">
  <h1 id="egg-title">🎉 PARABÉNS, DEV! 🎉</h1>
  <p>Você atingiu <strong>99 cestas</strong>! Se chegou até aqui é porque está curtindo o site…</p>
  <p>Compartilhe com outros devs e me segue no X: <a href="https://x.com/Shuktv" target="_blank">@Shuktv</a></p>
  <div class="egg-actions">
    <button class="share-btn">Compartilhar no X</button>
    <button class="close-btn">Fechar</button>
  </div>
</div>


CSS animations:

slideDown: transform: translateY(-20px) -> 0 + opacity

letter stagger: animate letters with small delay using CSS variables or JS

7 — Share to X (Twitter) — gerar imagem + prefill tweet

Gera imagem do scoreboard (canvas) e compõe tweet com text + image

Flow:

create a temp canvas (size e.g. 1024x512)

draw background (theme), scoreboard snapshot, small overlay of fireworks (render same particles)

canvas.toBlob(blob => uploadToImageHost(blob) => getImageUrl => openTweetWindow(text + imageUrl))

If you have server upload:

Endpoint POST /api/share-image accepts file, returns public URL.
If no server:

Use Web Share API for native sharing on mobile:

if (navigator.canShare && navigator.canShare({ files: [file] })) {
  navigator.share({ files: [file], title, text });
}


Else fallback to open X compose URL:

const tweetText = encodeURIComponent("I just hit 99 baskets on Compile & Chill! @Shuktv");
window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(imageUrl)}`);


Note: posting images to Twitter via client-side is limited; best to upload to your backend (S3/Imgur/Upstash) and add URL to tweet.

8 — Badge / Emote unlock

When unlocking:

Add ephemeral popup: “Badge unlocked: DevMaster”

Add to profile badges (server-side)

Unlock special emote </legend> locally to user’s emote set

Persist server:
POST /api/users/me/badges { badgeId: 'devmaster_99' }

9 — Acessibilidade & Internacionalização

Use DOM for main text (screen readers)

Provide aria-live="polite" region for text announcements

Keyboard accessible close (Esc) and focus trap in overlay

Allow translation keys (i18n) for strings:

"PARABÉNS, DEV!" -> translatable

Allow users to opt-out from future celebrations in settings

10 — Mobile behavior

Mobile less fireworks (reduce particle count)

Use full-screen overlay for impact

Use native share (Web Share API) to attach image

Ensure auto-close after 8–10s to avoid blocking

11 — Analytics & Telemetry

Track events:

easter_egg_99_shown (userId?, clientId, timestamp)

easter_egg_99_shared (if shared)

easter_egg_99_badge_saved (if unlocked to profile)

Use for A/B testing of copy/CTA.

12 — Rate limits & Abuse

Ensure the above happens once per localStorage + server flag

If user clears storage but backend flag exists, honor backend flag to avoid duplication across devices

13 — QA Checklist

 Trigger fires exactly when newScore===99 and prev<99

 Overlay is accessible (role dialog, focus trap)

 Animation runs smoothly on desktop (60fps) and mobile (30fps)

 LocalStorage key set after event

 If logged in, server API stores egg state

 Share flow uploads/opens tweet with image URL or uses Web Share

 Emote/badge unlocked and visible on profile

 No scroll introduced by overlay

 Close and Esc work

 Reproduces across themes (Neon, Pixel, Hacker) with corresponding colors

14 — Exemplo de código: criação rápida do overlay + fireworks (vanilla)
<!-- insert into DOM when triggered -->
<div id="egg-overlay" class="egg-overlay" role="dialog" aria-modal="true">
  <canvas id="egg-fx" width="window.innerWidth" height="window.innerHeight"></canvas>
  <div class="egg-banner">
    <h1>🎉 PARABÉNS, DEV! 🎉</h1>
    <p>Você atingiu <strong>99 cestas</strong>! Se chegou até aqui é porque está curtindo o site…</p>
    <div class="egg-actions">
      <button id="shareBtn">Compartilhar no X</button>
      <button id="closeBtn">Fechar</button>
    </div>
  </div>
</div>


Simple CSS snippet:

.egg-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0,0,0,0.35);
  display:flex;
  align-items:center;
  justify-content:center;
  pointer-events:auto;
}
.egg-banner {
  position:relative;
  z-index:10000;
  background: linear-gradient(...); /* neon tint */
  padding: 24px;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.6);
  text-align:center;
}

15 — Considerações de privacidade e termos

Não peça nem poste informações sensíveis.

Ao criar imagens com user avatars, respeitar consentimento — se user is anonymous or private, avoid embedding personal info in shared images unless allowed.

16 — Rollout + Feature Flags

Feature flag egg_devmaster (off by default)

Soft launch to 5% of users, measure engagement, then ramp up