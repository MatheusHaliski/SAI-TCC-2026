# Adobe Firefly — Prompts para Outfit Card e Piece Card

> **Projeto:** SAI · TCC 2026  
> **Uso:** Geração de imagens de referência visual para os dois card schemas  
> **Dica de uso no Firefly:** Cole o prompt em "Text to Image" → ajuste o estilo para **"Graphic Design"** ou **"Digital Art"** → proporção **9:16** para cards verticais ou **4:3** para composições com múltiplos cards.

---

## 1. Outfit Card — Prompt Principal (skin `default`)

```
A sleek digital fashion outfit card displayed as a UI component on a dark screen. 
The card has a deep dark background with a smooth gradient blending from near-black 
midnight blue to dark indigo (colors: #0f172a to #312e81), with a subtle geometric 
mesh overlay pattern in translucent white lines. 

At the top, a full-width editorial fashion photograph shows a male model wearing 
a curated street-luxury outfit — dark tailored pants, a structured jacket, 
clean sneakers. The photo has a cinematic aspect ratio of 16:5, slightly rounded 
corners.

Below the photo, bold white sans-serif typography displays the outfit name 
"Urban Atelier" in large weight, with a small monospace caption line below 
reading "CASUAL URBANO · @creator" in muted slate text.

Beneath the header, a horizontal grid of 3 small glass-morphism cards displays 
individual clothing pieces. Each piece card has: a translucent cyan-blue gradient 
background (rgba blues and teals, backdrop blur), a thin cyan border with a soft 
glow, a piece name in white semi-bold text, a brand badge, and 2 small colored 
wearstyle chips ("Statement Piece", "Visual Anchor") in rounded pill shapes.

The overall aesthetic is premium editorial fashion meets tech UI — glass morphism, 
subtle neon glow lines, high contrast typography, luxury dark theme. 
Shot as a clean flat render, no perspective distortion, product design mockup style.
```

---

## 2. Outfit Card — Prompt Variante `trading` (Card Colecionável)

```
A collectible trading card for a fashion outfit, rendered as a physical card 
with depth and slight holographic sheen. The card dimensions are portrait 
2.5x3.5 inches ratio. 

The outer frame is a thick 2-pixel light gray border on a dark charcoal background.
Inside, a second white 4-pixel inner border creates a double-frame effect, 
classic to trading card design.

At the very top inside, a small header row shows: on the left, a monospace 
badge reading "OC №0042" with a thin dark border; on the right, a score "8.5/10" 
in large bold white numerals.

Below the header, a full-bleed fashion photography panel (height 170px equivalent) 
shows an outfit composition — jacket, trousers, shoes — styled editorially.

Under the photo, an inverted white band contains the outfit name 
"Obsidian Cascade" in heavy black condensed typography, with a small 
monospace style-line caption below.

The lower section of the card is dark charcoal with a list of 4 outfit "moves" 
(clothing pieces), each in a bordered dark panel showing: piece number (01, 02...), 
piece name and brand in white bold monospace, and a category tag on the right 
(Premium / Rare / Standard). At the bottom, brand names separated by slashes 
in muted monospace text.

The overall aesthetic: Pokémon card structure, luxury fashion content, 
dark matter color palette, monospace typography throughout. 
Rendered as a clean product shot on a neutral gray surface with soft shadow.
```

---

## 3. Outfit Card — Prompt Variante `atelier` (Minimalista)

```
A minimalist white fashion outfit card, clean and editorial. 
Pure white background (#FFFFFF), no decorative elements, only typography and content.

At the very top, a thin light gray hairline border separates a small monospace 
eyebrow text "OUTFIT CARD" on the left and a score "★ 9.2" on the right — 
both in ultra-light slate gray at 9px scale.

Below, a full-width fashion photo (height 200px) shows a clean editorial 
fashion look — minimal color palette, sharp shadows. Photo has no border radius, 
bleeds edge to edge.

The content area has generous white padding. The outfit name "The Silent Draft" 
appears in 22px bold condensed sans-serif in near-black (#111827). Below, 
a monospace caption in muted gray reads "MATHEUS · MINIMAL EDITORIAL".

A short description paragraph follows in 12px regular text, light gray, 
with relaxed line spacing.

Brand chips near the bottom: small bordered rectangles in hairline gray 
with uppercase monospace brand names in muted text ("ZARA", "LACOSTE", "ADIDAS").

A numbered piece list at the bottom, separated by a light gray hairline: 
each row shows "01 Piece Name" in gray monospace on the left and 
"Brand Name" in dark semi-bold on the right. Clean, museum-like layout.

Aesthetic: Maison Margiela white label, Swiss typographic grid, zero ornamentation. 
Rendered as a flat mockup on a very light gray background with minimal drop shadow.
```

