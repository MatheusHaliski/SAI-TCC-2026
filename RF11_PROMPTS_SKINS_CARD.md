# RF11 — Prompts de Geração: Skins de Card (Atelier, Spread, Índice, Trading, FAI Max, Stub, Specimen)

**Projeto:** FashionAI (SAI-TCC-2026)
**Escopo:** thumbnails de referência para os 7 skins de card já implementados em `app/outfit-card/skins/` (`CardSkinId`), calibrados pelas dimensões reais de `anatomias_card_v12.html`.
**Fora de escopo por enquanto (por pedido explícito):** mesclagem com a Etapa 3 — Layout & Estilo (anatomias Passarela/Etiqueta/Raio-X/Bento/Espectro/Recibo). Este documento cobre só os **skins de card** (estilo/tipografia/decoração), que já são um sistema separado das **anatomias** (onde cada informação fica).

---

## 1. Por que "thumbnail estático", não "preview ao vivo"

Retomando a distinção da resposta anterior: o card ao vivo dentro do RF11 é sempre renderizado pelo componente React real do skin (`CardAtelier.tsx` etc.), com dados reais do usuário (fotos, nomes, preços, curtidas). Uma imagem gerada por IA **não substitui isso** — ela serve para:

1. **Thumbnail do seletor de skin** — uma imagem ilustrativa, gerada uma vez, cacheada, mostrando "o clima" de cada skin antes do usuário escolher. É isso que este documento produz.
2. (Fora de escopo aqui, já resolvido antes) — camada de atmosfera/textura injetada no card real via o mesmo pipeline de Arte com IA (Preset Aura/Material), reaproveitando os fragmentos deste documento como uma das direções de estilo possíveis.

---

## 2. Dimensões reais (fonte: `anatomias_card_v12.html`)

Largura é **fixa em 90mm em todo o sistema** — peça avulsa e esquema, Ampliado e Compacto. O que muda é a altura.

| Formato | Largura | Altura | Proporção | Px @ 96dpi (arredondado) |
|---|---|---|---|---|
| **Ampliado** (peça ou esquema, qualquer skin) | 90mm | 220mm | ≈ 0,41 : 1 (retrato bem estreito e alto) | 340 × 831 px |
| **Compacto** — varia por densidade de conteúdo, mesma largura do Ampliado | 90mm | 14–34mm | entre ≈ 2,6:1 e ≈ 6,4:1 (faixa horizontal curta) | 340 × 53–129 px |
| **Foto de peça (thumbnail 1:1)** | 45mm | 45mm | 1:1 | 170 × 170 px |
| **Foto dentro do card** (`.c-photo`, padrão) | — | — | 4:3 | — |
| **Foto hero compacta** (Foto hero + lista lateral, Compacto) | — | — | 16:9 | — |

**Nota sobre Compacto:** nas 6 novas anatomias de esquema (Passarela 34mm, Raio-X 22mm, Bento 28mm, Etiqueta 16mm, Recibo 15mm, Espectro 14mm), a altura real fica entre **53px e 129px** a 96dpi. Nessa faixa, pedir a um modelo de geração de imagem para renderizar texto de UI legível é irrealista — a IA erra tipografia miúda de forma consistente. Por isso a recomendação é: **gerar só a versão Ampliado por IA** (340×831px, com espaço suficiente para composição) e, no seletor, **recortar/reduzir essa mesma imagem** para a prévia Compacto (um crop da região superior, por exemplo), em vez de gerar uma imagem nativa na resolução minúscula do Compacto.

---

## 3. Fragmentos de estilo por skin (7 — `SKIN_STYLE_DIRECTIONS`)

Mesmo formato de `STYLE_DIRECTIONS` em `ArtworkStudioService.ts` — fragmentos em inglês, prontos para concatenar.

