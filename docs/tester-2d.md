# Tester 2D — Documentação Técnica Completa

## 1) Visão geral
O **Tester 2D** é o fluxo de prova virtual 2D da aplicação, onde o usuário seleciona um manequim e clica em uma peça do guarda-roupa para gerar uma imagem de try-on automaticamente. O comportamento atual combina:
- bootstrap de dados (manequins + peças);
- execução de pipeline externo (remove.bg + fashn.ai);
- cache local por combinação `peça::manequim`;
- persistência do resultado na coleção de wardrobe item.

## 2) Mapa de implementação

### Tela principal
- `app/views/DressTesterView.tsx`
  - controla carregamento inicial;
  - seleciona manequim e peça ativa;
  - chama APIs de bootstrap e try-on;
  - mantém preview e estados de erro/loading;
  - mantém cache local de resultados por peça/manequim.

### Componentes visuais
- `app/components/tester2d/Tester2DMannequinSelector.tsx`
  - botões para escolher o manequim.
- `app/components/tester2d/Tester2DStage.tsx`
  - palco central com imagem renderizada;
  - overlay de loading;
  - overlay de erro com botão de retry.
- `app/components/tester2d/Tester2DWardrobePanel.tsx`
  - lista de cards de peças;
  - clique dispara try-on;
  - spinner por item em processamento.

### Endpoints
- `GET /api/dress-tester/bootstrap`
- `POST /api/dress-tester/try-on-2d`

### Repositórios e serviços relacionados
- `app/lib/fashion-ai/repositories/MannequinRepository.ts` (fonte de perfis de manequim e fallback default).
- `app/lib/fashion-ai/services/MannequinFitService.ts` (cálculo de encaixe por slot/bbox/anchors).
- `app/lib/fashion-ai/services/Tester2DRenderService.ts` (composição de camadas 2D para pipeline interno de render por layer).
- `app/lib/fashion-ai/services/WardrobeImagePreparationService.ts` (preparo e inferência de fitProfile para compatibilidade com manequins).

> Observação: o fluxo da tela atual usa diretamente a API externa em `/api/dress-tester/try-on-2d`; os serviços de fit/render internos coexistem como base arquitetural para composições locais por camada e evolução de pipeline.

## 3) Fluxo funcional (fim a fim)
1. A tela abre e chama `refreshData()`.
2. `refreshData()` faz `GET /api/dress-tester/bootstrap`.
3. A resposta popula:
   - `mannequins`;
   - `pieces` (map para `Tester2DWardrobeItem`).
4. Se peça já tiver `tryOn2dResultUrl`, o valor entra no cache local (`tryOnCache`) com chave `pieceId::selectedMannequin`.
5. Usuário escolhe manequim no `Tester2DMannequinSelector`.
6. Ao trocar manequim, stage/seleções/erro são resetados.
7. Usuário clica em uma peça no `Tester2DWardrobePanel`.
8. `runTryOn(piece)`:
   - tenta cache local primeiro;
   - se não houver cache, chama `POST /api/dress-tester/try-on-2d`.
9. Em sucesso (`status=completed` + `resultImageUrl`):
   - atualiza stage;
   - grava em cache local da sessão.
10. Em erro: exibe overlay com mensagem + `Try again`.

## 4) Tela e elementos gráficos

## 4.1) Cabeçalho
- Título: `Tester 2D`.
- Subtítulo: “Automatic 2D try-on powered by external APIs”.

## 4.2) Bloco Controls
- Sub-bloco de seleção de manequim com botões (um por profile).
- Botão ativo: fundo claro + texto escuro.
- Botão inativo: borda translúcida + texto branco.

## 4.3) Bloco AI Fit Analysis
- Exibe texto de estado:
  - com peça selecionada + stage pronto: “Fit analysis available for selected piece.”
  - sem seleção/result: “Select a piece to see fit analysis”.

## 4.4) Bloco Editing Stage
- Renderiza imagem principal (`displayImageUrl` ou fallback para base do manequim).
- Estados visuais:
  - **loading**: spinner central + “Fitting garment...”;
  - **error**: card de erro com botão “Try again”.

## 4.5) Bloco Wardrobe 2D Library
- Lista vertical de peças (card clicável por item).
- Cada card mostra:
  - thumbnail da peça;
  - nome;
  - categoria (`tops`, `bottoms`, `full-body`).
- Item em processamento mostra spinner no canto.

## 5) Estado interno da página (DressTesterView)
- `loading`: estado inicial de bootstrap.
- `pieces`: inventário carregado para painel lateral.
- `mannequins`: perfis disponíveis.
- `selectedMannequin`: default `female_v1`.
- `selectedPieceId`: peça ativa na UI.
- `processingPieceId`: peça atualmente em execução.
- `stageImageUrl`: resultado atual do palco.
- `stageError`: erro a ser exibido no overlay.
- `tryOnCache`: mapa `{ "pieceId::mannequinId": "resultImageUrl" }`.

## 6) Endpoint `GET /api/dress-tester/bootstrap`

### Responsabilidade
Entregar os dados iniciais da página:
- lista de manequins;
- lista de peças do guarda-roupa com metadados mínimos para try-on.

### Fonte de dados
- Manequins: `MannequinRepository.list()`.
- Peças: coleção Firestore `sai-wardrobeItems` (`orderBy updated_at desc`, `limit 300`).

