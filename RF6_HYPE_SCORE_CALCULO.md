# RF6 — Aba "Look do Dia": Cálculo do Hype Score e Indicadores Sociais

**Projeto:** FashionAI (SAI-TCC-2026)
**Requisito Funcional:** RF6 — Perfil Lookbook (aba "Look do Dia")
**Depende de:** RF19 — Interações sociais (curtir, comentar, compartilhar, remixar)
**Complementa:** `RF6_Perfil_Lookbook_Atividades.puml`

---

## 1. Contexto

O "Look do Dia" é sempre um **Esquema de Vestimenta** marcado com `isOutfitOfTheDay = true` — nunca uma Peça avulsa nem um registro de DNA de Estilo, os quais não participam desta aba. O painel da aba exibe o esquema em versão compacta mais um conjunto de indicadores sociais, com destaque para o **Hype Score**: um percentual (0–100%) que responde "o quão estiloso este look está sendo percebido, agora, pela comunidade e frente às tendências globais da plataforma".

Dois problemas de design que a fórmula abaixo resolve deliberadamente:

1. **Contagens brutas (curtidas, shares...) não são comparáveis entre si nem limitadas a 0–100%** — um usuário com 3 seguidores e outro com 30 mil nunca teriam scores no mesmo intervalo se somássemos direto.
2. **"Estiloso" não é só "engajado"** — um look pode ter poucas curtidas mas estar vestindo exatamente o que está bombando na plataforma agora (ou o contrário: ser hiperengajado sem repetir nada que já é tendência, o que o RF6 chama de efeito *trendsetter*, seção 5).

A fórmula por isso combina dois eixos independentes, cada um normalizado por **percentil** (não por um teto fixo), o que evita "número mágico" que fica desatualizado conforme a base de usuários cresce.

---

## 2. Eixo 1 — Engajamento Normalizado (E_norm)

### 2.1 Soma ponderada bruta

$$E_{raw} = 1\!\cdot\!L + 3\!\cdot\!C + 5\!\cdot\!S + 8\!\cdot\!R + 4\!\cdot\!V$$

| Símbolo | Métrica (RF19) | Peso | Por quê |
|---|---|---|---|
| `L` | Curtidas — esquema **+** soma das curtidas de todas as peças do esquema | 1 | ação de menor esforço; sinal de base |
| `C` | Comentários — esquema + peças | 3 | exige digitar algo; engajamento qualificado |
| `S` | Compartilhamentos (feed interno + rede externa, RF19.CA08/CA09) | 5 | redistribui o conteúdo; sinal de alcance |
| `R` | Remixes — quantas vezes o esquema/peças foram usados como base por outro usuário | 8 | maior peso: alguém *copiou/adaptou* o look — validação de estilo mais forte que existe |
| `V` | Retornos ("Retornar") — reconhecimento/reuso do look por terceiros | 4 | entre comentário e share em força de sinal |

Estes pesos seguem a mesma lógica usada em fórmulas de taxa de engajamento de redes sociais reais: ações que custam mais esforço ao usuário (comentar, compartilhar, remixar) valem mais que uma curtida passiva.

### 2.2 Normalização por percentil

$$E_{norm} = 100 \times \frac{\text{posição de } E_{raw} \text{ em ordem crescente entre os esquemas ativos de referência}}{N}$$

**População de referência:** todos os esquemas públicos com pelo menos 1 interação nos últimos 90 dias (janela móvel, recalculada periodicamente — ver seção 6). Isso mantém `E_norm` sempre em [0, 100] e auto-calibrado: a régua acompanha o crescimento da base de usuários, sem precisar de um "teto" hardcoded que se torna obsoleto.

---

## 3. Eixo 2 — Alinhamento de Tendência (T_norm)

Mede se o usuário está vestindo o que **globalmente** está em uso agora — marca, cor, categoria de peça e estilo/ocasião do esquema.

### 3.1 Fração de uso global por atributo

Para cada atributo `a` (marca, cor, categoria, estilo, ocasião) e cada valor `v` que esse esquema usa:

$$u(a, v) = \frac{\text{nº de usuários ativos com pelo menos um esquema/peça usando } v \text{ no atributo } a}{\text{nº total de usuários ativos}}$$

### 3.2 Combinação ponderada

$$Trend_{raw} = \frac{\sum_i w_i \cdot u(a_i, v_i)}{\sum_i w_i}$$

| Atributo | Peso `w` | Origem do dado |
|---|---|---|
| Estilo (`style`) | 1.5 | `EsquemaVestimenta.style` (HU05) |
| Marca | 1.0 | marca de cada `WardrobeItem` do esquema |
| Cor | 1.0 | cor dominante de cada peça |
| Ocasião (`occasion`) | 1.0 | `EsquemaVestimenta.occasion` |
| Categoria/tipo de peça | 0.5 | `pieceType` de cada peça — pesa menos porque categoria (ex. "camisa") é pouco discriminante de tendência |

