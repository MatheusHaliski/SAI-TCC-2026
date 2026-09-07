# Etapa 8 — Diagramas de Atividade por Requisito Funcional

Notação: Mermaid `flowchart` (renderiza no GitHub e nos artefatos). Cada diagrama traz, nas caixas de saída, o **CA** que o fluxo satisfaz — é isso que torna o diagrama verificável e não apenas ilustrativo.

Convenção de raias: `[U]` ação do usuário · `[S]` ação do sistema · `[E]` serviço externo · `◇` decisão.

---

## 1. RF10 — Copilot (recomendações por IA)

```mermaid
flowchart TD
    A([Usuário abre a aba Copilot]) --> B[S: carrega guarda-roupa e contexto conhecido]
    B --> C{Possui ≥ 3 peças?}
    C -- Não --> D[/S: explica limitação e leva ao cadastro de peças — RF10.CA04/]
    D --> Z([Fim])
    C -- Sim --> E[S: pré-preenche ocasião, humor e clima — RF10.CA01]
    E --> F[U: ajusta o contexto e solicita sugestão]
    F --> G{Cota diária disponível?}
    G -- Não --> H[/S: informa cota e horário de reposição — RF30.CA14/] --> Z
    G -- Sim --> I[S: monta prompt com catálogo do usuário]
    I --> J[E: provedor de IA]
    J --> K{Resposta em até 30 s?}
    K -- Não / erro --> L[S: circuit breaker abre] --> M[/S: recomendação por regras locais + aviso — RF10.CA05 · RNF8/] --> P
    K -- Sim --> N[S: valida que só há peças do acervo]
    N --> O{Composições válidas?}
    O -- Não --> I
    O -- Sim --> P[S: exibe 3 looks com justificativa — RF10.CA02]
    P --> Q{Ação do usuário}
    Q -- Gerar outras --> R[S: exclui as composições já vistas — RF10.CA03] --> I
    Q -- Aceitar --> S1[S: salva esquema com origem 'Copilot' — RF10.CA06]
    Q -- Sair --> Z
    S1 --> T[S: registra inferência: provedor, latência, custo — RF30.CA16] --> Z
```

---

## 2. RF13 — DNA de Estilo

```mermaid
flowchart TD
    A([Usuário acessa 'DNA de Estilo']) --> B[S: conta peças e avaliações positivas]
    B --> C{≥ 10 peças e ≥ 5 avaliações?}
    C -- Não --> D[/S: tela de progresso com o que falta — RF13.CA02/] --> Z([Fim])
    C -- Sim --> E{Já possui DNA gerado?}
    E -- Não --> F[S: exibe formulário de Identidade de Vida — RF13.CA01]
    F --> G{Usuário preenche?}
    G -- Pula --> H[S: gera apenas Camada 1 + aviso de enriquecimento — RF13.CA03]
    G -- Preenche --> I[U: informa lugares, pessoas, animais, objetos]
    I --> J[S: cifra os campos da Camada 2 em repouso — RF13.CA08 · RNF3]
    J --> K[S: calcula Camada 1 — arquétipo, paleta, silhueta, ousadia, peça ícone]
    H --> K
    K --> L[E: LLM gera a Frase de Identidade — RF30.CA04]
    L --> M[S: renderiza o Card Visual — RF13.CA04]
    E -- Sim --> N{≥ 10 novas interações desde a última geração?}
    N -- Sim --> K
    N -- Não --> M
    M --> O{Ação do usuário}
    O -- Editar vida --> P[S: regenera só a Frase; Camada 1 intacta — RF13.CA05] --> M
    O -- Configurar visibilidade --> Q[U: marca campos como privados — RF13.CA06] --> M
    O -- Compartilhar --> R[S: gera PNG com marca d'água, omitindo campos privados — RF13.CA09] --> Z
    O -- Sair --> Z
```

---

## 3. RF12 — Minhas Fotos

