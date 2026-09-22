# RF11 — Proposta: Container Automático entre Skins Editoriais e Presets Aura

**Projeto:** FashionAI (SAI-TCC-2026)
**Requisito Funcional:** RF11 — Configurar o Visual do Card (Background Studio)
**Base:** `anatomias_card_v13.html` (container do esquema), `RF11_PROPOSTA_PRESETS_AURA_E_MATERIAIS.md`, `RF11_PROMPTS_SKINS_CARD.md`
**Complementa:** `RF11_Configurar_Visual_Card_Atividades.puml`

---

## 1. O conflito

Dois sistemas do RF11 competem pelo mesmo espaço visual sem nenhuma regra de coexistência hoje:

- **Skins de card** (`CardSkinId`: Atelier, Spread, Índice, Trading, FAI Max, Stub, Specimen) — definem tipografia, densidade de chrome e moldura própria.
- **Presets AURA / Material** (`RF11_PROPOSTA_PRESETS_AURA_E_MATERIAIS.md`) — geram arte de background, deliberadamente exuberante em vários casos (`aura_streetwear_neon` "Concrete Neon", `aura_avantgarde_cromo` "Chrome Iridescent", materiais como `laminado_metalico`).

Alguns skins já têm moldura própria absorvendo esse tipo de arte sem problema — **Trading** (moldura dupla cinza+branca), **FAI Max** (borda laranja grossa), **Stub** e **Specimen** (decoração própria: zigue-zague, papel milimetrado). Mas três skins são deliberadamente **finos** — tipografia delicada, pouca ou nenhuma moldura, conteúdo quase encostado na borda:

- **Atelier** — branco puro, Inter, hairlines
- **Spread** — editorial de magazine, título grande sobre hero full-bleed
- **Índice** — cartão de referência, linhas com líder pontilhado

Um preset Aura "exorbitante" atrás de um título Georgia fino em branco puro quebra o próprio motivo de existir do skin. É esse conflito específico que a proposta resolve.

---

## 2. A peça que faltava: o container do esquema (v13)

`anatomias_card_v13.html` formaliza um elemento de anatomia que antes só existia implícito: uma borda interna que separa, dentro do card, **o chrome social do post** (avatar, autor, data, curtidas — fora da borda) **do `ClothesScheme` em si** (fundo/composição, título, selos, preço, descrição, peças — dentro da borda). É estrutura base das três anatomias de Esquema (Lista vertical, Grade de peças, Foto hero + lista lateral) — não se aplica a Peça, que é outra entidade.

Isso já existia parcialmente no RF11 como "cor do container" (Etapa 4, opção 3) — mas era uma escolha manual, opcional, sem ligação com o skin ativo. A v13 eleva esse container a **estrutura sempre presente**; esta proposta usa essa estrutura já formalizada como o mecanismo de separação, em vez de inventar um elemento novo.

---

## 3. A regra proposta

**Container de conteúdo passa a ter uma cor e uma origem, não só uma cor.** A origem tem três valores possíveis:

| Origem | Quando | Cor do container |
|---|---|---|
| `manual` | Usuário escolheu explicitamente — seja porque o gatilho automático nunca disparou, seja porque escolheu "usar cor customizada mesmo assim" sobre um valor auto-ativado | A cor escolhida, nunca sobrescrita automaticamente depois |
| `auto` *(novo)* | Gatilho da seção 3.2 satisfeito e o usuário não sobrepôs manualmente | Travada na cor nativa do skin; recalculada se skin ou arte mudarem, **enquanto a origem continuar `auto`** |
| `desligado` | Gatilho nunca disparou e usuário nunca escolheu manualmente | Sem preenchimento próprio (comportamento herdado do background) |

A origem é o que faz o estado ser **persistente e não recalculado a cada abertura do editor** — ver seção 3.5.

*(Nota: a tabela lista três **origens** possíveis — `manual`, `auto`, `desligado` — não três estados de UI; a cor efetivamente aplicada é sempre um único valor, e a origem só decide como e quando ela é recalculada.)*

Além da origem, `ConfiguracaoContainer` ganha um segundo campo, ortogonal: `obrigatorio: Boolean`. A origem decide **quem escreveu a cor** (usuário ou sistema); `obrigatorio` decide **se essa decisão pode ser desfeita depois** por uma sobreposição futura de arte. Ver seção 3.6.

### 3.1 Classificação de família de skin