### 3.3 Normalização por percentil

$$T_{norm} = 100 \times \frac{\text{posição de } Trend_{raw} \text{ entre os esquemas ativos de referência}}{N}$$

Mesma população de referência do Eixo 1.

---

## 4. Hype Score final

$$\boxed{HypeScore = 0{,}65 \times E_{norm} + 0{,}35 \times T_{norm}} \quad \in [0, 100]\%$$

**Por que 65/35 e não 50/50:** o Hype Score responde primeiro "a comunidade reagiu a ESTE look" (prova social direta) — isso é o E_norm. O alinhamento de tendência entra como reforço secundário, porque moda não é só conformidade: um look pouco alinhado a tendências pode e deve continuar pontuando alto se tiver engajamento real (ver Selo Trendsetter, seção 5). Por isso `α > β`, mas nenhum dos dois eixos tem peso zero.

---

## 5. Faixas de classificação

Como os dois eixos já são normalizados por percentil, o `HypeScore` tende a se distribuir de forma aproximadamente uniforme entre os usuários — por isso faixas de largura próxima já mapeiam, na prática, para fatias parecidas da base de usuários, sem que 95% dos looks caiam todos na faixa mais baixa (o problema comum de scores baseados em contagem bruta). Sete faixas, no mesmo espírito das 7 faixas já usadas pelo sistema de Aura de engajamento (`app/lib/aura-system.ts`, `RAW → LEGENDARY`):

| Faixa | Hype Score | Rótulo |
|---|---|---|
| 1 | 0 – 14% | **Despretensioso** |
| 2 | 15 – 29% | **Em Construção** |
| 3 | 30 – 49% | **Notado** |
| 4 | 50 – 69% | **Com Estilo** |
| 5 | 70 – 84% | **Muito Estiloso** |
| 6 | 85 – 95% | **Arrasando no Look** |
| 7 | 96 – 100% | **Ícone de Estilo** |

(Os nomes das pontas — "impopular"/"arrasando no look" — foram suavizados para tom de produto; troque livremente, a régua numérica é o que importa.)

---

## 6. Outros indicadores do painel

Todos derivam dos mesmos dados já calculados acima — nenhum precisa de fonte nova.

- **Total de curtidas** = `L` (soma das curtidas do esquema + de todas as peças) — exibido como número absoluto ao lado do Hype Score.
- **Breakdown por métrica** — mini-barras de `L`, `C`, `S`, `R`, `V`, cada uma normalizada por percentil individualmente (mesmo método da seção 2.2, aplicado a cada métrica isolada). Mostra ao usuário *qual* alavanca puxar.
- **Selo "Trendsetter"** — concedido quando `E_norm ≥ 70` **e** `T_norm ≤ 30`: o usuário está sendo muito bem recebido usando algo que ainda **não** é tendência — ele está criando uma, não seguindo.
- **Selo "Style Match"** — concedido quando `T_norm ≥ 70`: o usuário está fortemente alinhado com o que está bombando agora na plataforma.
- **Ranking textual** — "Top `100 − HypeScore`% dos looks desta semana", lido direto do percentil já calculado (sem cálculo extra).
- **Comparação com o Look do Dia anterior** — `Δ = HypeScore atual − HypeScore do look do dia anterior do mesmo usuário`, exibido como seta ↑ / ↓ / = , incentivando a repetição da marcação diária.
- **Sugestão da IA** — o sistema identifica a métrica do breakdown com pior percentil e a `AIArtworkService`/`ContextAnalysisService` (já existentes na arquitetura do RF11) geram uma dica acionável, ex.: *"Seus remixes estão baixos — looks com peças de marca X costumam ser mais remixados nesta faixa de estilo."*

---

## 7. Nota de implementação (cadência de cálculo)

Os contadores brutos (`L`, `C`, `S`, `R`, `V`) atualizam em tempo real a cada interação (RF19). Já o **percentil de referência** (posição entre os N esquemas ativos) não precisa — e não deve — ser recalculado a cada interação: um job periódico (ex.: a cada poucas horas, via o mesmo `ContextAnalysisService` que já roda as análises de contexto do RF11) recalcula a distribuição de `E_raw`/`Trend_raw` entre os esquemas de referência e atualiza os limites de percentil usados por `E_norm`/`T_norm`. O Hype Score exibido é sempre recalculado on-demand (contadores atuais × última distribuição de referência), sem exigir reprocessar toda a base a cada abertura da aba.
