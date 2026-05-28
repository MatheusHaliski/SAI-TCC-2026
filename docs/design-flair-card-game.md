# FLAIR — Fashion League of Adaptive Intelligent Rewards

## Visão Geral

**FLAIR** é um sistema de jogo de cartas colecionáveis integrado ao SAI que transforma cada peça do guarda-roupa do usuário em uma carta jogável com atributos únicos derivados dos dados reais do `saiWardrobeItem`. Os jogadores montam decks de outfits, participam de desafios, duelos e quests para ganhar **recompensas reais** em lojas parceiras.

---

## Como as Cartas São Geradas

Cada `saiWardrobeItem` gera automaticamente uma **FlairCard** com 6 atributos calculados a partir dos campos reais da peça:

### Os 6 Atributos de Carta

| Atributo | Campo Fonte | Cálculo |
|----------|-------------|---------|
| **⚡ EDGE** | `style_tags` | Soma de bônus por wearstyle archetype (ex: "statement piece" +22, "street energy" +16) |
| **🎯 RANGE** | `occasion_tags` | Quantidade de ocasiões × 20 (máx 100) |
| **👑 CLOUT** | `brand_detection_confidence` + `brand_id` | `confidence × 80 + 20` |
| **✨ GLOW** | `catalog_readiness_score` + `front_view_score` | `(readiness × 0.6 + frontView × 0.4) × 100` |
| **🎨 ART** | `BackgroundConfig` | Sólido +0, Gradiente +35, AI Artwork +65, Material Layer +10-15 |
| **🌿 SYNC** | `season` vs estação atual | 100 se em sincronia, 0 se não |

### Raridade (PieceCategory → FlairCard tier)

A raridade existente (`Standard`, `Premium`, `Limited Edition`, `Rare`) aplica multiplicadores ao poder total da carta:

- **Standard** ×1.0 — base branca
- **Premium** ×1.15 — dourado, +habilidade de escudo
- **Limited Edition** ×1.30 — roxo, +habilidade especial por wearstyle
- **Rare** ×1.50 — vermelho holográfico, +habilidade única poderosa

### Habilidades Especiais (por raridade)

Cartas **Rare** ganham uma das seguintes habilidades baseadas em seus stats:
- `EDGE ≥ 80` → **TRENDSETTER** — dobra EDGE em duelos
- `GLOW ≥ 80` → **SPOTLIGHT** — +30 GLOW para todo o deck
- Padrão → **ICON** — +20% poder total do deck como âncora

Cartas **Limited Edition**:
- Wearstyle "statement piece" → **STATEMENT LOCK** — bloqueia a carta mais forte do oponente
- Wearstyle "street energy" → **HYPE BOOST** — +15 EDGE para cartas street-energy adjacentes

---

## O Deck (OutfitCard como Deck de Jogo)

Cada `saiScheme` (outfit) se torna um **FlairDeck** com poder total calculado a partir de:

```
Deck Power = (média de totalPower das cartas + Combo Bonus + Season Bonus) × Brand Multiplier
```

### Combos Possíveis

| Combo | Condição | Bônus |
|-------|----------|-------|
| **Style Synergy** | 2+ cartas com mesmo style_tag | +8 pts por carta compartilhando o tag |
| **Occasion Synergy** | Todas as cartas compartilham ao menos 1 occasion_tag | +12 pts por ocasião compartilhada |
| **Season Sweep** | 3+ cartas da mesma estação | +25 pts fixos |
| **Material Contrast** | 3+ materiais diferentes no deck | +6 pts por material único |

### Brand Synergy (multiplicador)

| Cartas da mesma marca | Multiplicador |
|-----------------------|---------------|
| 2 cartas             | ×1.10         |
| 3 cartas             | ×1.20         |
| 4+ cartas            | ×1.35         |

---

## Sistema de Quests

### Quests Diárias (reset a cada 24h)

