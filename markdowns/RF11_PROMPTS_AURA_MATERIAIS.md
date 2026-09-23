# RF11 — Prompts de Geração: Presets AURA, Materiais e Combinações

**Projeto:** FashionAI (SAI-TCC-2026)
**Complementa:** `RF11_PROPOSTA_PRESETS_AURA_E_MATERIAIS.md`
**Formato:** segue exatamente a convenção já usada em produção em `app/backend/services/ArtworkStudioService.ts` (`STYLE_DIRECTIONS`, `PALETTE_DIRECTIONS`, `COLOR_INTENT_DIRECTIONS`) — fragmentos em inglês, concatenados por vírgula em `buildArtworkPrompt()`.

---

## 1. Como isto se encaixa no gerador já existente

Hoje `buildArtworkPrompt(input)` monta o `finalPrompt` assim:

```ts
const finalPrompt = [
  STYLE_DIRECTIONS[input.stylePreset],
  COMPOSITION_DIRECTIONS[input.compositionType],
  SHAPE_DIRECTIONS[input.shapeLanguage],
  PALETTE_DIRECTIONS[input.paletteMode],
  input.colorIntent ? COLOR_INTENT_DIRECTIONS[input.colorIntent] : null,
  safeAreaText,
  'design asset oriented output, premium fashion/editorial background utility',
  controlText,
  userPrompt,
].filter(Boolean).join(', ');
```

A proposta é adicionar **dois novos dicionários de fragmento**, no mesmo padrão:

```ts
const AURA_PRESET_DIRECTIONS: Record<AuraPresetId, string> = { /* seção 2 */ };
const MATERIAL_DIRECTIONS: Record<MaterialId, string> = { /* seção 3 */ };
```

E incluí-los no array do `finalPrompt`:

```ts
const finalPrompt = [
  STYLE_DIRECTIONS[input.stylePreset],
  input.presetAura ? AURA_PRESET_DIRECTIONS[input.presetAura] : null,
  input.material ? MATERIAL_DIRECTIONS[input.material] : null,
  COMPOSITION_DIRECTIONS[input.compositionType],
  ...
].filter(Boolean).join(', ');
```

**Isso é o que torna a combinação livre (seção 3.2 do documento principal) tecnicamente trivial**: como o preset AURA e o material são dois fragmentos independentes no mesmo array, qualquer um dos 10 presets pode se combinar com qualquer um dos 10 materiais sem precisar de um prompt escrito à mão para cada par — são **20 prompts necessários** (10 + 10), não 100. As combinações nascem da concatenação, exatamente como hoje `stylePreset` já se combina livremente com `paletteMode`.

A seção 4 traz, como referência, os 10 prompts **já compostos** (fragmento AURA + fragmento material) para os pares que a matriz de coerência recomenda como padrão — prontos para copiar/colar ou usar como teste de regressão visual.

---

## 2. Prompts necessários — Presets AURA (10 fragmentos)

| ID | Nome | Fragmento de prompt (inglês, pronto para `AURA_PRESET_DIRECTIONS`) |
|---|---|---|
| `aura_alfaiataria` | Tailored Steel | `tailored classic menswear-inspired background, cold monochrome palette from deep navy to soft steel grey, quiet-luxury studio lighting, sharp low-contrast linear gradient, refined tailored art direction` |
| `aura_editorial_mono` | Editorial Ivory | `minimalist editorial fashion background, warm-neutral monochrome palette from ivory to soft taupe, ultra-low saturation, clean campaign lighting, generous negative space for typography` |
| `aura_romantico_petala` | Petal Bloom | `romantic feminine fashion background, soft analogous warm palette from blush pink to dusty rose, radial soft-focus glow, delicate floating petal-like bokeh accents` |
| `aura_boemio_terracota` | Terracotta Dune | `bohemian fashion background, warm analogous autumn palette from burnt terracotta to golden ochre, radial sunset glow, organic desert-dune gradient movement` |
| `aura_streetwear_neon` | Concrete Neon | `urban streetwear fashion background, high-contrast complementary palette of deep asphalt grey with electric cyan and magenta neon accents, hard diagonal graphic blocks, bold contemporary street energy` |
| `aura_avantgarde_cromo` | Chrome Iridescent | `avant-garde futuristic fashion background, cool iridescent palette from deep indigo to pale lavender chrome, holographic conic gradient, high-contrast vanguard editorial lighting` |
| `aura_esportivo_performance` | Performance Pulse | `sporty athleisure fashion background, energetic complementary palette of deep petrol blue with electric sky-blue and lime accents, diagonal motion-blur beams, dynamic performance-driven composition` |
| `aura_glam_noite` | Midnight Spotlight | `evening glam red-carpet fashion background, dark monochrome palette with warm bronze-gold jewel-tone spotlight accent, radial stage-spotlight glow, dramatic high-contrast luxury lighting` |
| `aura_dark_academia` | Ivy Library | `dark academia fashion background, warm analogous palette from deep espresso brown to aged brass, muted forest-green accent, low-key library lighting, intellectual editorial mood` |
| `aura_natural_organico` | Raw Linen | `natural sustainable fashion background, neutral cool-toned earthy palette from raw linen grey to bone white, minimal saturation, soft breathable organic lighting` |

