# RF24 — Mapeamento completo de todas as IAs do sistema

**Projeto:** FashionAI (SAI-TCC-2026)
**Requisito:** RF24 — Usar a IA do sistema (motor transversal, citado por RF4, RF5, RF6, RF9, RF11, RF13, RF14, RF20, RF21, RF26 — nunca tinha diagrama próprio até esta rodada)
**Complementa:** `RF24-atividades.puml` (dispatch + padrão de falha), `RF24-sequencia.puml` (chamada canônica), `fashionai-componentes-v3.puml` (package "IA — motor transversal")

---

## 1. Por que este documento existe

Antes desta rodada, toda menção a IA no pacote usava a raia genérica `|Serviço de IA|` nos diagramas de atividades, um participante nomeado `"AI Engine (RF24)"` só em 3 diagramas de sequência (RF20, RF21, RF26), e dois nomes de classe concretos (`AIArtworkService`, `ContextAnalysisService`) citados só em `.md` de apoio (RF6, RF11) — nunca no diagrama de componentes. Este documento resolve a inconsistência de nomenclatura, cataloga input/output de cada sub-motor, marca quem trata falha/timeout, e lista os gaps reais identificados.

## 2. Catálogo de sub-motores

| # | Sub-motor (nome oficial) | RF de origem | Input | Output | Nome antigo/disperso | Trata falha? |
|---|---|---|---|---|---|---|
| 1 | **Piece Analyzer** | RF4 (Etapa 4, e reacionado por botão na Etapa 5) | Foto da peça | Categoria, subcategoria, tipo, cores, materiais, marca, índices de confiança | `Serviço de IA` | **Sim** — único com timeout já modelado antes desta rodada; agora é o padrão de todos (RF24-sequencia.puml) |
| 2 | **Content Moderator** *(novo, esta rodada)* | RF4 (novo passo, antes do Piece Analyzer) | Foto enviada (criação e reedição) | `moderationStatus` (PENDING/APPROVED/REJECTED_POLICY/REJECTED_NOT_CLOTHING) + confiança + motivos | — (não existia) | **Sim, com regra própria** — nunca aprova por omissão (diferente dos demais, que degradam para modo manual) |

> O desenho acima é a simplificação de estágio único hoje implementada. `RF24_PIPELINE_MODERACAO_CONTEUDO.md`
> define o funil completo, padrão de rede social (hash matching, classificador multi-categoria, roteamento por
> confiança, fila humana, apelação, enforcement gradado) — estratégico, ainda não aplicado aos diagramas de
> implementação (ver a Seção 6 daquele documento para o que muda).
| 3 | **Scheme Composer** | RF5 (Etapa 2, modo IA) | occasion/style/orientações livres (texto) + guarda-roupa disponível | Composição sugerida (peça por slot) | `Serviço de IA` | Não (antes desta rodada) → agora padronizado |
| 4 | **DNA Synthesizer** | RF13 (Etapa 3, modo IA) + classificação de `archetype` | Esquemas salvos, disponibilidade, marcas/cores/selos, narrativa escolhida | Composição de esquemas por célula do DNA; `archetype` (1 dos 5 de Kibbe); `colorPalette` sintetizada | `Serviço de IA` | Não → agora padronizado |
| 5 | **Background Generator** | RF11 (modo Prompt / Direção recomendada / geração final) | Prompt confirmado, ou histórico/tendências/popularidade; preset AURA + material opcional | Arte de fundo (imagem) aplicada ao elemento-alvo | `Serviço de IA` / `AIArtworkService.generateArtwork()` (só no `.md`) | Não → agora padronizado |
| 6 | **SealBond Matcher** | RF20/RF21 (Etapa 5 — Analisar & Resgatar Selo, reaproveitada por RF5/RF13) | Peças do esquema (`brandId`), ou archetype/colorPalette (celebridade, `STYLE_SIGNATURE`) | Até 3 propostas de vínculo (alvo, tier PECA/LOOK, confiança, justificativa, `basis`) | `Serviço de IA` (atividades) / `AI Engine (RF24)` (sequência) | Não (só regra de negócio "confiança insuficiente") → agora tem `alt` de timeout retrofitado |
| 7 | **Style Advisor** | RF6 (painel Look do Dia) | Breakdown de métricas (L/C/S/R) já normalizado | Dica de estilo acionável (texto) | `Serviço de IA` (puml) / `AIArtworkService`+`ContextAnalysisService` (`.md`) | Não → agora padronizado |
| 8 | **Insight Generator** | RF26 (sub-aba Insights globais) | Rankings agregados (marcas mais usadas, hypeScore médio por estação/cor/marca) | Texto curto de insight | `IA (motor transversal RF24)` / `AI Engine (RF24)` (sequência) | Não → agora tem `alt` de timeout retrofitado |
| 9 | **Brand Resolver** *(novo — pedido do usuário 2026-09-21)* | RF4 (campo `brandId` sem match), RF5/RF13 (texto livre — Etapa 2 "orientações livres", `identityPhrase`) | Texto digitado pelo usuário (nome candidato a marca) | `Brand` novo (`source=AUTO_DETECTED`) quando validado; ou nenhum efeito quando reprovado | — (não existia) | **Sim, com regra própria** — nunca cria `Brand` por omissão (mesmo princípio do Content Moderator); ver `RF24_BRAND_RESOLVER.md` |

