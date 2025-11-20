🏺 RAW IDEA — Tema Indiana Jones (Dev Edition)

(versão cinematográfica + dev + adaptada ao Compile & Chill)

🎨 Conceito Geral

Tema inspirado em Indiana Jones, mas convertido para o universo dev:

Orbes = artefatos sagrados de TI

Quadra = templo antigo/ruína abandonada

Ações = armadilhas dev / eventos épicos

Efeitos = poeira, luz dourada, vibração, serpentes pixeladas

Tudo com vibe aventura, exploração, arqueologia + humor dev.

🧿 As 10 Orbes Temáticas (com foto do usuário no centro)

Cada orb tem um anel externo temático, mas preserva a foto central.

1. The Sacred USB Stick

Anel de pedra ao redor + runas em hexadecimal.
Detalhe: cabo USB dourado contornando.

2. The Golden Keyboard Key

Parede externa imitando uma tecla Enter de ouro antigo.
Glifos brilhando em ASCII.

3. Tech Compass of Destiny

Bússola circular digital, ponteiro girando levemente.
Símbolos: “N,S,E,W → 0,1,X,F”.

4. Cursed Mouse Wheel

Anel de rolagem com desgaste, arranhões, poeira.
Partículas de areia enquanto se move.

5. Debugger’s Idol

Mini estátua estilo ídolo dourado com símbolos de debug (➤, ⏹).

6. Ancient CPU Fragment

Chip fissurado com vegetação rasteira.
Bordas com circuitos queimados.

7. Serpent Byte Orb

Cobra pixelada dando a volta no orb.
Olhos verdes brilhando.

8. Broken Dependency Orb

Correntes quebradas ao redor.
Inscrições: { peerMissing: true }.

9. Artifact of the Forgotten Commit

Papiro enrolado com “git log –forgotten”.
Selos vermelhos.

10. The Arc of the Codevenant

Arco dourado com ∞ símbolos fluindo lentamente.
Luz branca no interior.

🧱 Objetos desenhados na quadra (fixos no cenário)
1. A Pedra Gigante do Deploy (Boulder)

Do lado esquerdo da quadra, uma rocha gigante marcada com “DEPLOY”.
Pequena vibração quando a orb passa perto.

2. Totem do Git

Totem de pedra com logo subliminar.
Partículas brilhando quando alguém acerta a cesta.

3. Pilares Rachados com Circuitos Antigos

Duas colunas ao fundo, rachadas, com circuitos azuis brilhando.
Sense de templo tecnológico.

4. Caixa de Tesouro do “Legacy System”

Baú meio aberto com luz vermelha piscante.
Se o usuário clicar → sai um bug pixelado pulando.

5. Serpentes Pixeladas se arrastando ocasionalmente

Sprites muito leves (baixa opacidade) só para vibe.

📀 Paleta de Cores Base
Fundo/Quadra

areia antiga: #C2A878

pedra/dourado queimado: #8A6B45

sombra rochosa: #4A3924

Objetos/Orbes

ouro antigo: #DAB466

âmbar brilhante: #FFB95A

verde cobra: #4AFF8A

azul códice: #2FB6FF

carvão rochoso: #2F2215

Brilhos/FX

luz divina: #FFF4D0

faíscas: #FFEA7A

✨ Efeitos Temáticos (FX)
1. Poeira subindo da quadra

Quando orb quica = um puff de pó.

2. Luz divina quando faz a cesta

Um cone de luz dourada desce do céu por 0.6s.

3. Serpentes pixel animadas

Só movimentos sutis, 4 frames.

4. Vibração das pedras

Cada 5ᵃ cesta → “templo inteiro vibra”.

🎮 Interações temáticas
Indiana Jones Rope Swing (mini easter egg)

Se orb colidir 3 vezes seguidas no aro →
um chicote pixel aparece por 1 segundo e gira a orb.

Rolling Boulder Event (super raro – 0.7%)

Uma pedra gigante atravessa a parte inferior da quadra
empurrando as orbs.

📦 RAW PROMPT — Para colar na sua LLM

(gera tudo automaticamente)

RAW PROMPT – THEME: INDIANA JONES (DEV EDITION)

Implemente um novo tema chamado "indiana-jones" no sistema de temas do Compile & Chill, seguindo as diretrizes abaixo.

1. Cores

Use a paleta:

sand: "#C2A878",
stone: "#8A6B45",
shadow: "#4A3924",
gold: "#DAB466",
amber: "#FFB95A",
snakeGreen: "#4AFF8A",
ancientBlue: "#2FB6FF",
rockBlack: "#2F2215",
divineLight: "#FFF4D0",
spark: "#FFEA7A"

