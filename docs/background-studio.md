# Background Studio — Documentação Técnica Completa

## 1) Visão geral
O **Background Studio** é o modal de edição visual do cartão de outfit. Ele permite configurar três modos principais de fundo:
- `solid` (cor sólida);
- `gradient` (gradiente com forma/shape);
- `ai_artwork` (arte gerada, procedural ou via provedor AI).

A UI principal está em `OutfitBackgroundStudioModal`, que mantém um `draft` de `OutfitBackgroundConfig`, renderiza preview em tempo real, aplica presets recomendados, gera variações AI e salva assets selecionados da sessão. A saída final é enviada por `onApply(draft)` para a tela de criação de esquema. 

## 2) Onde fica no código

### Front-end (modal e estado)
- Componente principal: `components/create-scheme/OutfitBackgroundStudioModal.tsx`.
- Esse componente controla tabs, selects, sliders, checkboxes, upload de referência, geração AI, preview e ações finais (Save/Apply/Reset/Close).

### Tipos e contratos
- Tipos do estúdio de arte e payloads de API: `app/backend/types/artwork-studio.ts`.
- Tipos de background/card: `lib/outfit-card.ts`.

### Presets, catálogos e mapeamentos
- Catálogos centrais (gradientes, geometrias, modos AI, imagens curadas, etc.): `lib/fashion-ai/background-studio/constants.ts`.
- Lógica procedural e composição baseada em preset: `lib/fashion-ai/background-studio/procedural.ts`.

### Endpoints usados
- `POST /api/artwork-studio/generate` (gera variações de artwork).
- `POST /api/artwork-studio/save` (salva variação escolhida como asset persistido).
- `GET /api/artwork-studio/list?user_id=...` (lista assets salvos por usuário).
- `POST /api/ai/fashion/background-studio` (assistência por Google AI para prompt/paleta/sugestão de fundo).

## 3) Fluxo de funcionamento (fim a fim)
1. O modal abre recebendo `value` e `previewCardData`.
2. `value` é normalizado em `draft` (`resolveOutfitBackgroundForRender`).
3. Usuário edita via tabs (`Color`, `Gradient`, `AI Artwork`) + controles de material/presets.
4. O preview (`OutfitCard`) usa `draft` em tempo real.
5. Se houver geração AI, as variações retornadas entram em `aiResults`; clicar em uma variação aplica no `draft`.
6. `Save asset` persiste a variação selecionada via `/api/artwork-studio/save`.
7. `Save Background` e `Apply to Card` disparam `onApply(draft)`.

## 4) Tabs principais

## 4.1) Tab **Color**
- Define `background_mode: 'solid'`.
- Permite:
  - escolher por swatches (`COLOR_SWATCHES`),
  - selecionar por color picker (`input type=color`),
  - reutilizar cores recentes (`recentColors`).
- Cada escolha atualiza `draft.solid_color`.

## 4.2) Tab **Gradient**
- Define `background_mode: 'gradient'`.
- Permite:
  - tipo do gradiente (`linear`, `radial`, `conic`),
  - ângulo,
  - intensidade,
  - stops (até 3 no fluxo do modal),
  - randomização rápida,
  - presets de gradiente (`SEGMENTED_GRADIENT_OPTIONS`).
- Atualiza `draft.gradient` e, dependendo da ação, `draft.shape`.

## 4.3) Tab **AI Artwork**
- Define `background_mode: 'ai_artwork'` quando aplica variação/imagem.
- Controles principais:
  - prompt (`aiPrompt`),
  - style preset (`aiStylePreset`),
  - palette mode (`aiPaletteMode`),
  - geometry family (`aiGeometry`),
  - composition type (`aiCompositionType`),
  - contrast (`aiContrast`),
  - color intent (`aiColorIntent`),
  - safe area (`aiSafeArea`),
  - generation mode (`aiGenerationMode`),
  - imagem de referência (upload / curada).
- Ação “generate” chama `/api/artwork-studio/generate` com `variationCount: 6`.
- O resultado populariza `aiResults`; cada miniatura é clicável e aplica no `draft`.

## 5) Botões e ações do modal

### Cabeçalho
- **Close ✕**: fecha o modal (`onClose`), sem aplicar automaticamente.

### Tabs
- **Color / Gradient / AI Artwork**: alternam `activeTab` e ajustam `draft.background_mode` via `switchTab`.

### Bloco AI
- **Generate / Generate AI background**: chama geração de variações no endpoint principal de artwork.
- **Google AI (assist)**: chama `/api/ai/fashion/background-studio` e converte resposta em gradiente fallback.
- **Apply to outfit card** (na área AI): aplica o `draft` atual no cartão pai.
- **Save asset**: persiste a variação selecionada no backend (`/api/artwork-studio/save`).

### Rodapé
- **Cancel / Close**: fecha modal.
- **Reset**: restaura `DEFAULT_BACKGROUND`.
- **Save Background**: aplica configuração ao pai (`onApply(draft)`) sem fechar necessariamente por regra externa.
- **Apply to Card · {shape}**: aplica com destaque de ação primária.

## 6) Selects e listas: o que cada seleção faz

### 6.1) `Selected shape`
Atualiza `draft.shape` com um dos valores:
`none`, `orb`, `diamond`, `mesh`, `stars`, `circles`, `triangles`, `waves`, `beams`, `flowers`, `arrows`.

### 6.2) `Gradient picker`
Combina fontes diferentes numa única lista:
- Presets de gradiente segmentado (`SEGMENTED_GRADIENT_OPTIONS`);
- opção **Flower** (surface artwork floral via data URI SVG);
- imagens curadas (`CURATED_IMAGE_PICKER_OPTIONS`).

