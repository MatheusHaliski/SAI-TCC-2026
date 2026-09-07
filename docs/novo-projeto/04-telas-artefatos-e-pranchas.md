# Etapas 6 e 7 — Vinte pranchas (RF23) e artefatos de interface otimizada

---

## Parte A — Etapa 6: as vinte pranchas

### A.1 Situação

O artefato "Vinte pranchas para as novas telas do Fashion AI" **não está acessível nesta sessão** — o conector do Trello lê cards, descrições, checklists e comentários, mas não anexos. Para a Etapa 6 avançar, o arquivo precisa ser colocado em `docs/novo-projeto/insumos/pranchas/`.

O que **pode** ser feito agora, e está feito abaixo, é montar o esqueleto de rastreabilidade: a ficha padrão de cada prancha e a lista provisória das 20 telas derivada dos RFs. Quando o artefato chegar, basta preencher as fichas — sem refazer a estrutura.

### A.2 Onde as pranchas entram: RF23

RF23 (**Gerenciar preferências de interface e dados não sensíveis**) é o requisito hospedeiro do sistema de interface. As pranchas não viram 20 CAs soltos; viram **um item de checklist por prancha** dentro de RF23, mais os CAs de comportamento já escritos (RF23.CA01–CA07). A razão: uma prancha é um *artefato de design*, não um comportamento verificável — o comportamento dela pertence ao RF da tela que ela desenha.

**Regra de ouro da Etapa 6:** cada prancha aponta para **um RF dono** e para os **CAs que ela materializa**. Prancha sem RF dono é sinal de requisito faltando; RF sem prancha é sinal de tela não desenhada.

### A.3 Ficha padrão de prancha

```markdown
### Prancha NN — <nome da tela>
- **RF dono:** RFx
- **CAs materializados:** RFx.CAnn, RFy.CAmm
- **Estados desenhados:** vazio · carregando · sucesso · erro · sem permissão
- **Componentes novos:** <lista — alimenta o design system>
- **Assets a gerar (Adobe Firefly/Express):** <texturas, fundos, ícones, ilustrações de estado vazio>
- **Divergência com o RF atual:** <o que a prancha mostra e o requisito não previa>
- **Ação:** [ ] criar CA · [ ] editar CA · [ ] remover CA · [ ] nenhuma
```

### A.4 Lista provisória das 20 telas (a reconciliar com o artefato real)

| # | Tela | RF dono | Artefato da Etapa 7 |
|---|---|---|---|
| 01 | Splash / onboarding | RF1 | — |
| 02 | Cadastro com escolha de tipo de perfil | RF1 | — |
| 03 | Login e recuperação de senha | RF2, RF3 | — |
| 04 | Home / Feed pessoal | RF8 | — |
| 05 | **Buscar / Explorar** | RF8 | **#5** |
| 06 | Perfil Lookbook — Closet Digital | RF6 | — |
| 07 | Perfil Lookbook — Looks Salvos | RF6 | — |
| 08 | Adicionar nova peça (com detecção por IA) | RF4, RF30 | — |
| 09 | **Criar Look** | RF5 | **#1** |
| 10 | **Background Studio** | RF11 | **#1** |
| 11 | Detalhe do esquema de vestimenta | RF7, RF19, RF31 | **#7** |
| 12 | Detalhe da peça de roupa | RF7, RF19, RF31 | **#7** |
| 13 | **Editar esquema** | RF9 | **#9** |
| 14 | **Copilot** | RF10 | **#2** |
| 15 | **DNA de Estilo** | RF13 | **#3** |
| 16 | **Minhas Fotos** | RF12 | **#4** |
| 17 | **Provador 2D** | RF18 | **#8** |
| 18 | Aba Marcas / Celebridades e perfil institucional | RF14, RF22 | — |
| 19 | **Dados pessoais (LGPD) e preferências** | RF3, RF23 | **#6** |
| 20 | **Central de notificações** | RF3 (ex-RF26) | **#10** |

### A.5 Assets a gerar no Adobe Firefly / Express

Gerar **só o que a prancha exigir** e sempre em duas versões (tema claro e escuro):