| Família | Skins | Motivo |
|---|---|---|
| **Editorial fina** | Atelier, Spread, Índice | Tipografia delicada, hairlines, pouca/nenhuma moldura própria — conteúdo fica exposto direto sobre o que estiver atrás |
| **Framed / com moldura própria** | Trading, FAI Max, Stub, Specimen | Já têm chrome grosso, decoração ou moldura dupla que absorve arte exuberante por design |

### 3.2 Gatilho

```
autoAtivarContainer =
  tipoDeCard === ESQUEMA
  AND familia(skinAtivo) === 'editorial_fina'
  AND (
    ConfiguracaoArteIA.modo ∈ { PROMPT, DIRECAO_VISUAL, PRESET_AURA }
    OR materialLayer.type !== 'none'
  )
```

Três condições, todas obrigatórias (note os parênteses em torno da alternativa modo/material — sem eles, `AND` tem precedência maior que `OR` e a expressão vira `(tipo AND skin AND modo) OR material`, que dispara o container para **qualquer** material em **qualquer** skin, inclusive Trading/FAI Max/Stub/Specimen, contradizendo a seção 3.1):

1. **`tipoDeCard === ESQUEMA`** — Peça e DNA de Estilo não têm container do esquema (v13); testar isso aqui evita instruir uma implementação a criar/modificar um container que não existe para essas entidades.
2. **Skin editorial fina** — seção 3.1.
3. **Arte exuberante** — Prompt, Direção recomendada, Preset Aura **ou** Material. Cor sólida/gradiente escolhida manualmente (Etapa 4, opção 1) **não** dispara a regra — é inerentemente mais controlada (o usuário escolhe o hex exato) e não é o alvo da reclamação original ("desenhos exorbitantes tipo aura").

### 3.3 O que acontece quando ativado

- **Dentro do container:** cor nativa do skin (Atelier → branco puro; Spread → neutro claro; Índice → branco + borda), travada — a arte com IA não pode pintar por trás do título/descrição/peças.
- **Fora do container, dentro da borda do card:** a arte com IA continua rodando livre — vira efeito de **passe-partout** (moldura/paspatur), como uma moldura de quadro: a arte exuberante emoldura o painel de conteúdo, em vez de competir com ele.
- **A trava é um default, não uma restrição definitiva.** O usuário pode abrir "3. Cor do container" e escolher "usar cor customizada mesmo assim" a qualquer momento — a regra evita o resultado ruim por padrão, sem impedir uma escolha deliberada.

### 3.4 Por que não desligar a Aura, em vez de conter o texto

Alternativa descartada: quando skin fino + preset exuberante, simplesmente **bloquear** a escolha do preset Aura. Rejeitada porque:
- Tira controle do usuário sem necessidade — o efeito passe-partout resolve o conflito sem remover a opção.
- O usuário pode *querer* exatamente esse contraste (arte ousada emoldurando um painel editorial limpo) — é um resultado legítimo, só precisa da separação estrutural para funcionar.

### 3.5 Persistência da origem (por que a cor sozinha não basta)

Guardar só a cor final não sustenta as três origens da tabela da seção 3:

- Se o usuário escolhe uma cor customizada **enquanto o gatilho continua satisfeito**, e o sistema deriva `auto` de novo a cada abertura do editor (em vez de ler uma origem persistida), a escolha customizada é perdida: a próxima abertura volta a classificar o container como automático e pré-preenche a cor nativa do skin por cima.
- Depois que skin ou arte mudam, uma cor auto-persistida fica indistinguível de uma cor manual — sem a origem, não há como saber se é seguro recalcular ou se sobrescreveria uma escolha deliberada.

Por isso `ConfiguracaoContainer` ganha um campo de origem (`auto | manual`), persistido junto com a cor. A leitura, ao reabrir "3. Cor do container", passa a ser: **origem já persistida como `manual`? Respeita — nunca reavalia o gatilho.** Só quando a origem ainda não é `manual` (nunca houve override) é que o gatilho da seção 3.2 é avaliado.

### 3.6 Container obrigatório: quando a Direção recomendada é aplicada

A ativação da seção 3.2 é **reativa** — ela é recalculada a cada mudança de skin ou de arte enquanto a origem permanecer `auto`, o que significa que ela pode **desligar** se o usuário depois trocar para um skin com moldura própria ou para uma arte não-exuberante. Isso é intencional para o caso geral (a regra deve refletir o estado atual, não um estado passado), mas cria um buraco específico: quando a IA já recomendou uma combinação Preset Aura + Material curada (seção 5 de `RF11_PROPOSTA_PRESETS_AURA_E_MATERIAIS.md`, `recommendVisualDirection`), essa combinação foi desenhada para precisar da separação do container — deixar essa proteção reversível por qualquer sobreposição futura (`+AURA`, `+material`) contradiz o motivo de ela ter sido recomendada.