**Fragmento negativo adicional (aplicar a todos os presets AURA):**
`avoid gamified badge icons, avoid game UI elements, avoid achievement/level-up graphics, avoid text overlays` — evita que a IA misture o vocabulário de gamificação do sistema Aura de engajamento (RAW→LEGENDARY) com a direção de moda deste catálogo.

---

## 3. Prompts necessários — Materiais (10 fragmentos)

| ID | Nome / fibra real | Fragmento de prompt (inglês, pronto para `MATERIAL_DIRECTIONS`) |
|---|---|---|
| `linho_natural` | Linho natural | `natural linen woven textile surface, light plain weave with subtle irregular slub texture, breathable matte finish, soft fabric grain` |
| `la_fria_alfaiataria` | Lã fria / worsted | `cold wool suiting fabric surface, fine worsted twill weave, structured firm drape, smooth matte tailored finish` |
| `cetim_liquido` | Cetim / satin | `liquid satin fabric surface, fluid high-sheen weave, directional light reflection, smooth glossy drape` |
| `veludo_profundo` | Veludo | `deep velvet pile fabric surface, dense directional nap, soft shadow depth between fibers, rich satin-matte duotone sheen` |
| `denim_selvagem` | Denim selvedge | `selvedge denim fabric surface, coarse diagonal twill weave, rigid robust texture, matte indigo-toned grain` |
| `tweed_boucle` | Tweed bouclé | `bouclé tweed fabric surface, irregular looped yarn texture, voluminous cross-hatched weave, matte tactile bumpy surface` |
| `organza_translucida` | Organza | `sheer organza fabric surface, crisp fine plain weave, translucent light-catching texture, subtle satin glow` |
| `couro_nappa` | Couro nappa | `nappa leather surface, smooth supple grain, controlled satin-matte reflection, structured premium hide texture` |
| `malha_canelada` | Malha canelada / rib knit | `ribbed knit fabric surface, regular vertical rib lines, soft stretch texture, matte tactile knit finish` |
| `laminado_metalico` | Lamê / laminado metálico | `metallic laminated fabric surface, reflective foil-coated weave, rigid high-shine texture, futuristic lamé finish` |

**Fragmento negativo adicional (aplicar a todos os materiais):**
`avoid literal clothing garment silhouette, avoid stock photo watermark, avoid plastic 3D render look, avoid visible stitched text or logos` — impede que a IA renderize uma peça de roupa inteira (o material deve ficar como *superfície/textura de fundo*, não como uma roupa fotografada).

---

## 4. Combinações de referência (10 pares da matriz de coerência)

Cada linha já é o `finalPrompt` completo (fragmento AURA + fragmento material + blocos fixos do gerador), pronto para envio ao serviço de IA generativa.

**Blocos fixos reaproveitados de `buildArtworkPrompt()`:**
`full background composition for outfit card design`, `clear text-safe area, controlled visual density, clean negative space for outfit presentation and typography`, `design asset oriented output, premium fashion/editorial background utility`.

**Negativo fixo (`baseNegative`):**
`avoid faces, avoid people, avoid clutter, avoid chaotic scenery, avoid fantasy character focus, avoid unreadable typography collisions`.