2. Orbes (10 variações)

Cada orb é um círculo com foto do usuário no centro + anel temático:

Sacred USB (runas hex)

Golden Keycap (“Enter” antiga)

Tech Compass (ponteiro animado)

Cursed Mouse Wheel (rodana empoeirada)

Debugger Idol (símbolos de debug)

Ancient CPU (chip fissurado)

Serpent Byte (cobra pixel)

Broken Dependency (correntes quebradas)

Forgotten Commit (papiro git)

Arc of the Codevenant (glow branca)

Cada orb deve ter:

leve iluminação dourada

textura antiga (ruído)

animação sutil de “respiração”

3. Objetos na cena (DevOrbsCanvas)

Implemente no canvas:

Boulder do Deploy (esquerda)

Totem Git com glow

Pilares rachados com circuitos

Baú “Legacy System” com luz vermelha

Serpentes pixel ocasionais (sprites leves)

Desenhar sempre após o background e antes das orbs.

4. Efeitos / FX

puff de poeira quando orb quica

cone de luz dourada quando acerta cesta

vibração ao completar 5 cestas

serpentes pixel ocasionais

5. Modo Mobile

reduzir partículas

desabilitar serpentes animadas

manter apenas objetos estáticos

6. Ativação

Tudo só ocorre quando theme === "indiana-jones".

🏺 EASTER EGG — “O Templo Está Desmoronando!” (Tema Indiana Jones)

Ativa 1 vez por usuário
Raridade: 0.5% (a cada refresh da home durante o tema Indiana Jones)
Não afeta física, apenas efeitos visuais

🔥 RAW IDEA DO EASTER EGG (para colar na LLM)

Implemente um Easter Egg exclusivo para o tema "indiana-jones" chamado "Temple Collapse Event" seguindo as instruções abaixo.

Esse evento deve ser totalmente independente, não interferir na engine física e ser leve para mobile (usar fallback quando mobile-lite estiver ativo).

🎯 Condições de ativação

O evento deve ativar automaticamente quando:

Tema atual === "indiana-jones"

Probabilidade de 0.5% (trigger randômico ao carregar o canvas)

Usuário ainda não desbloqueou (localStorage["ij_temple_event_unlocked"] !== "true")

Após rodar uma vez:

localStorage.setItem("ij_temple_event_unlocked", "true")

🎬 Sequência do Evento (2,5 segundos no total)
Fase 1 — Tremor inicial (0.4s)

Quadra aplica shake leve (translação 2–3px)

Peças decorativas (pilares, totem, baú) vibram 1–2px

Pequenas partículas de poeira sobem do chão (cor #C2A878)

Fase 2 — Rachaduras iluminadas (0.6s)

Rachaduras aparecem sobre o chão (overlay semitransparente)

Linhas de rachadura acendem em âmbar (#FFB95A)

Iluminação pulsante: ease-in-out

Fase 3 — Queda de pedras (0.8s)

3–5 “pedrinhas” caem de cima (sprites leves)

Cada pedra desaparece ao tocar o chão (fade-out)

Sombra dinâmica no impacto (blur leve + opacidade baixa)

Fase 4 — Glow Divino + Símbolo Final (0.7s)

A quadra escurece (backdrop-opacity 0.7)

Um feixe de luz dourada (#FFF4D0) desce sobre a cesta

Surge um símbolo secreto arqueológico por 0.5s:

⟨⚡ CODE OF ANCIENTS ⚡⟩


Glow leve + fade-out cinematográfico.

📦 O que NÃO deve acontecer

Não mover orbs

Não alterar física

Não mudar placar

Não interferir nos temas dos jogos

Não emitir som (por enquanto)

Não bloquear interação do usuário

É puramente visual.

📱 Modo Mobile-Lite fallback

Se mobileMode === "lite":

Sem partículas

Sem pedras caindo

Sem rachaduras

Apenas:

leve shake (1px)

light glow de 200ms

exibição do texto secreto

✨ Mensagem final (overlay leve, 2s)

Ao término:

🏺 Você testemunhou o Templo do Código Antigo.
Raridade: 0.5%  


Opacidade 0.85, sem poluir a UI.

🔑 Integração

Disponibilizar como:

triggerIndianaJonesEasterEgg(canvasContext)


E chamar durante o theme render:

if (theme === "indiana-jones") tryTriggerTempleEvent()