```
aplicarDirecaoRecomendada() ⇒
  SE containerExisteParaEsteCard(tipoDeCard, anatomiaEscolhida):
    ConfiguracaoContainer.obrigatorio = true
    ConfiguracaoContainer.origem = 'auto'
    // cor travada na cor nativa do skin ativo no momento
```

Efeitos de `obrigatorio = true`, em ordem de precedência sobre as demais regras desta proposta:

1. **Bypassa a família do skin.** Diferente do gatilho da seção 3.2 (que só dispara para skins `editorial_fina`), o container obrigatório trava a cor nativa do skin **atual, seja qual for sua família** — inclusive Trading, FAI Max, Stub ou Specimen.
2. **Sobrescreve uma origem `manual` anterior.** É a única exceção à regra desta seção ("uma escolha manual nunca é sobrescrita silenciosamente") — não é silenciosa porque é consequência direta de uma ação explícita do usuário (aplicar a direção recomendada), não de uma reavaliação de fundo.
3. **Não é recalculado por sobreposições futuras.** Trocar de Preset Aura manualmente (`+AURA`), aplicar ou trocar um Material (`+material`), ou mesmo trocar de skin, **não desativam** `obrigatorio` nem destravam a cor. A verificação reativa da seção 3.2 continua rodando a cada sobreposição, mas só é alcançada quando `obrigatorio` ainda é `false`.
4. **Bloqueia o escape hatch de "3. Cor do container".** A opção "usar cor customizada mesmo assim" (seção 3.3) deixa de existir enquanto `obrigatorio = true` — reabrir o seletor de cor do container apenas informa que ele está travado.
5. **Não existe reset automático.** `obrigatorio` é um flag de uma via (`false → true`) dentro desta proposta — reavaliar se algum fluxo deveria zerá-lo (ex.: remover a arte gerada pela direção recomendada) fica fora de escopo aqui.

---

## 4. Mapeamento para o modelo de dados existente

Dois campos novos são necessários — a proveniência não pode ser só derivada em tempo de leitura (seção 3.5), e a obrigatoriedade não pode ser só inferida da origem (seção 3.6: um valor `auto` pode ou não ser obrigatório — a distinção é exatamente o que faz a diferença entre "reativo, pode desligar" e "travado, nunca desliga"):

- **Novo:** `ConfiguracaoContainer.origem: 'auto' | 'manual'`, persistido junto com `ConfiguracaoContainer.cor` (RF11, diagrama de classes).
- **Novo:** `ConfiguracaoContainer.obrigatorio: Boolean` (default `false`), persistido junto com `origem` e `cor`. Setado para `true` apenas por `aplicarDirecaoRecomendada()` (seção 3.6); nunca lido/gravado pelo gatilho reativo da seção 3.2, que continua operando só sobre `origem`.
- `CardSkinId` (`app/lib/outfit-card.ts`) ganha uma tabela de classificação estática `SKIN_VISUAL_FAMILY: Record<CardSkinId, 'fine' | 'framed'>` — dado estático, sem mudança de schema.
- O gatilho da seção 3.2 (`tipoDeCard`, `familia(skinAtivo)`, `ConfiguracaoArteIA.modo`, `materialLayer.type`) usa só campos já existentes — não precisa de novo estado além de `origem`. `obrigatorio` é consultado **antes** dele (seção 3.6), como um curto-circuito.
- O efeito "passe-partout" é só CSS: a arte já ocupa o background do card (`OutfitBackgroundConfig`); o container de conteúdo já é uma camada por cima (`ConfiguracaoContainer`) — a regra apenas decide, automaticamente, o preenchimento dessa camada em vez de deixá-la vazia/manual.

---

## 5. Escopo

- Aplica-se apenas a cards de **Esquema** (a única entidade que tem "container do esquema" formalizado na v13; Peça não tem esse elemento de anatomia).
- A escolha do skin ativo (Atelier/Spread/.../Specimen) ainda não está modelada no `.puml` do RF11 — é uma feature já existente no código (`selectedCardSkin`/`onSelectSkin`), documentada separadamente em `RF11_PROMPTS_SKINS_CARD.md`. Esta proposta assume o skin como um estado já definido antes de entrar em "Arte com IA", sem modelar sua própria seleção aqui.
