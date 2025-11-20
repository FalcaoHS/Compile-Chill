# 🪙 Gerenciamento de Tokens — Drivers Compile & Chill

**⚠️ CRÍTICO: Este arquivo DEVE ser lido ANTES de executar qualquer driver!**

Autor: Hudson "Shuk" Falcão  
Data: 20/11/2025  
Versão: 1.0

## 🎯 Objetivo

Este documento define as regras OBRIGATÓRIAS para gerenciamento de consumo de tokens durante a execução dos drivers, garantindo que colaboradores não sejam prejudicados por uso excessivo de tokens, especialmente aqueles com planos gratuitos.

## ⚠️ REGRA CRÍTICA: O Agente DEVE Informar Sobre Tokens

**ANTES de executar QUALQUER driver, o agente DEVE:**

1. **Informar sobre consumo de tokens:**
   - Explicar que o driver pode consumir muitos tokens
   - Estimar (quando possível) o consumo aproximado
   - Alertar sobre o impacto no limite diário/mensal

2. **Perguntar sobre o plano do usuário:**
   - "Você está usando plano pago ou free?"
   - "Qual seu limite atual de tokens?"
   - "Você tem preocupações com consumo de tokens?"

3. **Explicar os riscos:**
   - Plano free: pode esgotar tokens rapidamente
   - Plano pago: pode gerar custos inesperados
   - Impacto em outras sessões do dia

4. **Oferecer modo leve:**
   - Opção de executar com menos contexto
   - Apenas o essencial para a tarefa
   - Redução significativa de tokens

## 📊 Estimativas de Consumo (Aproximadas)

### Architecture Hygiene Driver
- **Modo completo:** ~15.000 - 30.000 tokens
- **Modo leve:** ~5.000 - 10.000 tokens
- **Redução:** ~60-70%

### Commit & Push Driver
- **Modo completo:** ~3.000 - 8.000 tokens
- **Modo leve:** ~1.000 - 3.000 tokens
- **Redução:** ~60-70%

### Auto Deploy Driver
- **Modo completo:** ~20.000 - 40.000 tokens (executa 2 drivers)
- **Modo leve:** ~8.000 - 15.000 tokens
- **Redução:** ~60-70%

### Theme Creation Driver
- **Modo completo:** ~10.000 - 20.000 tokens
- **Modo leve:** ~4.000 - 8.000 tokens
- **Redução:** ~60-70%

**Nota:** Estimativas baseadas em projetos médios. Valores podem variar significativamente.

## 🔄 Fluxo Obrigatório ANTES de Executar Driver

### ETAPA 1: Informação e Pergunta

O agente DEVE iniciar com:

```
⚠️ AVISO DE CONSUMO DE TOKENS

Este driver pode consumir aproximadamente [X] tokens durante a execução.

Antes de continuar, preciso saber:
1. Você está usando plano pago ou free?
2. Você tem preocupações com consumo de tokens?
3. Deseja executar em modo LEVE (menos tokens, apenas essencial)?
```

### ETAPA 2: Decisão do Usuário

**Se usuário escolher MODO LEVE:**
- O agente DEVE executar apenas o essencial
- Evitar leituras desnecessárias de arquivos
- Focar apenas no que é crítico para a tarefa
- Pular análises extensas quando possível
- Usar resumos ao invés de leituras completas

**Se usuário escolher MODO COMPLETO:**
- O agente DEVE prosseguir normalmente
- Mas continuar informando sobre consumo
- Oferecer pausar se consumo estiver alto

### ETAPA 3: Monitoramento Durante Execução

Durante a execução, o agente DEVE:
- Informar quando fizer leituras grandes de arquivos
- Oferecer pausar se necessário
- Estimar tokens restantes quando possível

## 🎛️ Modo Leve: O Que Fazer Diferente

### Architecture Hygiene Driver (Modo Leve)
- ✅ Analisar estrutura básica (list_dir apenas)
- ✅ Identificar problemas óbvios
- ✅ Fazer perguntas antes de mover arquivos
- ❌ Evitar leituras completas de arquivos grandes
- ❌ Pular análises detalhadas de código
- ❌ Usar grep/estrutura ao invés de read_file completo