| ID | Skin (`thumbHint` atual) | Fragmento de prompt |
|---|---|---|
| `atelier` | Minimal refinado, branco puro | `pristine white minimalist atelier mockup, quiet-luxury product studio aesthetic, soft diffused light, generous negative space, fine hairline borders, restrained neutral palette, refined haute couture ambiance` |
| `spread` | Editorial de magazine | `high-fashion magazine editorial spread mockup, bold layout typography cues, glossy print aesthetic, dramatic studio lighting, campaign photography mood, confident asymmetric composition` |
| `index` | Cartão de referência | `reference index card mockup, archival catalog aesthetic, clean typographic grid, muted paper tones, labeled specimen-like structure, understated utilitarian clarity` |
| `trading` | Card colecionável | `collectible trading card mockup, holographic foil accents, bold border frame, vibrant saturated palette, stat-panel game card aesthetic, glossy protective-sleeve sheen` |
| `fai_max` | Maximalista laranja FAI | `maximalist bold mockup, vivid FashionAI orange brand palette, high-energy layered graphics, saturated high-contrast composition, loud confident streetwear-adjacent editorial energy` |
| `stub` | Recibo/ticket perfurado (não registrado ainda) | `perforated ticket-stub mockup, zigzag torn-edge divider, dashed rule lines, monospace label typography, raw paper receipt texture, retail ticket aesthetic` |
| `specimen` | Ficha de laboratório (não registrado ainda) | `scientific specimen card mockup, graph-paper grid background, dashed field-label rows, clinical archival aesthetic, muted laboratory tones, precise measured documentation feel` |

---

## 4. Fragmentos de contexto — peça vs. esquema (2 — `CARD_CONTEXT_DIRECTIONS`)

| ID | Fragmento |
|---|---|
| `peca` | `single garment product framing, one clothing item centered as hero subject, isolated product-shot styling` |
| `esquema` | `full outfit editorial framing, complete look composition with multiple garment pieces styled together, head-to-toe styling context` |

## 5. Fragmento de formato — Ampliado (único gerado por IA, ver seção 2)

| ID | Fragmento |
|---|---|
| `ampliado` | `tall vertical card mockup format, narrow portrait aspect ratio approximately 0.41:1 (90:220), generous vertical space for a hero photo area plus stacked info rows below, mockup canvas 340x831` |

---

## 6. Prompts finais compostos (7 skins × Ampliado × Esquema — thumbnails de referência)

`finalPrompt` = `[SKIN_STYLE_DIRECTIONS[skin], CARD_CONTEXT_DIRECTIONS.esquema, ampliado, blocos fixos]`. Blocos fixos reaproveitados de `buildArtworkPrompt()`: `design asset oriented output, premium fashion/editorial background utility` + `clear text-safe area, controlled visual density, clean negative space for outfit presentation and typography`.

**Negativo comum a todas (reaproveita `baseNegative` + restrição de texto):**
`avoid faces, avoid people, avoid chaotic scenery, avoid unreadable typography collisions, avoid rendering small legible UI text or numbers, avoid literal price tags with readable digits, avoid stock photo watermark`