### Mapeamentos relevantes
- `pieceId` = id do documento.
- `imageUrl` = `image_url`.
- `category`:
  - contém `lower` -> `bottoms`
  - contém `full` -> `full-body`
  - caso contrário -> `tops`
- `tryOn2dResultUrl`: reaproveitado se já existir no doc.

### Tratamento de erro
- Em falha, responde `200` com arrays vazios e campo `error`.

## 7) Endpoint `POST /api/dress-tester/try-on-2d`

### Payload esperado
```json
{
  "garmentId": "...",
  "garmentImageUrl": "...",
  "garmentCategory": "tops|bottoms|full-body",
  "mannequinImageUrl": "..."
}
```

### Validação
- Se faltar qualquer campo obrigatório -> `400` com `status: error`.

### Pipeline executado
1. Normaliza URL do manequim para absoluta (`toAbsolutePublicUrl`).
2. Chama **remove.bg** para remover fundo da peça (`/v1.0/removebg`).
3. Faz upload do recorte para **Vercel Blob** (`put(...)`) em `dress-tester-temp/...png`.
4. Chama **fashn.ai** (`/v1/run`) com:
   - `model_image` = manequim;
   - `garment_image` = blob do recorte;
   - `category` = categoria da peça.
5. Recebe `predictionId` e entra em polling (`até 60s`, pausa `1500ms`).
6. Consulta status em `/v1/status/{predictionId}`.

### Saídas
- Sucesso: `status: completed` + `resultImageUrl`.
- Falha de background removal / run / status failed: `502`.
- Timeout de polling: `504`.
- Exceção geral: `500`.

### Persistência em sucesso
Ao receber `resultImageUrl`, atualiza o doc da peça em `sai-wardrobeItems`:
- `tryOn2dResultUrl`;
- `updated_at`.

## 8) Caching e performance percebida na UI
- Cache local em memória por `pieceId::mannequinId`.
- Se o usuário clicar novamente na mesma combinação, o stage atualiza instantaneamente sem nova chamada de try-on.
- Também há “pré-semente” de cache com `tryOn2dResultUrl` vindo do bootstrap.

## 9) Perfis de manequim e fallback

### Repositório
`MannequinRepository` usa coleção `fai_mannequin_profiles`.
- Se documento não existe, usa `DEFAULT_MANNEQUIN_PROFILES` (male_v1 e female_v1).
- `seedDefaults({ force? })` permite repopular coordenadas/anchors.

### Estrutura do profile
Cada manequim possui:
- `baseImageUrl`;
- `canvasWidth`, `canvasHeight`;
- slots (`top`, `bottom`, `shoes`, `full_body`, `accessory`) com `bbox` e opcionalmente `anchors`.

## 10) Serviço de fit interno (base técnica)

## 10.1) `MannequinFitService`
Calcula layer final da peça usando:
- compatibilidade peça x manequim (`isPieceCompatibleWithMannequin`);
- bbox normalizada da peça (`normalizedBBox`);
- anchors de pescoço quando disponíveis (alinhamento mais preciso do colarinho).

Resultado: `FittedGarmentLayer` com `x`, `y`, `width`, `height`, `assetUrl`, `clipMaskUrl`, `slot`.

## 10.2) `Tester2DRenderService`
Compõe stack de camadas:
1. `mannequin-base`;
2. peças por slot (`full_body` com regra de precedência sobre `top` + `bottom`).

Se houver erro de encaixe em um slot, ele faz skip desse slot e segue renderização dos demais.

## 10.3) `WardrobeImagePreparationService`
Prepara/infere `fitProfile` para peças:
- inferência de `pieceType` por nome/tipo;
- inferência de `targetGender` por tokens;
- resolução de manequins compatíveis;
- criação de `normalizedBBox`, anchors default e metadados de processamento.

## 11) Botões, ações e o que cada um faz
- **Botão de manequim (Male/Female ...)**: troca `selectedMannequin`, limpa stage e estado transitório.
- **Card de peça**: seleciona peça e dispara `runTryOn`.
- **Try again** (overlay de erro no stage): reexecuta `runTryOn` para a peça ativa.

## 12) Mensagens/estados importantes
- “Loading Tester 2D...” durante bootstrap.
- “No mannequin profiles found.” quando lista de manequins vier vazia.
- “Could not fit garment right now.” fallback de erro no front quando backend não retorna sucesso completo.

## 13) Dependências externas e variáveis de ambiente
- remove.bg (`REMOVE_BG_API_KEY`)
- fashn.ai (`FASHN_API_KEY`)
- Vercel Blob (token/configuração de ambiente para `put`)
- Firestore Admin (credenciais backend da aplicação)

Sem essas integrações, o fluxo de try-on 2D não conclui geração real.

## 14) Limitações atuais do fluxo
- Polling fixo de 60s; jobs lentos estouram timeout (`504`).
- Categoria é reduzida ao conjunto `tops|bottoms|full-body` no endpoint.
- Cache de sessão é em memória local (não persistente no navegador além da página ativa).
- A seção “AI Fit Analysis” no momento é informativa (não exibe métricas analíticas detalhadas).

## 15) Resumo arquitetural
- **Front-end**: orquestra estado, seleção e feedback visual.
- **API local**: valida payload, integra com provedores externos, persiste resultado.
- **Dados**: manequins em coleção dedicada + peças em `sai-wardrobeItems`.
- **Evolução**: serviços internos de fit/render já estruturam base para pipeline local por camadas.