```mermaid
flowchart TD
    A([Usuário acessa 'Minhas Fotos']) --> B[S: carrega acervo agrupado por origem, mais recentes primeiro — RF12.CA01]
    B --> C[S: carregamento sob demanda das imagens — RF12.CA06 · RNF7]
    C --> D{Ação do usuário}
    D -- Editar --> E[S: abre o Editor Canvas 2D com a foto — RF12.CA02 → RF15] --> D
    D -- Baixar --> F[S: entrega o original sem marca d'água ao dono — RF12.CA05] --> D
    D -- Excluir 1 --> G{Foto vinculada a peça ativa?}
    G -- Sim --> H[/S: avisa que a peça ficará sem imagem — RF12.CA03/] --> I{Confirma?}
    G -- Não --> I
    I -- Não --> D
    I -- Sim --> J[S: remove a foto e o vínculo] --> D
    D -- Selecionar várias --> K[U: seleciona N fotos] --> L[/S: confirmação única informando a quantidade — RF12.CA04/]
    L --> M{Confirma?}
    M -- Não --> D
    M -- Sim --> N[S: exclui em lote] --> D
    D -- Sair --> Z([Fim])
```

---

## 4. RF8 + RF17 — Buscar/Explorar e acessar o perfil de um usuário

```mermaid
flowchart TD
    A([Usuário abre a aba Buscar]) --> B[S: feed comunitário por relevância e recência — RF8.CA01]
    B --> C{Ação}
    C -- Rolar --> D[S: paginação por cursor, sem duplicar — RF8.CA06] --> C
    C -- Buscar termo --> E[S: consulta o índice]
    E --> F[S: aplica filtro de visibilidade — RF8.CA05 · RNF1]
    F --> G{Há resultados?}
    G -- Não --> H[/S: sugere termos e conteúdos em alta — RF8.CA04/] --> C
    G -- Sim --> I[S: segmenta em Looks, Peças, Pessoas, Marcas, Celebridades — RF8.CA02]
    I --> J{Aplica filtros?}
    J -- Sim --> K[S: filtros combináveis como chips removíveis — RF8.CA03] --> I
    J -- Não --> L{Seleção}
    L -- Look ou peça --> M[S: abre o detalhe com controles sociais — RF19] --> C
    L -- Pessoa --> N[S: abre o perfil público — RF17.CA01]
    N --> O{Visibilidade permite ver publicações?}
    O -- Não --> P[/S: mostra cabeçalho e convite para seguir — RF17.CA02/] --> Q
    O -- Sim --> R[S: exibe a grade de publicações]
    R --> S1{Ação no perfil}
    S1 -- Abrir publicação --> T[S: detalhe do esquema — RF17.CA05] --> S1
    S1 -- Seguir --> Q[S: cria vínculo, atualiza contadores atomicamente, notifica — RF17.CA03] --> S1
    S1 -- Deixar de seguir --> U[S: remove vínculo, decrementa, sem notificar — RF17.CA04] --> S1
    S1 -- Voltar --> C
```

---

## 5. RF7 — Acessar peça a partir da lista de um esquema

```mermaid
flowchart TD
    A([Usuário visualiza um esquema salvo]) --> B[S: renderiza a lista de peças do esquema]
    B --> C[U: aciona uma peça da lista]
    C --> D[S: guarda o esquema de origem no contexto de navegação — RF7.CA01]
    D --> E{Peça ainda existe?}
    E -- Não --> F[/S: exibe o snapshot da publicação marcado como 'não mais disponível' — RF7.CA03/] --> J
    E -- Sim --> G{Usuário é o autor?}
    G -- Sim --> H[S: detalhe com ações de edição — RF9] --> J
    G -- Não --> I[S: detalhe público com controles sociais — RF7.CA02 · RF19.CA10]
    I --> J{Ação}
    J -- Voltar --> K[S: retorna ao esquema de origem, posição preservada] --> A
    J -- Interagir --> L[S: curtir / reagir / comentar / salvar — RF19] --> J
    J -- Sair --> Z([Fim])
```