| Quest | Condição | Recompensa |
|-------|----------|------------|
| Seasonal Look | 3+ peças da estação atual em um outfit | 50 🪙 |
| Brand Collector | 3+ peças da mesma marca em um outfit | 30 🪙 |
| Versatile Master | Outfit com RANGE médio > 70 | 40 🪙 |
| Glow Up | Outfit com GLOW médio > 65 | 45 🪙 |

### Quests Semanais (reset a cada 7 dias)

| Quest | Condição | Recompensa |
|-------|----------|------------|
| Style Curator | Avaliar 10 outfits da comunidade | 200 🪙 |
| Wardrobe Maven | Adicionar 3 novas peças ao guarda-roupa | 150 🪙 |
| Card Artisan | Aplicar AI Artwork em 2 peças | Background Pack exclusivo |
| Duel Champion | Vencer 5 duelos | Card Skin holográfico |
| Power Deck | Montar outfit com poder total > 350 | R$30 em voucher de loja |

### Brand Quests (por loja parceira)

| Quest | Condição | Recompensa |
|-------|----------|------------|
| Colecionador | Ter 5 peças da marca | R$10 desconto na loja |
| Veteran | Usar marca em 10 outfits diferentes | Acesso VIP + lançamentos exclusivos |

### Seasonal Events (eventos sazonais)

Competições temáticas com leaderboard global. Ex:
- **"Verão Urbano"** — melhor deck para verão/casual + GLOW máximo
- **"Fashion Week SP"** — outfit mais criativo da semana (avaliado por ART + EDGE)

Premiação: vouchers de alto valor, card skins exclusivos, troféus de colecionador.

---

## Duelos de Estilo (PvP)

O duel simula **5 rodadas**, cada uma testando um atributo diferente:

```
Rodada 1: EDGE    →  ambos revelam média de EDGE do deck
Rodada 2: RANGE   →  ambos revelam média de RANGE
Rodada 3: CLOUT   →  ambos revelam média de CLOUT
Rodada 4: GLOW    →  ambos revelam média de GLOW
Rodada 5: ART     →  ambos revelam média de ART
```

Vence quem ganhar mais rodadas (best of 5). Em caso de empate, cada um recupera sua aposta.

**Apostas:** FLAIR Coins. Vencedor ganha ×1.8 o apostado.

**Modificadores no duelo:**
- Brand Synergy reduz 25% do multiplicador ao score de cada stat
- Season Sync: +8 pontos em qualquer stat se maioria das cartas estiver em SYNC
- Combo bônus parcialmente aplicado: Style Synergy → +% no EDGE

---

## Tipos de Recompensa

### 🪙 FLAIR Coins (moeda in-app)
- Taxa de conversão: **50 coins = R$1 em voucher**
- Ganhos por: quests, login diário, ratings recebidos, duelos ganhos
- Gasto em: background upgrades, geração de AI artwork, cosméticos de perfil

### 🛍️ Store Vouchers (recompensas reais)
- QR code escaneável no caixa de lojas parceiras
- Desconto em R$ fixo ou % sobre compra mínima
- Expiram em 30–90 dias
- Exemplos: R$10, R$30, 15% off

### ✨ Card Skins (cosméticos)
- Holográfico (Rare exclusive)
- Champion (vencedor de torneio)
- Brand Frame (frame exclusivo de marca parceira)

### 🎨 Background Packs
- Coleções de presets de `BackgroundConfig` exclusivos
- Desbloqueados por quests de artesanato de cartas
- Ex: "Editorial Luxury Pack", "Street Culture Pack"

### 💎 Exclusive Pieces (peças digitais)
- Marcas parceiras lançam peças digitais exclusivas via FLAIR
- Alto nível de raridade, adicionadas ao guarda-roupa digital
- Disponíveis apenas via quests de Brand Quest

### 🏆 Trophies (conquistas permanentes)
- "Fashion Week Champion"
- "Brand Ambassador" (1000+ outfit uses da marca)
- "Style Legend" (alcançar rank Legend)
- "Master Artisan" (100 cartas com AI Artwork)

---

## Ranking de Jogador (FlairRank)