| Tipo | Onde | Observação |
|---|---|---|
| Fundos do Background Studio | RF11 | 8–12 texturas por categoria (liso, urbano, natureza, editorial, geométrico) |
| Ilustrações de estado vazio | RF6, RF8, RF12, RF13, RF14 | Uma por tela; sem elas o estado vazio vira tela em branco (RF8.CA04) |
| Manequins masculino e feminino | RF18 | Silhuetas neutras em SVG, com variação de tom de pele e porte (RF18.CA06) |
| Moldura do Card do DNA de Estilo | RF13 | Template SVG parametrizado, convertido em PNG no servidor |
| Selo de vínculo verificado | RF20, RF21 | Três estados: neutro (pendente), verificado, recusado |
| Ícones do footer de card | RF31 | favoritar · disponível · indisponível · todos |

> **Cuidado de licença:** anotar em `docs/novo-projeto/insumos/assets/CREDITOS.md` qual asset foi gerado por IA, com qual ferramenta e em que data. A banca pode perguntar, e a licença do Firefly exige atribuição em alguns planos.

---

## Parte B — Etapa 7: os dez artefatos de interface

Cada artefato é uma página HTML autocontida, publicada como Artifact, mostrando a **interface otimizada** da tela: layout final, todos os estados, e a lista de CAs cobertos ao pé da página. Não é protótipo navegável nem código de produção — é o artefato de especificação visual que a banca lê e que o Claude Code usa como referência ao implementar.

### Especificação comum a todos

- **Estados obrigatórios:** vazio · carregando · sucesso · erro · sem permissão.
- **Temas:** claro e escuro, com os tokens definidos em `:root` e trocados por `prefers-color-scheme` e `[data-theme]`.
- **Responsivo:** desenhado *mobile-first* (o app é móvel); a versão desktop é a adaptação.
- **Rodapé de rastreabilidade:** tabela `CA → onde na tela ele é satisfeito`.
- **Acessibilidade:** foco visível, contraste AA, alvos de toque ≥ 44 px (RF23.CA05, CA06 / RNF7).

### Artefato #1 — Aba "Criar Look" + Background Studio
- **RF:** RF5, RF11 · **CAs:** RF5.CA01–CA06, RF11.CA01–CA05, RF30.CA02, RF30.CA07
- **Layout:** três faixas — (a) Closet Digital filtrável por categoria, (b) área de composição com camadas, (c) barra de ações (nome, ocasião, visibilidade, "gerar com IA", "Background Studio").
- **Estados críticos:** menos de 2 peças (RF5.CA02); tentativa de salvar sem peça (RF5.CA06); IA indisponível (RNF8); geração de fundo em andamento (RF11.CA03).
- **Detalhe que costuma faltar:** a composição precisa mostrar a **ordem de camadas**, senão o desenho não sustenta o Provador (RF18.CA02).

### Artefato #2 — Aba "Copilot"
- **RF:** RF10 · **CAs:** RF10.CA01–CA07, RF30.CA03, RF30.CA13, RF30.CA14
- **Layout:** cabeçalho de contexto (ocasião, humor, clima) + três cards de sugestão lado a lado, cada um com justificativa de até duas frases e ações aceitar/descartar.
- **Estados críticos:** guarda-roupa insuficiente (CA04); cota esgotada (RF30.CA14); provedor fora do ar com fallback local (CA05); rodada seguinte sem repetir sugestões (CA03).
- **Detalhe:** marcar visualmente a "sugestão externa" — peça que o usuário não possui (CA07).

### Artefato #3 — Aba "DNA de Estilo"
- **RF:** RF13 · **CAs:** RF13.CA01–CA09, RF30.CA04
- **Layout:** Card Visual em destaque (arquétipo, paleta de 5 cores, silhueta, índice de ousadia, peça ícone, Frase de Identidade) + formulário de Identidade de Vida em quatro grupos com os limites da HU20 (3/3/2/4).
- **Estados críticos:** progresso quando faltam peças ou avaliações (CA02); card só com Camada 1 (CA03); alternância de visibilidade por campo (CA06); aviso de evolução do DNA (CA07).
- **Detalhe LGPD:** deixar explícito na tela que campos privados **influenciam** a frase mas **não aparecem** na exportação (CA06 + RNF6).

### Artefato #4 — Aba "Minhas Fotos"
- **RF:** RF12 · **CAs:** RF12.CA01–CA06, RF30.CA11
- **Layout:** grade por origem (peça · esquema · provador · DNA), com seleção múltipla e barra de ações contextual.
- **Estados críticos:** exclusão de foto vinculada a peça ativa (CA03); exclusão em lote com confirmação única (CA04); grupo de duplicatas sugerido pela IA (RF30.CA11).

