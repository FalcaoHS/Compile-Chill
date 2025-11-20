# Melhorias Futuras - Sistema de Elementos Festivos

> **Nota:** O sistema básico já foi implementado! Veja `IMPLEMENTATION_STATUS.md` neste mesmo diretório para detalhes do que está funcionando.

---

## 🔸 1. Criar uma flag "Atualização cultural manual"

**Status:** ❌ Não implementado  
**Prioridade:** Baixa

Se um usuário quiser ver todas as festividades mesmo não sendo do país dele.

**Implementação sugerida:**
- Adicionar toggle no perfil do usuário
- Salvar preferência no banco de dados
- Modificar `isFestivityRelevant()` para considerar essa flag

---

## 🔸 2. Adicionar níveis de intensidade

**Status:** ❌ Não implementado  
**Prioridade:** Média

Algumas pessoas não gostam de muitos elementos visuais na foto.
Então:

- **Modo discreto:** Elementos menores, mais sutis, opacidade reduzida
- **Modo padrão:** (atual) Tamanho e opacidade normais
- **Modo festão (alto):** Elementos maiores, mais chamativos, animações extras

**Implementação sugerida:**
- Adicionar estado `festiveIntensity: 'subtle' | 'normal' | 'high'`
- Modificar `drawFestiveElement()` para ajustar tamanho/opacidade baseado na intensidade
- Adicionar seletor no perfil ou nas configurações

---

## 🔸 3. Fade-in suave

**Status:** ❌ Não implementado  
**Prioridade:** Baixa

Esses elementos aparecendo devagar evitam "assustar" ou chamar atenção demais.

**Implementação sugerida:**
- Adicionar animação CSS `@keyframes fade-in-festive`
- Aplicar `opacity: 0 → 1` com `transition` de 500-800ms
- Usar `requestAnimationFrame` para animação suave no canvas