---

## 6. RF9 — Editar os dados de um esquema de vestimenta e suas peças

```mermaid
flowchart TD
    A([Usuário aciona 'Editar esquema']) --> B{É o autor?}
    B -- Não --> C[/S: 403 e registro na auditoria — RF9.CA04 · RNF1 · RNF5/] --> Z([Fim])
    B -- Sim --> D[S: carrega nome, ocasião, descrição, visibilidade, arte e lista de peças — RF9.CA01]
    D --> E{Ação}
    E -- Remover peça --> F[S: retira do esquema; peça permanece no Closet — RF9.CA02] --> E
    E -- Adicionar peça --> G[S: anexa a peça do acervo — RF9.CA03] --> E
    E -- Editar dados de uma peça --> H[S: altera a peça no acervo e em todos os esquemas dali em diante — RF9.CA07] --> E
    E -- Melhorar com IA --> I[E: IA propõe diff] --> J[U: aceita ou recusa item a item — RF30.CA10] --> E
    E -- Sair sem salvar --> K{Há alterações pendentes?}
    K -- Sim --> L[/S: pede confirmação antes de descartar — RF9.CA06/] --> M{Confirma?}
    M -- Não --> E
    M -- Sim --> Z
    K -- Não --> Z
    E -- Salvar --> N[S: persiste e registra a data de atualização]
    N --> O{Esquema tem vínculo aprovado com marca/celebridade?}
    O -- Sim --> P[S: vínculo passa a 'revalidação pendente' e notifica a marca — RF9.CA05] --> Q
    O -- Não --> Q[S: confirma o salvamento] --> Z
```

---

## 7. RF31 — Filtros favoritar / disponível / indisponível / todos dentro de um esquema

```mermaid
flowchart TD
    A([Usuário abre um esquema ou o acervo]) --> B[S: renderiza cards com a faixa de toggles no topo — RF6.CA11 · RF31.CA07]
    B --> C{Controle acionado}
    C -- Favoritar --> D[S: alterna o favorito — independente dos demais estados — RF31.CA01]
    D --> E[S: propaga o estado a todas as telas que exibem o card] --> B
    C -- Marcar indisponível --> F[S: define estado = INDISPONÍVEL — RF31.CA02]
    F --> G[S: remove o item das opções de RF5 e RF10, mantendo-o visível com marcação] --> B
    C -- Marcar disponível --> H[S: define estado = DISPONÍVEL; item volta a ser elegível — RF31.CA03] --> B
    C -- Filtro 'todos' --> I[S: lista favoritos, disponíveis e indisponíveis sem distinção — RF31.CA04] --> B
    C -- Abrir detalhe --> J[S: navega mantendo o filtro ativo — RF31.CA05]
    J --> K[U: volta] --> B
    C -- Sair --> Z([Fim])
```

> **Regra de consistência (RF31.CA06/CA07).** *Favoritar* é um sinalizador booleano independente, desenhado como estrelinha pequena no padrão Spotify. *Disponível* e *indisponível* são estados mutuamente exclusivos — a interface nunca permite os dois ao mesmo tempo — e *indisponível* é compacto, só a letra. Os três ficam na **faixa superior** do card; **"todos" não é toggle de card**, é o filtro da lista, no header, ao lado do filtro de ocasião.

---

## 8. RF14 / RF22 — Feed de busca de marcas e de celebridades

