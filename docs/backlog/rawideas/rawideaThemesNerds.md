Para cada tema do site (Matrix, Tron, Zelda, Portal, Star Wars Dark Side, Avengers, etc.) o sistema deve gerar 1 a 3 objetos temáticos posicionados na quadra, fixos nas bordas, que reforçam a identidade visual sem atrapalhar a jogabilidade.

Esses objetos:

Não fazem parte das orbs

Não têm física

Podem animar suavemente

Devem ser minimalistas, como “props digitais”

Nunca devem parecer cópia protegida de IP

Sempre devem ser “inspirados”, não replicados

Devem ser desenhados por Canvas API (2D) ou procedural shapes

Exemplo:
No tema “Chaves”, um barril minimalista no canto da quadra.

🧩 Formato que a LLM deve seguir para cada tema

Para cada tema você deve gerar:

themeDecor: {
  name: "<nome do objeto>",
  description: "<como ele deve parecer>",
  shapeComposition: [ <lista de formas primitivas> ],
  animation: "<animação suave e leve>",
  position: "<onde fica na quadra>",
  colorScheme: { ... cores ... },
  optionalElements: [ ... efeitos visuais adicionais ... ]
}

🔧 Regras para geração

A LLM DEVVE OBRIGATORIAMENTE seguir:

✔ Usar somente formas:

retângulos

círculos

polígonos simples

linhas

gradientes

sombras/glows

✔ Nunca copiar formatos exatos de objetos protegidos

Sem logos, marcas, personagens reproduzidos.
Sempre o estilo visual, nunca a forma idêntica.

✔ O objeto precisa ser imediatamente identificável pelo tema

Mesmo como minimalismo geométrico.

✔ Não deve competir com o placar nem com as orbs

Posições recomendadas:

canto inferior esquerdo

canto inferior direito

canto superior esquerdo

canto superior direito

lateral da quadra

✔ Deve aparecer apenas um objeto por tema (ou no máximo 3 variantes pequenas)
✔ Deve ter micro animações suaves (opcional)

leve pulsação

brilho alternado

tela piscando

partícula sutil

rotação mínima

💡 Agora, as RAW IDEAS específicas para cada tema que você pediu

(Estas já estão prontas para passar para a LLM)

1️⃣ Zelda – Sheikah Slate

Objeto: Pedra Sheikah Minimalista
Forma: retângulo arredondado + olho Sheikah geométrico
Cores: azul Sheikah, cinza pedra
Animação: brilho pulsante no símbolo
Posição: canto superior esquerdo
Vibe: artefato antigo misturado com tecnologia

2️⃣ Minecraft – Redstone

Objeto: Totem de Redstone Ativado
Forma: blocos quadrados empilhados + linha vermelha central
Cores: marrom terra, vermelho pulsante
Animação: pulsar ON/OFF como circuito powered
Posição: canto inferior esquerdo
Vibe: pixel tech com energia viva

3️⃣ Matrix – Green Rain

Objeto: Coluna de Código Caindo
Forma: bloco vertical 3px + caracteres individuais
Cores: verde neon, preto puro
Animação: queda contínua estilo digital rain
Posição: lateral direita
Vibe: fragmento da Matrix “vazando” para o mundo real

4️⃣ Star Wars – Dark Side

Objeto: Núcleo Sith Instável
Forma: esfera negra com rachaduras vermelhas
Cores: preto absoluto, vermelho queimado
Animação: rachaduras pulsando como sabre instável
Posição: canto superior direito
Vibe: energia do lado sombrio emanando

5️⃣ Tron Grid

Objeto: Torre de Energia do Grid
Forma: cilindro azul neon com linhas vetoriais
Cores: azul-ciano, preto neon
Animação: pulsos verticais subindo
Posição: lateral esquerda
Vibe: infraestrutura digital viva

6️⃣ Portal – Aperture Science

Objeto: Mini Portal Generator
Forma: dois arcos semicirculares (azul e laranja)
Cores: #42C6FF, #FF7A00
Animação: rotação alternada
Posição: canto inferior direito
Vibe: máquina test chamber portátil

7️⃣ Avengers – Stark Tech

Objeto: Arc Reactor Pad
Forma: círculo triplo com anéis concêntricos
Cores: arc blue, branco holográfico
Animação: rotação suave dos anéis
Posição: canto da quadra, centralizado lateralmente
Vibe: tecnologia Stark energizando o ambiente

🔥 O que a LLM deve gerar na spec final

Peça pra ela gerar:

Um objeto por tema

Formato programático para Canvas 2D

Animações minimalistas

Proporção em relação ao canvas

Lista de shapes

Cores

Eventos opcionais (hover, click)

Fallback para Mobile Lite