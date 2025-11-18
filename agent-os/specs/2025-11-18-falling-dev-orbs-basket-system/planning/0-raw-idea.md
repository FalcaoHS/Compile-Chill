# Falling Dev Orbs + Basket System

🎯 Propósito geral

Transformar a Home do Compile & Chill numa experiência divertida e interativa:

as fotos dos últimos usuários aparecem como bolinhas perereca caindo do topo, com física real, colidindo entre si e podendo ser jogadas para dentro de uma cestinha de basquete neon.

Se o usuário acertar uma bolinha na cesta → efeito especial + fogos + animação temática.

Cria sensação de vida, comunidade, diversão e "dev chaos controlado".

🟣 1. Quem vira bolinha? (Métrica de escolha)

Podemos usar:

✔ Últimos 10 usuários logados recentemente

evita excessos

mostra gente ativa

dá sensação de "portal vivo"

OU

✔ Últimos 5 novos usuários (fresh arrivals)

incentiva integração

celebra novos perfis

OU

✔ Mix inteligente:

5 mais recentes

5 com maior atividade na última hora

Isso cria variedade, sem repetição constante.

Decisão recomendada para MVP:

➡️ Últimos 10 usuários que logaram nos últimos 5 minutos (fallback para 5 min se não houver 10).

🔵 2. Representação visual — "Dev Orbs"

Cada usuário aparece como:

bolinha circular (sprite 64–96px)

com a foto do avatar arrendondada

borda neon/pixel tema-aware

física real (gravidade + bounce + friction + collision)

comportamento de bolinha perereca (elasticidade configurável)

Interatividade:

usuário pode arrastar e arremessar

quanto mais forte o arremesso, mais longe voa

ângulo + força determina a trajetória

físicas estilo "puxar com dedo/mouse + soltar"

🟠 3. Cestinha de basquete no topo

fixa no topo, no centro ou canto

estilo pixel/neon dependendo do tema

área interna detecta colisão com orb

se orb entra = evento de acerto

Evento de acerto:

fogos de artifício (sprites leves tema-aware)

som opcional (muted por padrão)

partícula explosiva neon/pixel

micro animação da cesta "tremer"

HUD mostra:

"Você acertou o DevBall!"

bônus opcional (coins, XP, badge)

🟢 4. Física

Usar uma engine leve tipo:

Matter.js

Planck.js

ou física manual simplificada com verlet integration

Propriedades:

gravityY = 1.2–1.6

restitution (elasticidade) = 0.6–0.8 (efeito perereca)

frictionAir = baixo

collisions entre bolinhas

paredes invisíveis laterais

limite inferior (chão)

Requisito essencial:

➡️ Área física deve estar 100% dentro da viewport e nunca criar scroll.

🟡 5. Spawn behavior (como caem?)

Cada orb:

spawna no topo, posição aleatória

cai suavemente com física

pode bater na cesta se cair no mesmo lado

usuário pode interagir logo ao spawn

Spawn interval:

todos de uma vez OU

1 por segundo até completar 10

🔥 6. Variantes para temas

Tema Cyber Hacker

bolas verdes com glitch

cesta com scanlines

fogos estilo matrix rain

Tema Pixel Lab

bolas 8-bit

fogos pixel quadradinhos

cesta pixel estilo NES

Tema Neon Future

bolas super brilhantes

rastro neon

cesta com efeito bloom

Tema Terminal

bolas ASCII '()'

cesta com borda ####

fogos estilo caracteres random

🧬 7. Ações do usuário

O usuário pode:

arrastar

lançar

pegar orb no ar

fazer trickshots

tentar acertar múltiplas vezes

limpar a área (reset botão)

Não permitido:

zoom

redimensionar canvas

movimento vertical do viewport

🎆 8. Recompensas (opcional, mas divertido)

Acertos podem gerar:

XP no perfil

badge "Cesta de 3 Pontos"

animação única por primeiro acerto

rare drops (emotes, efeitos, temas)

pontuação global com leaderboard de trickshots

⚠️ 9. Performance

Limitar:

máximo de 10 orbs

máximo de 1–2 efeitos de fogos simultâneos

desligar sombras em mobile

fallback para imagens estáticas se FPS < 40

🔵 10. Informações para backend

Precisa expor:

endpoint para pegar últimos 10 usuários

endpoint para registrar "acertos" (opcional)

cache leve para evitar spam

🎨 11. Layout geral

[ Header fixo ]

[ Cesta ]        ← no topo, centralizada ou à direita

[ Área de Física (viewport height - header) ]

[ Bolinhas caindo e sendo arremessadas ]

Sem scroll.

Qualquer elemento extra vai por cima (overlay fixo), nunca abaixo.

🎯 Resumo final (copy/paste)

Home exibe até 10 Dev Orbs (últimos usuários logados)

Orbs caem com física e podem ser arrastados/arremessados

Cestinha no topo dá fogos ao acertar

Tema-aware (pixel, neon, hacker, terminal)

Física real, mas leve

Sem scroll no desktop

Avatares viram bolinhas perereca

Possibilidade de recompensas opcionais

Jogabilidade "sandbox" divertida

Spawn dinâmico com colisões