| # | Arquétipo | Preset AURA + Material | Prompt final composto |
|---|---|---|---|
| 1 | Alfaiataria clássica | `aura_alfaiataria` + `la_fria_alfaiataria` | `tailored classic menswear-inspired background, cold monochrome palette from deep navy to soft steel grey, quiet-luxury studio lighting, sharp low-contrast linear gradient, refined tailored art direction, cold wool suiting fabric surface, fine worsted twill weave, structured firm drape, smooth matte tailored finish, full background composition for outfit card design, clear text-safe area, controlled visual density, clean negative space for outfit presentation and typography, design asset oriented output, premium fashion/editorial background utility` |
| 2 | Minimalismo editorial | `aura_editorial_mono` + `organza_translucida` | `minimalist editorial fashion background, warm-neutral monochrome palette from ivory to soft taupe, ultra-low saturation, clean campaign lighting, generous negative space for typography, sheer organza fabric surface, crisp fine plain weave, translucent light-catching texture, subtle satin glow, full background composition for outfit card design, clear text-safe area, controlled visual density, clean negative space for outfit presentation and typography, design asset oriented output, premium fashion/editorial background utility` |
| 3 | Romântico/feminino | `aura_romantico_petala` + `organza_translucida` | `romantic feminine fashion background, soft analogous warm palette from blush pink to dusty rose, radial soft-focus glow, delicate floating petal-like bokeh accents, sheer organza fabric surface, crisp fine plain weave, translucent light-catching texture, subtle satin glow, full background composition for outfit card design, clear text-safe area, controlled visual density, clean negative space for outfit presentation and typography, design asset oriented output, premium fashion/editorial background utility` |
| 4 | Boêmio | `aura_boemio_terracota` + `linho_natural` | `bohemian fashion background, warm analogous autumn palette from burnt terracotta to golden ochre, radial sunset glow, organic desert-dune gradient movement, natural linen woven textile surface, light plain weave with subtle irregular slub texture, breathable matte finish, soft fabric grain, full background composition for outfit card design, clear text-safe area, controlled visual density, clean negative space for outfit presentation and typography, design asset oriented output, premium fashion/editorial background utility` |
| 5 | Streetwear | `aura_streetwear_neon` + `denim_selvagem` | `urban streetwear fashion background, high-contrast complementary palette of deep asphalt grey with electric cyan and magenta neon accents, hard diagonal graphic blocks, bold contemporary street energy, selvedge denim fabric surface, coarse diagonal twill weave, rigid robust texture, matte indigo-toned grain, full background composition for outfit card design, clear text-safe area, controlled visual density, clean negative space for outfit presentation and typography, design asset oriented output, premium fashion/editorial background utility` |
| 6 | Avant-garde/futurista | `aura_avantgarde_cromo` + `laminado_metalico` | `avant-garde futuristic fashion background, cool iridescent palette from deep indigo to pale lavender chrome, holographic conic gradient, high-contrast vanguard editorial lighting, metallic laminated fabric surface, reflective foil-coated weave, rigid high-shine texture, futuristic lamé finish, full background composition for outfit card design, clear text-safe area, controlled visual density, clean negative space for outfit presentation and typography, design asset oriented output, premium fashion/editorial background utility` |
| 7 | Esportivo/athleisure | `aura_esportivo_performance` + `malha_canelada` | `sporty athleisure fashion background, energetic complementary palette of deep petrol blue with electric sky-blue and lime accents, diagonal motion-blur beams, dynamic performance-driven composition, ribbed knit fabric surface, regular vertical rib lines, soft stretch texture, matte tactile knit finish, full background composition for outfit card design, clear text-safe area, controlled visual density, clean negative space for outfit presentation and typography, design asset oriented output, premium fashion/editorial background utility` |
| 8 | Glam de noite | `aura_glam_noite` + `veludo_profundo` | `evening glam red-carpet fashion background, dark monochrome palette with warm bronze-gold jewel-tone spotlight accent, radial stage-spotlight glow, dramatic high-contrast luxury lighting, deep velvet pile fabric surface, dense directional nap, soft shadow depth between fibers, rich satin-matte duotone sheen, full background composition for outfit card design, clear text-safe area, controlled visual density, clean negative space for outfit presentation and typography, design asset oriented output, premium fashion/editorial background utility` |
| 9 | Dark academia | `aura_dark_academia` + `tweed_boucle` | `dark academia fashion background, warm analogous palette from deep espresso brown to aged brass, muted forest-green accent, low-key library lighting, intellectual editorial mood, bouclé tweed fabric surface, irregular looped yarn texture, voluminous cross-hatched weave, matte tactile bumpy surface, full background composition for outfit card design, clear text-safe area, controlled visual density, clean negative space for outfit presentation and typography, design asset oriented output, premium fashion/editorial background utility` |
| 10 | Natural/sustentável | `aura_natural_organico` + `linho_natural` | `natural sustainable fashion background, neutral cool-toned earthy palette from raw linen grey to bone white, minimal saturation, soft breathable organic lighting, natural linen woven textile surface, light plain weave with subtle irregular slub texture, breathable matte finish, soft fabric grain, full background composition for outfit card design, clear text-safe area, controlled visual density, clean negative space for outfit presentation and typography, design asset oriented output, premium fashion/editorial background utility` |