**Todos os 8 sub-motores** agora seguem o mesmo padrão de invocação e tratamento de falha (`RF24-sequencia.puml`), e estão representados como componentes nomeados em `fashionai-componentes-v3.puml` (package "IA — motor transversal (RF24)").

## 3. Gaps identificados (não implementados nesta rodada — fora de escopo)

- **Provador 2D / Try-on virtual (citado como "RF18")** — aparece **uma única vez** em todo o pacote, dentro da tabela de origem de campos da taxonomia (`ClothesScheme.renderingStatus`/`virtualTryOnUrl`/`renderingQuality`/`renderingMetadata`, §03), classificado como "IA automática por análise (Provador 2D, RF18)". **RF18 não existe** como pasta, diagrama de atividades, sequência ou componente em lugar nenhum do projeto — é a IA mais "fantasma" do pacote. Desenhar o RF18 inteiro (fluxo de renderização de provador virtual) é um RF novo de porte comparável a RF11, não pedido nesta rodada — fica registrado aqui como pendência explícita para uma futura rodada, não implementado agora.
- **Nomenclatura de classe concreta (`AIArtworkService`, `ContextAnalysisService`)** — os `.md` de RF6 e RF11 tratam essas classes como "já existentes na arquitetura do RF11", mas elas nunca apareceram em `fashionai-componentes-v3.puml`. Esta rodada resolve a inconsistência **pelo nome do componente** (Background Generator, Style Advisor), não recriando as classes de serviço citadas nos `.md` — os nomes `AIArtworkService`/`ContextAnalysisService` podem ser tratados como apelidos de implementação dos componentes `BgAI`/`StyleAdvisorAI`, não uma camada extra.

## 4. Correção de mislabeling (Fase I)

Na rodada anterior (Fase I, item 3 — hypeScore universal), as tabelas de origem de campo (taxonomia §02/§03) rotularam `hypeScore`/`hypeScoreGlobal`/`hypeGroupId` como **"IA automática por análise"**. Isso está incorreto: a fórmula (`markdowns/RF6_HYPE_SCORE_CALCULO.md`) é um cálculo estatístico determinístico — percentis, pesos fixos (0,65/0,35), sem nenhum modelo preditivo ou generativo envolvido. Corrigido nesta rodada para **"Sistema-derivado (cálculo estatístico — não é IA/ML)"**. O agrupamento por semelhança do `HypeGroup` (Seção 8.3 do doc de cálculo, similaridade de Jaccard/igualdade) também é determinístico, não um sub-motor de IA — não entra no catálogo da Seção 2 acima.