### Artefato #5 — Aba "Buscar / Explorar"
- **RF:** RF8 · **CAs:** RF8.CA01–CA06
- **Layout:** campo de busca + chips de filtro removíveis + abas de resultado (Looks · Peças · Pessoas · Marcas · Celebridades) + grade paginada por cursor.
- **Estados críticos:** busca sem resultado com sugestões (CA04); conteúdo privado nunca listado (CA05); fim de página sem duplicar itens (CA06).

### Artefato #6 — Dados pessoais (LGPD, RF3) e dados não sensíveis (RF23)
- **RF:** RF3, RF23 · **CAs:** RF3.CA01–CA06, CA12–CA14; RF23.CA01–CA06
- **Layout:** duas seções claramente separadas — **"Meus dados"** (sensíveis; cada campo com finalidade, base legal e prazo; exige reautenticação) e **"Meu perfil e preferências"** (não sensíveis; salva direto).
- **Controles LGPD obrigatórios:** exportar meus dados · revogar consentimentos · visibilidade do perfil · excluir conta com carência de 30 dias.
- ⚠️ **Bloqueado até chegar o HTML/PDF de padrões LGPD anexo ao RNF6.** A estrutura acima está correta quanto aos direitos do titular; o que o anexo define é a *forma* (granularidade do consentimento, linguagem, hierarquia visual). Gerar o artefato antes de lê-lo produz retrabalho.

### Artefato #7 — Esquema de vestimenta e peças, com o footer de estado
- **RF:** RF7, RF19, RF31 · **CAs:** RF7.CA01–CA03, RF19.CA01–CA10, RF31.CA01–CA06
- **Base de modelagem:** parte 3 do artefato UML + `docs/design-schema-outfit-card.md` e `docs/design-schema-piece-card.md` já versionados.
- **Layout:** card do esquema (arte de fundo, nome, ocasião, autor, selo de vínculo) + lista de peças navegável (RF7.CA01) + footer social com **favoritar / disponível / indisponível / todos** + barra de reações (curtir, trend, elegante, criativo) + comentários.
- **Regra de consistência a desenhar:** *favoritar* é independente; *disponível/indisponível/todos* são exclusivos entre si (RF31.CA06).
- **Estados críticos:** peça excluída pelo autor exibida como snapshot (RF7.CA03); visitante sem permissão de edição (RF7.CA02).

### Artefato #8 — Provador 2D com manequim masculino/feminino
- **RF:** RF18 · **CAs:** RF18.CA01–CA07, RF30.CA08
- **Layout:** manequim central + seletor masc/fem + gaveta de peças por camada + controles de tom de pele e porte + ações limpar/salvar.
- **Estados críticos:** substituição de peça na mesma camada com aviso (CA03); peça sem fundo removido com aviso de aproximação (CA05); confirmação ao limpar (CA07).

### Artefato #9 — Editar os dados de um esquema
- **RF:** RF9 · **CAs:** RF9.CA01–CA07, RF30.CA10
- **Layout:** formulário com todos os campos pré-carregados + lista de peças com adicionar/remover + painel de *diff* da sugestão de IA, aceitável item a item.
- **Estados críticos:** 403 para não-autor (CA04); aviso de revalidação do vínculo com a marca (CA05); confirmação ao sair com alterações pendentes (CA06).

### Artefato #10 — Central de notificações
- **RF:** RF3 (ex-RF26) · **CAs:** RF3.CA15–CA18, RF19.CA11–CA12
- **Layout:** lista cronológica com não lidas destacadas + ação "marcar todas como lidas" + acesso às preferências por tipo.
- **Estados críticos:** lista vazia; tipo desativado (nada chega, mas a interação foi contabilizada — CA17/RF19.CA12); expurgo de itens com mais de 90 dias (CA18).

### Ordem sugerida de produção

| Onda | Artefatos | Por quê |
|---|---|---|
| 1 | #7, #1 | Card e composição são a base visual de todas as outras telas |
| 2 | #2, #3, #8 | Telas de IA — definem o padrão de "sugestão", "carregando" e "provedor fora do ar" |
| 3 | #5, #4, #9, #10 | Telas de listagem e edição, que reaproveitam os componentes das ondas 1 e 2 |
| 4 | #6 | Por último, porque depende do anexo LGPD do RNF6 |