Comportamento:
- Se selecionar preset de gradiente: aplica gradiente e shape (ou preserva modo AI conforme regra de estado).
- Se selecionar **Flower**: força `ai_artwork` com imagem floral e `shape: 'flowers'`.
- Se selecionar `image:*`: força `ai_artwork` com imagem curada.

### 6.3) `Material Type`
Escolhe preset têxtil (`MATERIAL_PRESETS`), podendo ser `none` ou premium. Quando ativo, popula camadas de material no `draft`.

### 6.4) `Apply Scope`
Define escopo da textura:
- `card` (cartão inteiro),
- `hero_block`,
- `content_block`.

### 6.5) `Thread Direction`
Direção da trama:
- `cross`, `diagonal`, `horizontal`, `vertical`.

### 6.6) `Matte / Satin Finish`
Define acabamento óptico da textura (`matte` ou `satin`).

### 6.7) Presets recomendados
Lista dinâmica (`recommendedPresets`) com disponibilidade contextual:
- pode exigir logo de marca ou imagem de referência upload;
- mostra badge de estado (`Ready`, `AI enhanced`, ou bloqueio com motivo);
- ao clicar aplica composição/predefinição procedural no `draft`.

## 7) Sliders / barras: o que aumenta e diminui

### 7.1) Sliders de gradiente
- **Angle**: gira orientação do gradiente.
- **Intensity**: reforça/atenua contraste energético do gradiente.
- **Stop positions**: move pontos de transição entre cores.

### 7.2) Sliders de material
- **Fabric Density** (`10..140`): aumenta/reduz densidade visual da trama.
- **Thread Thickness** (`0.4..5`, step `0.1`): engrossa/afina fio aparente.
- **Emboss Intensity** (`0..100`): relevo/volume da superfície.
- **Surface Contrast** (`0..100`): separação tonal entre áreas da textura.

## 8) Controles binários e campos auxiliares
- **Safe Area Mode** (AI): prioriza área segura para legibilidade de conteúdo.
- **Stitch Border On/Off**: ativa borda de costura decorativa.
- **Stitch Color**: define cor da costura.
- **Upload de referência**: adiciona `referenceImageUrl` ao pipeline de geração (limitado por tamanho no envio).

## 9) APIs e endpoints (detalhes)

## 9.1) `POST /api/artwork-studio/generate`
- Entrada: `GenerateArtworkRequest` (alias de `ArtworkStudioInput`).
- Saída: `GenerateArtworkResponse` com `success`, `data` (`ArtworkGenerationResponse`) e `variations`.
- Erros:
  - `ServiceError` retorna status customizado;
  - falhas gerais retornam `500`.

## 9.2) `POST /api/artwork-studio/save`
- Requer: `user_id`, `input`, `variation`.
- Retorno sucesso: `201` + `asset` salvo.
- Retorno erro validação: `400` quando faltar campo obrigatório.

## 9.3) `GET /api/artwork-studio/list?user_id=...`
- Requer `user_id` query param.
- Retorna lista de assets persistidos do usuário.
- Sem `user_id`: `400`.

## 9.4) `POST /api/ai/fashion/background-studio`
- Requer `userPrompt`.
- Retorna estrutura com sugestões (prompt, paleta, cssSuggestion/backgroundType) via `googleFashionAI`.
- Em erro: resposta com `ok: false`, `fallbackUsed` e `message`.

## 10) Tipos e campos principais

### 10.1) `ArtworkStudioInput`
Campos essenciais:
- `user_id`, `prompt`, `compositionType`, `stylePreset`, `paletteMode`, `shapeLanguage`.

Campos opcionais relevantes:
- `negativePrompt`, `generationMode`, `density`, `contrastLevel`, `blurStrength`, `glowIntensity`, `layeringDepth`, `safeAreaMode`, `referenceImageUrl`, `variationCount`, `colorIntent`.

### 10.2) `ArtworkVariation`
Representa cada variação retornada:
- `variation_id`, `preview_url`, `output_url`, `provider`, metadados de modelo/job.

### 10.3) `ArtworkAsset`
Representa item salvo persistido com prompt normalizado, composição, estilo, provider e URLs finais.

## 11) Regras de preview, contraste e legibilidade
- Preview sempre acompanha o `draft` atual (render em tempo real).
- Existe recomendação de tom de texto (`light`/`dark`) baseada em luminância da cor dominante.
- Quando fundo sólido está muito claro, o modal exibe aviso de possível perda de legibilidade.

## 12) Observações de comportamento atual
- No fluxo Google AI, quando `backgroundType === 'image'`, a UI ainda converte para fallback híbrido e imagem pode ficar mock/fallback na camada `ai_artwork`.
- A opção `selection_tiled_motif` exige upload de imagem de referência; sem isso, geração é bloqueada com mensagem ao usuário.

## 13) Elementos gráficos e semântica visual
- **Live Preview**: mostra resultado final aplicado no `OutfitCard`.
- **Miniaturas de variação AI**: grid clicável para selecionar/aplicar resultado.
- **Swatches e color picker**: edição rápida de fundo sólido.
- **Cards de preset recomendado**: preview compacto + estado de disponibilidade.
- **Camada de material premium**: textura têxtil acima do fundo base e abaixo de overlays decorativos.

## 14) Arquitetura resumida
- UI React local mantém estado transitório (`draft`).
- Conversão para modelo final de background ocorre dentro do próprio modal.
- Endpoints específicos realizam geração/salvamento/listagem de assets.
- Serviços backend encapsulam provider e regras de negócio (com erros tipados).