```mermaid
flowchart TD
    A([Usuário abre a aba Marcas ou Celebridades]) --> B[S: consulta perfis com status = VALIDADO — RF14.CA01]
    B --> C{Usuário tem DNA de Estilo?}
    C -- Sim --> D[S: ordena por afinidade com o arquétipo — RF30.CA06]
    C -- Não --> E[S: ordena por mais recentes]
    D --> F[S: renderiza logo, nome, nº de vínculos e de seguidores]
    E --> F
    F --> G{Ação}
    G -- Buscar nome --> H[S: filtra por correspondência parcial — RF14.CA02] --> F
    G -- Alternar ordenação --> E
    G -- Seguir --> I[S: cria vínculo; esquemas da marca passam a aparecer no feed — RF14.CA05] --> F
    G -- Abrir perfil --> J[Ver diagrama 9]
    G -- Sair --> Z([Fim])
```

---

## 9. RF14.CA03 / RF22 — Perfil de marca ou celebridade

```mermaid
flowchart TD
    A([Usuário aciona um perfil de marca/celebridade]) --> B[S: carrega bio, catálogo e identidade visual]
    B --> C[S: busca vínculos com estado = APROVADO — RF14.CA03]
    C --> D{Há esquemas vinculados?}
    D -- Não --> E[/S: estado vazio convidando a criar um look vinculado — RF14.CA04/] --> G
    D -- Sim --> F[S: exibe a grade de esquemas com o selo verificado — RF20.CA07]
    F --> G{Ação}
    G -- Abrir esquema --> H[S: detalhe do esquema com selo e link para o perfil] --> G
    G -- Seguir --> I[S: cria vínculo de seguimento] --> G
    G -- Administrador do perfil --> J{É o administrador?}
    J -- Sim --> K[S: exibe a fila de vínculos pendentes — ver diagrama 12] --> G
    J -- Não --> G
    G -- Sair --> Z([Fim])
```

---

## 10. RF3 — Alterar dados do perfil (dados sensíveis + direitos LGPD)

```mermaid
flowchart TD
    A([Usuário acessa 'Dados pessoais']) --> B[S: exibe finalidade, base legal e prazo de retenção de cada dado — RF3.CA03 · RNF6]
    B --> C{Ação}
    C -- Alterar dado sensível --> D[/S: exige reautenticação por senha — RF3.CA01/]
    D --> E{Senha confere?}
    E -- Não --> F[/S: recusa e registra a tentativa — RNF5/] --> C
    E -- Sim --> G{O dado é o e-mail?}
    G -- Sim --> H[S: novo e-mail em 'pendente de confirmação' + aviso ao e-mail antigo — RF3.CA02] --> C
    G -- Não --> I[S: persiste cifrado em repouso — RNF3] --> C
    C -- Exportar meus dados --> J[S: gera arquivo com perfil, guarda-roupa, esquemas e DNA]
    J --> K[S: disponibiliza por link expirável — RF3.CA04 · LGPD art. 18 V] --> C
    C -- Revogar consentimento --> L[S: cessa o tratamento e registra data/hora — RF3.CA06] --> C
    C -- Ajustar visibilidade --> M[S: aplica ao feed e ao perfil público; regra do esquema prevalece se mais restritiva — RF3.CA12 · CA13] --> C
    C -- Excluir conta --> N[/S: confirmação em duas etapas/]
    N --> O{Confirmou duas vezes?}
    O -- Não --> C
    O -- Sim --> P[S: conta em carência de 30 dias e invisível na rede — RF3.CA05]
    P --> Q{Reativou dentro do prazo?}
    Q -- Sim --> C
    Q -- Não --> R[S: eliminação definitiva — LGPD art. 18 VI] --> Z([Fim])
    C -- Sair --> Z
```

> ✅ **Confrontado com o material de padrões de interface LGPD** (anexo do RNF6, arquivado em `insumos/lgpd/`). O fluxo dos direitos do titular estava correto. A fonte acrescenta quatro regras de forma, agora exigíveis:
>
> 1. **Privacy by Default** — a conta nasce privada e com todo consentimento opcional desligado (RF3.CA19); o diagrama assume esse estado inicial.
> 2. **Granularidade** — "Revogar consentimento" é sempre *por finalidade*, nunca um botão único de "revogar tudo" (RF3.CA20).
> 3. **Simetria de esforço** — revogar tem o mesmo número de passos de conceder (RF3.CA21, art. 8º, §5º).
> 4. **Exportação legível por máquina** — o nó de exportação entrega JSON, não PDF (RF3.CA24, art. 18, V).