---

## 4. Piece Card — Prompt `PieceIdentityCard` (Rare tier)

```
A premium fashion trading card called "Piece Identity Card", vertical portrait format 
(roughly 340x560px), rendered as a digital UI component.

The card has a near-black background (#0a0a0a). The entire outer border glows 
with a vivid cyan light — a 1px solid cyan border (#22d3ee) with a 
soft outer box-shadow glow of 32px cyan (rgba 34,211,238 at 0.38 opacity).

At the top, a header bar in dark neutral-900 shows three elements in one row: 
on the left, a monospace badge "▲ RARE" with a cyan-colored border and text; 
in the center, "SAI-A3F2" in tiny monospace gray; 
on the right, a monospace badge "■ JACKET" with a gradient fill (amber-to-yellow tones).

Below the header, a card art panel in 3:4 aspect ratio shows an isolated clothing 
item — a structured black leather jacket — on a transparent-like dark background. 
The image has a very faint cyan gradient overlay at 18% opacity. 
A subtle inner glow (inset cyan shadow) frames the image panel. 
The image panel has a cyan-tinted thin border and rounded corners.

Under the card art, a dark panel shows:
- The piece name "Vantablack Blazer" in 15px ultra-bold white text, truncated
- Below: "ZARA · BLACK · LEATHER" in 9px monospace uppercase muted gray, dot-separated

Next section — "— ATRIBUTOS —" in tiny monospace uppercase gray — shows 4 stat bars:
Each bar has a label on the left in monospace (VERSATILITY, STYLE POWER, PRESENCE, AI AFFINITY), 
a row of 5 small rectangular segments in the middle 
(filled segments in indigo-400 blue, empty in neutral-700 dark gray), 
and a "X/5" score on the right in tiny monospace gray.

Below, a "— ABILITIES —" section shows 2-3 pill-shaped tags: 
"Statement Piece" and "Visual Anchor" — each with a gradient fill matching their 
semantic color (amber for statement, purple for anchor), white text, soft glow border.

An XP progress bar: labeled "⚡ 12 usos" on the left and "12/30 → RARE" on the right 
in tiny monospace. The bar is 5px tall, full width, rounded, dark background, 
filled with a cyan gradient matching the rarity tone.
Achievement badges below: "🏆 Veteran" and "⭐ Collection Star" in small bordered dark chips.

Community section: "— COMMUNITY —" label, then a row showing 
"👥 34 owners · ❤️ 128 curtidas · ⭐ 4.7 (89)". 
Interactive row with a "♡ Curtir" button and a 5-star rating widget.

Footer: "SAI · PIECE IDENTITY CARD · A3F29F1E" in the smallest possible 
monospace gray centered text.

Aesthetic: Pokémon holographic card meets brutalist fashion UI, 
dark theme, monospace throughout, cyan rarity glow, no gradients except rarity tones.
Rendered as a clean flat digital product mockup, slightly elevated with a faint shadow.
```

---

## 5. Piece Card — Prompt `PieceIdentityCard` (Premium tier)

```
Same structure as the Rare Piece Identity Card, but with PREMIUM tier styling:

The outer border is amber/gold (#f59e0b) at 70% opacity, 
with a soft 28px outer box-shadow glow in amber (rgba 251,191,36 at 0.28 opacity).

The rarity badge in the header reads "▲ PREMIUM" with amber text and amber border.

The card art panel for a premium Corduroy Blazer in caramel brown, 
with a warm amber-to-gold gradient overlay at 18% opacity.
No inner glow effect (Premium tier).

The XP bar is filled with an amber-to-gold gradient.

The category label and XP counter read "PREMIUM" in amber-400 color.

The piece name: "Caramel Corduroy Blazer" by LACOSTE.
Stats: Versatility 3/5, Style Power 4/5, Presence 2/5, AI Affinity 3/5.
Abilities: "Quiet Luxury", "Balanced Fit".

Everything else identical to the Rare card structure.
Aesthetic: warm gold luxury, less neon than Rare, more refined.
```

