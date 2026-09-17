# RF12 — Critérios de Aceite Completos

**Para copiar/colar no Trello (card HU-RF12, checklist "Critérios de Aceite")**

---

## ✅ CAs Originais (1-6)

### RF12.CA01
Usuário autenticado acessa "Minhas Fotos" → vê todas as fotografias enviadas, agrupadas por origem (peça, esquema, provador, DNA) e ordenadas por data

### RF12.CA02
Usuário seleciona uma foto e aciona editar → abre o Editor Canvas 2D (RF15) com a foto carregada

### RF12.CA03
Usuário exclui uma foto vinculada a uma peça ativa e confirma → sistema avisa que a peça ficará sem imagem e exige confirmação explícita

### RF12.CA04
Usuário seleciona várias fotos e aciona exclusão em lote → sistema pede uma única confirmação informando a quantidade

### RF12.CA05
Usuário faz download de uma foto e aciona baixar → a imagem original é entregue sem marca d'água, apenas ao próprio dono

### RF12.CA06
Acervo com mais de 50 fotos carrega → as imagens carregam sob demanda (lazy) e a tela responde em até 3s

---

## ✨ Novos CAs (7-12) — Cronologia de Estilo

### RF12.CA07
Usuário acessa "Minhas Fotos" em modo Timeline → sistema agrupa fotos por período configurável (semana ou mês); cada agrupamento exibe 2-4 fotos representativas, contador "X fotos neste período" e contexto de ocasião, estilo e engajamento

### RF12.CA08
Sistema processa a timeline com fotos de diferentes engajamentos → identifica automaticamente e marca com destaque visual:
- Fotos com ≥200 curtidas (integração RF19)
- Peças usadas em ≥10 esquemas diferentes
- Cards de DNA de Estilo
- Padrões quebradores (primeiro uso de uma cor/estilo novo)

### RF12.CA09
Usuário visualiza uma foto na timeline → card renderizado exibe:
- Origem: peça, esquema, DNA de Estilo, ou provador virtual
- Ocasião: formal, casual, esporte, social, etc.
- Estilo: minimalista, maximista, eclético, etc.
- Material: dos componentes das peças
- Engajamento social: curtidas, comentários, compartilhamentos
- Contexto: "por quê foi criada" (extraído dos dados de RF5)

### RF12.CA10
Usuário está em "Minhas Fotos" e aciona um filtro de período no header → sistema recalcula o agrupamento dinamicamente com as opções (Últimas 4 semanas / Este mês / 3 meses / Este ano / Tudo); timeline reorganiza sem recarregar a página

### RF12.CA11
Usuário abre "Minhas Fotos" → IA analisa o acervo e um card flutuante no topo exibe descoberta pessoal, como:
- "Você subiu 40% o uso de roxo nos últimos 2 meses"
- "Sua peça mais usada: Bolsa Violeta (12 esquemas)"
- "Estilo emergente: Maximalismo (detectado nos últimos 30 dias)"
- "Ocasião preferida: Casual (68% dos looks)"

E cada insight é clicável para filtrar a timeline por aquele padrão

### RF12.CA12
Usuário quer comparar sua evolução de estilo e aciona modo "Comparação" ou seleciona dois períodos → sistema exibe lado-a-lado:
- Paleta de cores: cores dominantes de cada período com proporção
- Tipos de peça: proporção de categorias (tops, bottoms, acessórios, etc.)
- Ocasiões principais: distribuição por contexto de uso
- Estilo prevalente: arquétipos de estilo predominantes

E gera um resumo visual: "Você migrou de casual para formal" ou "Aumentou diversidade cromática"

---

## 📋 Instruções para Atualizar o Trello

1. **Abra o card HU-RF12** no board "TCC 2026 (Fashion AI)" → lista "Product Backlog"

2. **Localize a checklist "Critérios de Aceite"**

3. **Mantenha os 6 CAs originais** (CA01–CA06) — apenas atualize se houver erros

4. **Adicione os 6 NOVOS CAs** (CA07–CA12) — copie e cole os textos acima

5. **Adicione tags aos NOVOS CAs:**
   - `[NOVO]` — marca todos os 6 novos
   - `[IA]` — para CA11 (Insights por IA)
   - `[Timeline]` — para CA07, CA08, CA09
   - `[Filtros]` — para CA10
   - `[Comparação]` — para CA12

6. **Atualize a descrição do card HU-RF12:**
   ```
   Visualizar e editar a página "Minhas Fotos" (acervo de fotografias originadas 
   de peças e esquemas) com Timeline de Evolução Estilística
   ```

7. **Adicione um link na descrição:**
   ```
   Artefatos relacionados:
   - rf12-atividade-cronologia.puml (diagrama de atividades)
   - rf12-diagrama-visual.html (visualização interativa)
   - PR #558: Cronologia de Estilo
   ```

---

## 📊 Resumo de Mudanças

| Métrica | Antes | Depois |
|---|---|---|
| **Total de CAs** | 6 | 12 |
| **Modos de visualização** | Grade apenas | Timeline + Grade |
| **Padrões detectados** | Nenhum | IA detecta automaticamente |
| **Contexto de foto** | Mínimo | Enriquecido |
| **Filtros disponíveis** | Origem/Data | Origem/Data/Ocasião/Estilo/Cor + Períodos |
| **Comparação temporal** | Não disponível | Lado-a-lado com análise |
| **Engajamento social visível** | Não | Sim, em contexto |

---

## 🎯 Próximas Etapas

- [ ] Atualizar CAs no Trello
- [ ] Validar no card RF12 que as dependências/sprints estão corretas
- [ ] Revisar com o time a viabilidade dos novos CAs (CA07–CA12)
- [ ] Estimar pontuação (story points)
