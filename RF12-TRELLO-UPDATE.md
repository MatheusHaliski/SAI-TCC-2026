# RF12 — Atualização Trello com Cronologia de Estilo

## 6 Novos Critérios de Aceite

### RF12.CA07 — Agrupamento por Período

**Dado que** usuário acessa "Minhas Fotos" em modo Timeline  
**Quando** o sistema carrega o acervo de fotografias  
**Então** as fotos são agrupadas por período configurável (semana ou mês), cada agrupamento exibe 2-4 fotos representativas, contador "X fotos neste período" e contexto de ocasião, estilo e engajamento

---

### RF12.CA08 — Identificação de Momentos-Chave

**Dado que** o acervo contém fotos com diferentes níveis de engajamento social  
**Quando** o sistema processa a timeline  
**Então** identifica automaticamente e marca com destaque visual:
- Fotos com ≥200 curtidas (integração RF19)
- Peças usadas em ≥10 esquemas diferentes
- Cards de DNA de Estilo
- Padrões quebradores (primeiro uso de uma cor/estilo novo)

---

### RF12.CA09 — Contexto Enriquecido

**Dado que** usuário visualiza uma foto na timeline  
**Quando** o card é renderizado  
**Então** exibe:
- **Origem:** peça, esquema, DNA de Estilo, ou provador virtual
- **Ocasião:** formal, casual, esporte, social, etc.
- **Estilo:** minimalista, maximista, eclético, etc.
- **Material:** os materiais das peças constituintes
- **Engajamento social:** número de curtidas, comentários, compartilhamentos
- **Contexto:** "por quê foi criada" (extraído automaticamente dos dados de RF5)

---

### RF12.CA10 — Filtros Temporais Dinâmicos

**Dado que** usuário está em "Minhas Fotos"  
**Quando** aciona um filtro de período no header  
**Então** sistema recalcula o agrupamento dinamicamente com as opções:
- Últimas 4 semanas
- Este mês
- Últimos 3 meses
- Este ano
- Tudo

**E** a timeline se reorganiza sem recarregar a página

---

### RF12.CA11 — Insights de Padrão Gerados por IA

**Dado que** usuário acaba de abrir "Minhas Fotos"  
**Quando** a IA analisa o acervo e detecta padrões  
**Então** um card flutuante no topo exibe descoberta pessoal, como:
- "Você subiu 40% o uso de roxo nos últimos 2 meses"
- "Sua peça mais usada: Bolsa Violeta (12 esquemas)"
- "Estilo emergente: Maximalismo (detectado nos últimos 30 dias)"
- "Ocasião preferida: Casual (68% dos looks)"

**E** cada insight é clicável para filtrar a timeline por aquele padrão

---

### RF12.CA12 — Comparação de Períodos (Evolução Estilística)

**Dado que** usuário quer comparar sua evolução de estilo  
**Quando** aciona o modo "Comparação" ou seleciona dois períodos  
**Então** sistema exibe lado-a-lado:
- **Paleta de cores:** cores dominantes de cada período com proporção
- **Tipos de peça:** proporção de categorias (tops, bottoms, acessórios, etc.)
- **Ocasiões principais:** distribuição por contexto de uso
- **Estilo prevalente:** arquétipos de estilo predominantes

**E** gera um resumo visual: "Você migrou de casual para formal" ou "Aumentou diversidade cromática"

---

## Instruções de Atualização no Trello

1. **Abra o card RF12** na lista "Requisitos Funcionais" do board "TCC 2026 (Fashion AI)"

2. **Na descrição do card RF12**, atualize o enunciado para:
   ```
   Visualizar e editar a página "Minhas Fotos" (acervo de fotografias 
   originadas de peças e esquemas) com Timeline de Evolução Estilística
   ```

3. **No card HU-RF12** (lista "Product Backlog"), na checklist "Critérios de Aceite":
   - Mantenha os 6 CAs originais (CA01–CA06)
   - Adicione os 6 NOVOS CAs com o texto acima

4. **Crie tags** no card HU-RF12:
   - `[NOVO]` para os 6 novos CAs
   - `[IA-Detecta-Padrões]` para CA11
   - `[Timeline-Visual]` para CA07, CA08, CA09
   - `[Filtros-Dinâmicos]` para CA10

5. **Atualize Sprint**: confirme que RF12 permanece na Sprint onde estava alocado

6. **Adicione link de rastreabilidade** na descrição:
   ```
   Artefatos relacionados:
   - rf12-atividade-cronologia.puml (diagrama de atividades)
   - rf12-diagrama-visual.html (visualização interativa)
   - PR #558: Cronologia de Estilo
   ```

---

## Resumo de Mudanças

| Aspecto | Antes | Depois |
|---|---|---|
| **CAs** | 6 | 12 (6 novos) |
| **Modo de visualização** | Grade apenas | Timeline + Grade |
| **Padrões detectados** | Nenhum | IA detecta cores, ocasiões, peças-chave |
| **Engajamento social** | Invisível | Visível em contexto |
| **Comparação temporal** | Não | Sim (lado-a-lado) |
| **Filtros** | Origem/Data | Origem/Data/Ocasião/Estilo/Cor + Períodos |

---

## Arquivos de Suporte

- `rf12-atividade-cronologia.puml` — Diagrama PlantUML (sem emojis)
- `rf12-diagrama-visual.html` — Visualização interativa do fluxo completo
- **Artefatos Claude:**
  - Prototipagem "Minhas Fotos" com Timeline interativa
  - Conceito "Cronologia de Estilo"
  - Diagrama visual do fluxo RF12