**Negativo composto para as 10 linhas acima:**
`avoid faces, avoid people, avoid clutter, avoid chaotic scenery, avoid fantasy character focus, avoid unreadable typography collisions, avoid gamified badge icons, avoid game UI elements, avoid achievement/level-up graphics, avoid text overlays, avoid literal clothing garment silhouette, avoid stock photo watermark, avoid plastic 3D render look, avoid visible stitched text or logos`

---

## 5. Combinações fora da matriz padrão

Qualquer um dos outros 90 pares possíveis (10 AURA × 10 materiais, menos os 10 já listados) é gerado com a **mesma fórmula**: `[fragmento AURA] + [fragmento material] + blocos fixos`, sem necessidade de escrever um prompt novo — é só trocar as duas entradas nos dicionários das seções 2 e 3. Isso é o que a seção 3.2 do documento principal chama de "combinação livre, sem restrição": tecnicamente, a lista de prompts *necessários* é só a de 20 fragmentos — o resto é composição automática do `buildArtworkPrompt()`.

---

## 6. Prompt de vídeo — Mosaico Aura com material (P×M, 8 s)

Gera a opção **Mosaico Aura com material** (seção 7 de `RF11_PROPOSTA_PRESETS_AURA_E_MATERIAIS.md`): a grade do preset com os 12 materiais em primeiro plano e a textura do material escolhido por baixo. Diferente das seções 2–5 (fragmentos de imagem concatenados por `buildArtworkPrompt()`), este é um prompt completo de vídeo, um por combinação preset × material.

**Template:**

```
Cinematic 8-second looping animation. Foreground: [DESCRIÇÃO DO PRESET]. Background overlay: [DESCRIÇÃO DO MATERIAL] texture visible at soft opacity beneath the composition, breathing and shimmering gently through the panels. Studio lighting. No text.
```

### 6.1 Materiais (overlay)

| Código | Material | Descrição (overlay) |
|---|---|---|
| M01 | Herringbone | `dark charcoal herringbone woven fabric, dense diagonal weave pattern` |
| M02 | Seda Cetim | `smooth lustrous champagne satin with flowing folds, silky sheen` |
| M03 | Couro Cognac | `pebbled tan leather with fine grain texture` |
| M04 | Veludo Esmeralda | `dense plush emerald green velvet with deep pile` |
| M05 | Burlap/Linho | `coarse woven burlap-like natural fabric in warm beige` |
| M06 | Malha Canelada | `pale gray ribbed knit fabric with evenly spaced vertical channels` |
| M07 | Nylon Ripstop | `dark charcoal tightly woven diamond lattice textile` |
| M08 | Organza Chiffon | `sheer blush mesh fabric with delicate grid texture` |
| M09 | Brocado Jacquard | `deep burgundy damask with ornate gold floral embroidery` |
| M10 | Índigo Denim | `dark blue denim with dense diagonal twill weave` |
| M11 | Lã Tweed | `curly woolly surface in warm cream and beige tones` |
| M12 | Laminado Metálico | `densely interlaced metallic silver mesh, reflective surface` |

### 6.2 Presets (foreground)

