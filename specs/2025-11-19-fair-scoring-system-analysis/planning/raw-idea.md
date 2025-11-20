# Raw Idea: Sistema de Pontuação Justo para Ranking Global

## Descrição Original

Verificar método de pontuação de todos jogos para o ranking global, definir cálculos que possam tornar justa a pontuação e manter uma disputa justa. 

Hoje jogos que são facilmente concluídos geram pontos absurdos como por exemplo o hack grid. 

Buscar informações do banco de dados para atualizar de acordo com as novas métricas instauradas e analisar se realmente a métrica está ok e justa. 

Fazer uma análise completa de todos os jogos. Se quiser, antes baixe todas as pontuações para entender melhor.

## Problema Identificado

O ranking global atual (`/api/scores/global-leaderboard`) ordena todos os jogos pela pontuação bruta (`score: "desc"`), sem considerar:
- A dificuldade relativa de cada jogo
- O tempo necessário para completar
- A facilidade de obtenção de pontos altos
- Jogos como Hack Grid que geram pontos "absurdos" facilmente

## Jogos na Plataforma

### Lista de Jogos
1. **Terminal 2048** - Puzzle
2. **Dev Fifteen HEX** - Puzzle
3. **Byte Match** - Memory
4. **Dev Pong** - Arcade
5. **Bit Runner** - Runner
6. **Stack Overflow Dodge** - Arcade
7. **Hack Grid** - Puzzle (PROBLEMA IDENTIFICADO)
8. **Debug Maze** - Puzzle
9. **Refactor Rush** - Puzzle
10. **Crypto Miner Game** - Idle
11. **Packet Switch** - Puzzle

### Sistemas de Pontuação Atuais

#### Terminal 2048
- **Score = soma dos valores das tiles quando são fundidas**
- Exemplo: Fundir 2+2 = 4 pontos, fundir 4+4 = 8 pontos
- Não há limite máximo teórico
- Focado apenas em progressão

#### Byte Match (Memory Game)
- **Score = max(1, 100 - moves)**
- Score máximo: 100 (completar com 0 erros)
- Score mínimo: 1
- Sistema muito simples e justo

#### Hack Grid (PROBLEMA)
```typescript
// Cálculo:
timeBonus = max(1, 300000 - duration) // 5 min max
efficiencyBonus = (requiredSegments / actualSegments) * 50
difficultyMultiplier = level.difficulty * 100
score = timeBonus + efficiencyBonus + difficultyMultiplier
```
- **Problema**: timeBonus pode ser até 300.000 pontos apenas por completar rápido
- Level 1 com difficulty=1 pode gerar ~300.000 pontos facilmente
- Completamente desproporcional aos outros jogos

#### Dev Pong
```typescript
score = playerScore * 100 + 
        hitCount * 10 + 
        timeBonus + 
        difficultyBonus
```
- Winning score = 7, então max 700 pontos base
- Sistema equilibrado mas limitado

#### Bit Runner
```typescript
score = distance * 10 + 
        (survivalTime / 1000) * 5 + 
        speedBonus
```
- Baseado em distância percorrida
- Escala infinita mas difícil

#### Stack Overflow Dodge
```typescript
score = (duration / 1000) * SCORE_PER_SECOND + bonuses
// SCORE_PER_SECOND = 12
```
- ~12 pontos por segundo de sobrevivência
- Sistema proporcional ao tempo

#### Crypto Miner (Idle)
- **Score = total de coins acumulados**
- Pode chegar a bilhões facilmente
- Sistema completamente diferente dos outros

## Objetivo da Análise

1. **Extrair dados reais** do banco de dados de todas as pontuações
2. **Analisar distribuição** de scores por jogo
3. **Identificar desbalanceamentos**
4. **Propor sistema normalizado** que considere:
   - Dificuldade do jogo
   - Tempo médio de conclusão
   - Distribuição de scores
   - Skill ceiling de cada jogo
5. **Definir fórmula de rating unificada** para ranking justo
6. **Migrar dados** aplicando nova métrica
7. **Validar** se a nova métrica está justa

## Abordagens Possíveis

### Opção 1: Sistema de Rating ELO/Glicko-like
- Cada jogo tem um rating base
- Scores são normalizados por jogo
- Ranking global baseado em rating médio ou total

### Opção 2: Normalização por Percentil
- Cada score é convertido para percentil dentro do seu jogo
- Ranking global baseado em soma/média de percentis

### Opção 3: Pontos Ponderados por Categoria
- Cada categoria de jogo tem peso diferente
- Arcade/Runner: alta variância, peso menor
- Puzzle: baixa variância, peso maior
- Idle: categoria especial

### Opção 4: Sistema de Tiers/Ligas
- Scores divididos em tiers (Bronze, Prata, Ouro, etc.)
- Ranking por tier + pontos dentro do tier

## Próximos Passos

1. Exportar todos os scores do banco de dados
2. Análise estatística por jogo (média, mediana, desvio padrão, percentis)
3. Visualizar distribuições
4. Propor sistema justo
5. Implementar nova métrica
6. Migrar dados
7. Validar resultado