---

## 11. RF23 — Alterar dados **não sensíveis** e preferências de interface

```mermaid
flowchart TD
    A([Usuário acessa 'Preferências']) --> B[S: carrega tema, idioma, densidade, fonte, acessibilidade]
    B --> C{Ação}
    C -- Alterar tema/idioma/densidade/fonte --> D[S: aplica imediatamente e persiste entre dispositivos — RF23.CA02] --> C
    C -- Alto contraste / reduzir animações --> E[S: aplica em todas as telas — RF23.CA05] --> C
    C -- Alterar nome de exibição, bio, avatar ou capa --> F[S: persiste SEM reautenticação — RF23.CA03] --> C
    C -- Alterar @ --> G{@ disponível?}
    G -- Não --> H[/S: recusa e sugere alternativas — RF23.CA04/] --> C
    G -- Sim --> I[S: atualiza o @ e mantém redirecionamento do antigo por 30 dias] --> C
    C -- Navegar por teclado --> J[S: foco visível em todo controle interativo — RF23.CA06 · RNF7] --> C
    C -- Sair --> Z([Fim])
```

> A distinção **RF3 × RF23** é a que elimina a ambiguidade histórica: RF3 trata do dado que identifica a pessoa (exige reautenticação, tem base legal, entra no relatório LGPD); RF23 trata do dado de vitrine e da preferência de uso (não exige reautenticação).

---

## 12. RF1.CA06–CA10 *(ex-RF27/RF28)* — Cadastrar e gerenciar perfil de marca ou celebridade

```mermaid
flowchart TD
    A([Visitante escolhe o tipo de perfil]) --> B{Tipo}
    B -- Pessoal --> C[S: cadastro comum — RF1.CA01] --> Z([Fim])
    B -- Marca --> D[U: razão social, CNPJ, nome de exibição, logotipo — RF1.CA06]
    B -- Celebridade --> E[U: nome artístico, documento de comprovação, foto oficial — RF1.CA09]
    D --> F[S: cria conta com status PENDENTE DE VALIDAÇÃO]
    E --> F
    F --> G[S: perfil NÃO aparece nos feeds RF14/RF22 e não recebe vínculos]
    G --> H[E: administrador analisa]
    H --> I{Aprovado?}
    I -- Não --> J[/S: notifica o motivo; conta permanece sem visibilidade pública/] --> Z
    I -- Sim --> K[S: status = VALIDADO — RF1.CA07]
    K --> L[S: passa a listar no feed e a ser elegível a vínculos — RF20 / RF21]
    L --> M{Ação do administrador do perfil}
    M -- Editar dados --> N[S: persiste e reflete no feed em até um ciclo de cache — RF1.CA08] --> M
    M -- Ver fila de vínculos --> O[S: lista vínculos PENDENTES]
    O --> P{Decisão}
    P -- Aprovar --> Q[S: selo verificado; esquema entra no perfil — RF20.CA03] --> R
    P -- Recusar --> S1[S: remove o selo; esquema segue publicado sem vínculo — RF20.CA04] --> R
    P -- Ignorar por 15 dias --> T[S: vínculo caduca automaticamente — RF20.CA05] --> R
    R[S: notifica autor e perfil; registra na auditoria — RF20.CA08 · RNF5] --> M
    M -- Sair --> Z
```

---

## 13. RF3.CA15–CA18 *(ex-RF26)* — Receber e gerenciar notificações