---

## 6. Piece Card — Prompt `PieceDiscoveryCard` (Feed)

```
A fashion discovery card displayed inside a dark mobile app feed. 
The card has a glass-morphism style: translucent white-on-dark background 
(white at 10% opacity), a thin white border at 20% opacity, 
backdrop blur effect giving it a frosted glass appearance, 
and a deep shadow (rgba black 0.25 at 30px).

The card image fills the top: a 16:9 ratio photo of an isolated 
urban streetwear sneaker on a clean surface, slightly aerial angle. 
In the top-right corner of the image, a small badge reads "3D READY" 
in tiny uppercase semibold text with a cyan background at 25% opacity 
and cyan border, pill-shaped.

Below the image:
- "Air Utility 2040" in white 16px semibold
- "ADIDAS • Footwear" in white at 75% opacity, 12px
- "Rare • @streetlab_user" in fuchsia-pink at 85% opacity, 12px
- Three pill-shaped wearstyle tags: "Street Energy", "Trend Driver", "Style Accent" — 
  each with a thin white border at 25% opacity, white text at 80% opacity, 
  rounded-full, 10px text

On hover (show as subtle highlight state): the card border shifts to cyan at 60% opacity, 
the card lifts slightly (translate-y -4px).

Three discovery cards shown side by side in a responsive grid, 
each showing a different clothing item (sneakers, jacket, accessory bag). 
Dark app background behind the grid.

Aesthetic: iOS glassmorphism meets fashion e-commerce, 
frosted dark panels, subtle neon cyan hover glow, clean minimal tags.
Rendered as a mobile app screenshot mockup with a dark background.
```

---

## 7. Composição Completa — Prompt para Overview dos Dois Schemas

```
A professional design overview poster showing the two main card types 
of a fashion AI app called SAI.

LEFT SIDE — "Outfit Card" section:
A dark-background fashion card (deep indigo gradient) showing an outfit composition. 
At the top, a cinematic fashion photo. Below, bold white outfit name typography. 
A grid of 3 smaller cyan glass-morphism piece cards with glow borders.
Labeled with small text: "OUTFIT CARD · ESQUEMA DE VESTIMENTA"

RIGHT SIDE — "Piece Card" section, showing two variants stacked:
TOP: A trading-card-style piece card with near-black background, 
cyan glowing border (Rare tier), vertical portrait ratio, 
showing an isolated jacket photo, attribute stat bars, and monospace typography.
BOTTOM: A smaller glassmorphism discovery card with frosted white-on-dark style, 
fashion item photo, and minimal tags.
Labeled: "PIECE CARD · ESQUEMA DE PEÇA"

The overall poster has a dark charcoal background (#0a0a0f), 
with very subtle grid lines. Cards are shown slightly elevated with soft shadows. 
Typography labels between sections use Inter or similar clean sans-serif, 
muted slate gray, uppercase tracking-wide.

Color palette: deep dark slate, cyan (#22d3ee), amber (#f59e0b), 
violet (#a855f7), white text. 

Aesthetic: design system documentation poster meets luxury fashion editorial. 
Clean, no photo-realistic people. Only UI cards and minimal typographic labels.
Rendered as a 16:9 landscape overview mockup for a design presentation.
```

---

## Dicas de Uso no Firefly

| Ajuste | Configuração recomendada |
|--------|------------------------|
| **Estilo** | Graphic Design → Digital Art |
| **Proporção** | 9:16 (cards individuais) · 16:9 (overview) |
| **Content type** | Art |
| **Efeitos** | Lighting: Studio · Color: Cool · Camera: Telephoto |
| **Negativo (evitar)** | "blurry, distorted text, realistic people, watermark, 3D render" |
| **Intensidade do prompt** | Máxima (mover o slider para "Follow prompt closely") |

> **Nota:** O Firefly não renderiza texto legível de forma confiável. As labels textuais nos cards aparecerão como texturas aproximadas — use os prompts para validar **composição, paleta e atmosfera visual**, não tipografia exata.