| Código | Preset AURA | Descrição (foreground) |
|---|---|---|
| P01 | Tailored Steel (`aura_alfaiataria`) | `a polished 4x3 grid of paired hanging garments on a light gray backdrop in charcoal and ivory tones` |
| P02 | Editorial Ivory (`aura_editorial_mono`) | `a 3x4 grid of stylized still-life pedestals with fabric-draped objects in charcoal, slate and cream tones` |
| P03 | Petal Bloom (`aura_romantico_petala`) | `a 3x4 grid of abstract blush pink and petal-tone textile close-ups with soft shimmer` |
| P04 | Terracotta Dune (`aura_boemio_terracota`) | `a 3x4 grid of warm gradient textile swatches in charcoal, ivory, sand and tan on gradient backdrops` |
| P05 | Concrete Neon (`aura_streetwear_neon`) | `a 3x4 grid of decorative square panels with diagonal raised bands and embossed textures in mixed dark tones` |
| P06 | Performance Pulse (`aura_esportivo_performance`) | `a 3x4 grid of abstract scenes each featuring a bright glowing X-shaped light beam on textured backdrops` |
| P07 | Raw Linen (`aura_natural_organico`) | `a 3x4 grid of small textile-like abstract images and nature-inspired textures in muted charcoal and earth tones` |
| P08 | Terracotta Dune (`aura_boemio_terracota`) | `a large rectangular frame divided into four tall panels showing rolling desert sand dunes under hazy sky, warm peach and beige tones` |
| P09 | Raw Linen (`aura_natural_organico`) | `a 3x4 collage of twelve square texture samples on a plain white background in charcoal, silver and ivory tones` |
| P10 | Midnight Spotlight (`aura_glam_noite`) | `a 4x3 catalog grid of fabric and material close-ups on dark studio backdrops, charcoal ivory and jewel tones` |
| P11 | Chrome Iridescent (`aura_avantgarde_cromo`) | `a 3x4 grid of abstract lavender, lilac and violet silky fabric panels on a black background` |
| P12 | Concrete Neon (`aura_streetwear_neon`) | `a graphic glitch-inspired collage grid with bright cyan and vivid magenta across mixed abstract textures` |
| P13 | Midnight Spotlight (`aura_glam_noite`) | `a 4x3 grid of modern polished interior stage spaces each with a central runway and downward spotlights, charcoal and slate tones` |
| P14 | Ivy Library (`aura_dark_academia`) | `a 4x3 grid of classic library study interiors with wooden desk and wall-to-wall bookshelves, warm lamp light` |
| P15 | Raw Linen (`aura_natural_organico`) | `a collage of tightly cropped interior details showing tufted upholstery, folded drapery and furniture textures in charcoal, beige and cream` |
| P16 | Terracotta Dune (`aura_boemio_terracota`) | `a 3x4 grid of ornamental textile panels in deep navy, teal, charcoal, ivory and burgundy` |
| P17 | Chrome Iridescent (`aura_avantgarde_cromo`) | `a 3x4 grid of fabric swatches in charcoal gray, warm ivory, champagne and jewel tones on dark neutral backdrop` |
| P18 | Ivy Library (`aura_dark_academia`) | `a tiled grid of the same cozy library study scene rendered in multiple color treatments — charcoal, warm beige, cool gray and teal` |

### 6.3 Exemplos

**P01 × M01:**

```
Cinematic 8-second looping animation. Foreground: a polished 4x3 grid of paired hanging garments on a light gray backdrop in charcoal and ivory tones. Background overlay: dark charcoal herringbone woven fabric, dense diagonal weave pattern texture visible at soft opacity beneath the composition, breathing and shimmering gently through the panels. Studio lighting. No text.
```

**P06 × M09:**

```
Cinematic 8-second looping animation. Foreground: a 3x4 grid of abstract scenes each featuring a bright glowing X-shaped light beam on textured backdrops. Background overlay: deep burgundy damask with ornate gold floral embroidery texture visible at soft opacity beneath the composition, breathing and shimmering gently through the panels. Studio lighting. No text.
```

### 6.4 Combinações e nomes

Os 216 prompts saem da combinação de cada P (P01–P18) com cada M (M01–M12) no template. Nomes: `P01_M01`, `P01_M02`, …, `P18_M12` — o mesmo código `Pxx_Myy` dos assets do catálogo P×M (seção 7.3 da proposta).

A **imagem única**, a outra opção de Preset Aura + material, não usa este template: ela corresponde ao prompt composto AURA + material das seções 4 e 5, na versão GIF do preset.