```mermaid
flowchart TD
    subgraph Produção
    A([Interação social ocorre: curtida, reação, comentário, novo seguidor, mudança de vínculo]) --> B[S: transação principal é confirmada]
    B --> C[S: publica evento de domínio — RF19.CA11]
    C --> D{Destinatário desativou esse tipo? — RF3.CA17}
    D -- Sim --> E[S: contabiliza a interação, não entrega notificação — RF19.CA12] --> F([Fim da produção])
    D -- Não --> G[S: grava a notificação na timeline do destinatário] --> F
    end
    subgraph Consumo
    H([Usuário abre a central de notificações]) --> I[S: lista da mais recente para a mais antiga, com não lidas destacadas — RF3.CA15]
    I --> J{Ação}
    J -- Abrir uma --> K[S: marca como lida e navega ao conteúdo de origem] --> I
    J -- Marcar todas como lidas --> L[S: zera o contador e propaga entre dispositivos — RF3.CA16] --> I
    J -- Preferências --> M[U: desativa tipos de notificação — RF3.CA17] --> I
    J -- Sair --> N([Fim do consumo])
    end
    O([Rotina periódica]) --> P[S: expurga notificações com mais de 90 dias, sem afetar o conteúdo — RF3.CA18]
```

---

## 14. RF18 — Provador 2D com manequim masculino/feminino

```mermaid
flowchart TD
    A([Usuário abre o Provador 2D]) --> B{Possui ≥ 1 peça?}
    B -- Não --> C[/S: orienta o cadastro de peças — RF4/] --> Z([Fim])
    B -- Sim --> D[S: carrega o manequim da última escolha — RF18.CA01]
    D --> E{Ação}
    E -- Trocar manequim (masc/fem) --> F[S: troca e memoriza a escolha] --> E
    E -- Ajustar tom de pele / porte --> G[S: salva a preferência no perfil — RF18.CA06 · RF23] --> E
    E -- Vestir uma peça --> H{Peça tem fundo removido?}
    H -- Não --> I[E: remoção de fundo sob demanda — RF30.CA08]
    I --> J{Serviço respondeu?}
    J -- Não --> K[/S: avisa que a sobreposição será aproximada — RF18.CA05 · RNF8/] --> L
    J -- Sim --> L[S: identifica a camada da peça: base, intermediária, externa, acessório]
    H -- Sim --> L
    L --> M{Já há peça nessa camada?}
    M -- Sim --> N[S: substitui e informa a troca — RF18.CA03] --> O
    M -- Não --> O[S: sobrepõe na ordem correta de camadas — RF18.CA02] --> E
    E -- Limpar --> P[/S: confirma/] --> Q{Confirma?}
    Q -- Sim --> R[S: remove todas as peças do manequim; guarda-roupa intacto — RF18.CA07] --> E
    Q -- Não --> E
    E -- Salvar como look --> S1[S: cria esquema com origem 'Provador' — RF18.CA04 · RF5] --> Z
    E -- Sair --> Z
```

---

## 15. RF17 — Visualizar perfil com as postagens de outro usuário

> Fluxo detalhado no **diagrama 4** (nós `N` a `U`). Mantido lá para não duplicar a lógica de visibilidade, que é a mesma do feed.

---

## Cobertura

| RF | Diagrama | RF | Diagrama |
|---|---|---|---|
| RF1 (ex-RF27/RF28) | 12 | RF14 / RF22 | 8 e 9 |
| RF3 — dados pessoais | 10 | RF17 | 4 |
| RF3 (ex-RF26) — notificações | 13 | RF18 | 14 |
| RF7 | 5 | RF19 | 4, 5, 7 |
| RF8 | 4 | RF20 / RF21 | 12 |
| RF9 | 6 | RF23 | 11 |
| RF10 | 1 | RF31 (ex-RF19 filtros) | 7 |
| RF12 | 3 | RF13 | 2 |

**Ainda sem diagrama de atividade** (não estavam na lista da Etapa 8, mas fecham a cobertura do board): RF2, RF4, RF5, RF6, RF11, RF15, RF16. Recomendo gerá-los no Bloco 6 do plano guiado, reutilizando o mesmo padrão.