### Commit & Push Driver (Modo Leve)
- ✅ Fazer as 9 perguntas obrigatórias
- ✅ Verificar git status
- ✅ Validar agent-os/
- ❌ Pular validações extensas (build, lint) se usuário confirmar
- ❌ Evitar leituras completas de arquivos grandes
- ❌ Focar apenas no essencial para commit

### Auto Deploy Driver (Modo Leve)
- ✅ Executar drivers na sequência
- ✅ Fazer perguntas obrigatórias
- ✅ Validar etapas
- ❌ Reduzir análises detalhadas
- ❌ Usar modo leve dos drivers internos
- ❌ Pular relatórios muito extensos

## 🚨 Sinais de Alerta

O agente DEVE alertar o usuário se:

1. **Consumo estimado > 20.000 tokens** (modo completo)
2. **Consumo estimado > 10.000 tokens** (modo leve)
3. **Múltiplos arquivos grandes serão lidos** (> 5 arquivos > 1000 linhas)
4. **Análise muito profunda será necessária**

Nesses casos, o agente DEVE:
- Alertar explicitamente
- Oferecer modo leve novamente
- Sugerir dividir a tarefa em partes menores
- Perguntar se usuário quer continuar

## 📋 Checklist Obrigatório

Antes de executar QUALQUER driver, o agente DEVE:

- [ ] Ler este arquivo (TOKEN_MANAGEMENT.md)
- [ ] Informar sobre consumo estimado de tokens
- [ ] Perguntar sobre plano (pago/free)
- [ ] Oferecer modo leve
- [ ] Aguardar confirmação do usuário
- [ ] Monitorar consumo durante execução
- [ ] Alertar se consumo estiver alto

## 💡 Dicas para Reduzir Consumo

### Para o Agente:
1. **Use grep ao invés de read_file completo** quando possível
2. **Leia apenas seções relevantes** (offset/limit)
3. **Use list_dir** para estrutura ao invés de ler tudo
4. **Faça perguntas** ao invés de analisar tudo
5. **Use codebase_search** com queries específicas
6. **Evite leituras redundantes** (cache mental)

### Para o Usuário:
1. **Use modo leve** se tiver plano free
2. **Divida tarefas grandes** em partes menores
3. **Execute drivers separadamente** ao invés de Auto Deploy completo
4. **Monitore seu consumo** no dashboard da plataforma

## 🎯 Exemplo de Início de Driver

```
⚠️ AVISO DE CONSUMO DE TOKENS

Este [NOME DO DRIVER] pode consumir aproximadamente [X] tokens.

Antes de continuar:
1. Você está usando plano pago ou free?
2. Deseja executar em modo LEVE? (reduz ~60-70% do consumo)

Modo Leve:
- Executa apenas o essencial
- Evita análises extensas
- Foca no que é crítico
- Reduz consumo significativamente

Aguardando sua escolha antes de prosseguir...
```

## ⚠️ Importância Crítica

**Por que isso é importante:**
- ✅ Colaboradores com plano free não perdem tokens desnecessariamente
- ✅ Colaboradores com plano pago não têm surpresas de custo
- ✅ Processo fica mais transparente e confiável
- ✅ Usuário tem controle sobre o consumo
- ✅ Evita frustrações e problemas financeiros

**O agente NUNCA deve:**
- ❌ Executar driver sem informar sobre tokens
- ❌ Assumir que usuário tem tokens ilimitados
- ❌ Ignorar preocupações do usuário sobre consumo
- ❌ Executar modo completo sem oferecer modo leve
- ❌ Continuar se usuário pedir para parar por consumo

## 📝 Histórico de Atualizações

**Versão 1.0 (20/11/2025):**
- Versão inicial do documento de gerenciamento de tokens
- Definição de regras obrigatórias para todos os drivers
- Estimativas de consumo e modo leve
- Checklist e exemplos práticos