| Rank | Pontos | Benefícios |
|------|--------|-----------|
| 🌱 Rookie | 0+ | Acesso básico ao jogo |
| 🔥 Trendsetter | 500+ | +10% coins em quests diárias |
| 💫 Style Maven | 1500+ | Acesso a quests exclusivas, +1 slot de deck |
| 🏛️ Fashion Architect | 4000+ | Early access a eventos sazonais |
| 💎 Iconic | 8000+ | Acesso VIP em todas as lojas parceiras |
| 👑 Legend | 15000+ | Card skin exclusiva Legend + 10% desconto permanente |

---

## Novas Coleções Firestore

```
saiFlairProfiles    — perfil de jogo do usuário
saiFlairCards       — cartas geradas (cache com stats calculados)
saiFlairQuests      — quests ativas por usuário
saiFlairRewards     — recompensas ganhas
saiFlairVouchers    — vouchers de loja gerados
saiFlairDuels       — histórico de duelos
saiFlairSeasonEvents — eventos sazonais globais
```

---

## Integração com Campos Existentes do saiWardrobeItem

| Campo | Uso no FLAIR |
|-------|-------------|
| `style_tags` | EDGE stat + detecção de combos Style Synergy |
| `occasion_tags` | RANGE stat + combos Occasion Synergy + quests de ocasião |
| `brand_id` / `brand_detection_confidence` | CLOUT stat + Brand Synergy multiplier + Brand Quests |
| `season` (via market_id) | SYNC stat + Season Sweep combo + Seasonal Events |
| `catalog_readiness_score` | GLOW stat (60% weight) |
| `front_view_score` | GLOW stat (40% weight) |
| `BackgroundConfig` | ART stat + desbloqueio de Background Packs |
| `is_favorite` | Conta como wear bonus na evolução de raridade |
| `style_tags` (wearstyle archetypes) | Habilidades Especiais de Limited Edition |
| `material` | Material Contrast combo |
| `color` | Identificação visual na arena de duelo |
| `model_3d_url` | Preview 3D futuro no duel arena |
| `wardrobe_item_id` | Chave de ligação FlairCard ↔ WardrobeItem |

---

## Fluxo do Usuário

```
Adiciona peça ao guarda-roupa
    ↓
FlairCard gerada automaticamente com stats calculados
    ↓
Monta outfit (Scheme) → FlairDeck criado com power total
    ↓
Recebe quests diárias/semanais adaptadas ao seu guarda-roupa
    ↓
Completa quests → ganha FLAIR Coins e recompensas
    ↓
Desafia outros usuários em Duelos de Estilo
    ↓
Participa de Seasonal Events com leaderboard
    ↓
Troca coins por vouchers → usa voucher na loja parceira
    ↓
Evolui de rank → benefícios crescentes
```

---

## Modelo de Parceria com Marcas

**Para marcas parceiras:**
- Criam Brand Quests patrocinadas (usuários completam para ganhar voucher da marca)
- Lançam Exclusive Pieces digitais como ativações
- Recebem insights anonimizados: tendências de estilo, wearstyles mais populares, perfil de deck

**Para o SAI:**
- Revenue share em vouchers resgatados
- Taxa de ativação por Brand Quest criada
- Dados de engajamento do jogo

---

## Arquivos Implementados

```
app/lib/flair/
  types.ts          — tipos completos do sistema FLAIR
  card-engine.ts    — cálculo de stats, power, combos
  quest-engine.ts   — templates de quests, progressão de rank
  duel-engine.ts    — simulação de duelos PvP
  index.ts          — re-exports

app/components/flair/
  FlairCard.tsx         — card visual com stats e raridade
  FlairStatBar.tsx      — barra de atributo animada
  QuestCard.tsx         — card de quest com progresso
  DuelArena.tsx         — arena de duelo interativa
  FlairProfileBadge.tsx — badge de perfil com rank
  VoucherCard.tsx       — voucher de loja com QR code

app/lib/collections.ts  — 7 novas coleções Firestore adicionadas
```