| Skin | Prompt final |
|---|---|
| **Atelier** | `pristine white minimalist atelier mockup, quiet-luxury product studio aesthetic, soft diffused light, generous negative space, fine hairline borders, restrained neutral palette, refined haute couture ambiance, full outfit editorial framing, complete look composition with multiple garment pieces styled together, head-to-toe styling context, tall vertical card mockup format, narrow portrait aspect ratio approximately 0.41:1 (90:220), generous vertical space for a hero photo area plus stacked info rows below, mockup canvas 340x831, design asset oriented output, premium fashion/editorial background utility, clear text-safe area, controlled visual density, clean negative space for outfit presentation and typography` |
| **Spread** | `high-fashion magazine editorial spread mockup, bold layout typography cues, glossy print aesthetic, dramatic studio lighting, campaign photography mood, confident asymmetric composition, full outfit editorial framing, complete look composition with multiple garment pieces styled together, head-to-toe styling context, tall vertical card mockup format, narrow portrait aspect ratio approximately 0.41:1 (90:220), generous vertical space for a hero photo area plus stacked info rows below, mockup canvas 340x831, design asset oriented output, premium fashion/editorial background utility, clear text-safe area, controlled visual density, clean negative space for outfit presentation and typography` |
| **Índice** | `reference index card mockup, archival catalog aesthetic, clean typographic grid, muted paper tones, labeled specimen-like structure, understated utilitarian clarity, full outfit editorial framing, complete look composition with multiple garment pieces styled together, head-to-toe styling context, tall vertical card mockup format, narrow portrait aspect ratio approximately 0.41:1 (90:220), generous vertical space for a hero photo area plus stacked info rows below, mockup canvas 340x831, design asset oriented output, premium fashion/editorial background utility, clear text-safe area, controlled visual density, clean negative space for outfit presentation and typography` |
| **Trading** | `collectible trading card mockup, holographic foil accents, bold border frame, vibrant saturated palette, stat-panel game card aesthetic, glossy protective-sleeve sheen, full outfit editorial framing, complete look composition with multiple garment pieces styled together, head-to-toe styling context, tall vertical card mockup format, narrow portrait aspect ratio approximately 0.41:1 (90:220), generous vertical space for a hero photo area plus stacked info rows below, mockup canvas 340x831, design asset oriented output, premium fashion/editorial background utility, clear text-safe area, controlled visual density, clean negative space for outfit presentation and typography` |
| **FAI Max** | `maximalist bold mockup, vivid FashionAI orange brand palette, high-energy layered graphics, saturated high-contrast composition, loud confident streetwear-adjacent editorial energy, full outfit editorial framing, complete look composition with multiple garment pieces styled together, head-to-toe styling context, tall vertical card mockup format, narrow portrait aspect ratio approximately 0.41:1 (90:220), generous vertical space for a hero photo area plus stacked info rows below, mockup canvas 340x831, design asset oriented output, premium fashion/editorial background utility, clear text-safe area, controlled visual density, clean negative space for outfit presentation and typography` |
| **Stub** | `perforated ticket-stub mockup, zigzag torn-edge divider, dashed rule lines, monospace label typography, raw paper receipt texture, retail ticket aesthetic, full outfit editorial framing, complete look composition with multiple garment pieces styled together, head-to-toe styling context, tall vertical card mockup format, narrow portrait aspect ratio approximately 0.41:1 (90:220), generous vertical space for a hero photo area plus stacked info rows below, mockup canvas 340x831, design asset oriented output, premium fashion/editorial background utility, clear text-safe area, controlled visual density, clean negative space for outfit presentation and typography` |
| **Specimen** | `scientific specimen card mockup, graph-paper grid background, dashed field-label rows, clinical archival aesthetic, muted laboratory tones, precise measured documentation feel, full outfit editorial framing, complete look composition with multiple garment pieces styled together, head-to-toe styling context, tall vertical card mockup format, narrow portrait aspect ratio approximately 0.41:1 (90:220), generous vertical space for a hero photo area plus stacked info rows below, mockup canvas 340x831, design asset oriented output, premium fashion/editorial background utility, clear text-safe area, controlled visual density, clean negative space for outfit presentation and typography` |

**Variante "peça" (opcional, sob demanda):** troque o fragmento `CARD_CONTEXT_DIRECTIONS.esquema` por `CARD_CONTEXT_DIRECTIONS.peca` em qualquer uma das 7 linhas acima — mesma fórmula, sem reescrever nada.

---

## 7. Onde isso entra hoje (sem tocar no fluxo ainda)

O seletor de skin já existe (`selectedCardSkin`/`onSelectSkin` em `OutfitBackgroundStudioModal`, opções em `PremiumSelections.tsx`) mas **ainda não está modelado** nos diagramas de atividades do RF11 que já corrigimos (aqueles cobrem tipo de card, elementos visuais, Arte com IA e Layout & Estilo/anatomias — o skin é um quarto sistema, hoje só no código). Este documento fica pronto para quando decidirmos: (a) só adicionar as thumbnails geradas por este prompt ao seletor de skin existente, sem mudar o `.puml`; ou (b) modelar formalmente a escolha de skin dentro do RF11 — o que, como combinado, fica para depois de resolvida a mesclagem com a Etapa 3.
