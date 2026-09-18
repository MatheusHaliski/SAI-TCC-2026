# HU-RF4 – Adicionar Peça de Roupa ao Guarda-Roupa

**Como**: usuário autenticado no sistema  
**Posso**: adicionar uma nova peça de roupa ao meu guarda-roupa virtual preenchendo um formulário e anexando uma fotografia  
**Para**: manter meu catálogo pessoal de roupas atualizado e disponível para a criação de looks

---

## 📋 Campos Obrigatórios & Metadados de Monitoramento

### **CAMPOS DO FORMULÁRIO (Entrada do Usuário)**

**Identificação e Categorização:**
- `name` (string, obrigatório) – Nome/título da peça (ex: "Camiseta azul marinho")
- `category` (enum, obrigatório) – Categoria principal (PARTE_CIMA | PARTE_BAIXO | TENIS | ACESSORIO)
- `subcategory` (string, obrigatório) – Subcategoria específica (ex: "camiseta", "jaqueta", "calça", "bermuda", "tênis esportivo", "bolsa", "cinto", etc.)
- `sex` (enum, obrigatório - CA07) – Sexo (MASCULINO, FEMININO, UNISSEX) [alimenta RF18]
- `brandId` (UUID, opcional) – Marca (referência a Brand)

**Atributos Visuais:**
- `color` (string, obrigatório) – Cor dominante (ex: "Azul Marinho" ou hex #000080)
- `material` (enum, obrigatório) – Material (COTTON, POLYESTER, WOOL, SILK, LEATHER, SYNTHETIC, BLEND)
- `size` (string, obrigatório) – Tamanho (XS, S, M, L, XL, XXL ou tamanho numérico)

**Contexto de Uso (Taxonomias Controladas):**
- `occasion` (string[], obrigatório, máx 2) – Ocasião(ões) da peça (casual, work, business, formal, party, night_out, date, wedding, ceremony, sport, gym, travel, beach, vacation, school, university, social, home, outdoor, festival) [Sugerido por IA ou edição manual]
- `style` (string[], obrigatório, máx 2) – Estilo(s) da peça (classic, minimalist, modern, chic, streetwear, sporty, athleisure, preppy, romantic, boho, vintage, grunge, edgy, glam, luxury, avant_garde, y2k, utility, techwear, tailored, urban, resort, basic, statement, futuristic) [Sugerido por IA ou edição manual]

**Preço e Selos:**
- `price` (float, obrigatório) – Preço unitário da peça (USD)
- `seals` (string[], NOVO - sugerido) – Selos/badges sugeridos pela IA com base em style, occasion, price, category (ex: "premium", "eco-friendly", "trending", "limited-edition", "exclusive", etc.) [Sistema sugere automaticamente; usuário pode aceitar/remover]

**Mídia:**
- `imageUrl` (URL, obrigatório) – Foto da peça (JPG/PNG/WebP até 10 MB - CA01)
- `imagePath` (string) – Caminho armazenado (sistema)

### **CAMPOS DE DISPONIBILIDADE & ESTADO**

- `availability_status` (enum) – Status (AVAILABLE, UNAVAILABLE, ARCHIVED)
- `is_favorite` (boolean) – Marcado como favorito
- `for_sale` (boolean) – Disponível para venda
- `condition` (enum) – Condição (NEW, GOOD, WORN, DAMAGED)

### **CAMPOS DO SISTEMA (Gerenciados Automaticamente)**

**Identificação e Rastreamento:**
- `id` (UUID) – Identificador único
- `userId` (UUID) – ID do proprietário (FK → User)
- `createdAt` (timestamp) – Data/hora de criação
- `updatedAt` (timestamp) – Data/hora da última atualização

**Processamento de Foto (RF4 - Flat Lay - NOVO)**
- `photoProcessingStatus` (enum) – Status: NEW, PROCESSING, COMPLETED, FAILED
- `photoQualityScores` (Reference) – FK → QualityScore (avaliação da foto)
- `processingJobId` (UUID) – FK → ProcessingJob (histórico de processamento)
- `processingTimeMs` (integer) – Tempo de processamento em ms
- `flatLayMetadata` (JSON) – Metadados do processamento:
  - `background_removal_confidence`: Float (0-1)
  - `perspective_correction_applied`: Boolean
  - `color_normalization_score`: Float (0-1)
  - `composition_quality`: Float (0-1)
  - `failed_stages`: String[]
  - `retry_count`: Integer
  - `fallback_used`: Boolean (se processamento fallou, usou imagem original)

**Sugestão de Selos (IA)**
- `suggestedSeals` (string[], NOVO) – Selos sugeridos pela IA baseado em: style, occasion, price, category, material, etc.
  - Exemplos: "premium", "eco-friendly", "trending", "limited-edition", "exclusive", "budget-friendly", "luxury", "casual-chic", "professional", "activewear", etc.
  - **Processo**: IA analisa os campos de contexto e sugere automaticamente ao usuário salvar a peça

**Observações e Tags:**
- `tags` (string[]) – Tags de organização pessoal
- `notes` (string) – Anotações pessoais
- `wear_count` (integer) – Número de vezes usado (monitoramento)
- `last_worn_date` (timestamp) – Último uso (monitoramento de atividade)

### **CAMPOS ADICIONAIS DE MONITORAMENTO**

- `imageMimetype` (string) – Tipo MIME (image/jpeg, image/png, etc.)
- `imageFileSize` (long) – Tamanho da foto em bytes
- `imageHash` (string) – Hash para deduplicação
- `thumbnailUrl` (URL) – Thumbnail 300x300px (performance)
- `marketId` (UUID, opcional) – Mercado/coleção (FK → Market)
- `purchaseDate` (timestamp, opcional) – Data de compra
- `purchaseLocation` (string, opcional) – Onde foi comprado
- `sku` (string, opcional) – Código de produto
- `care_instructions` (string, opcional) – Instruções de cuidado

---

## 📊 Estrutura de Persistência

### Firestore Collection
- **Path**: `/users/{userId}/wardrobeItems`
- **Subcollections**: 
  - `processingJobs` → histórico de processamento (RF4)
  - `qualityScores` → avaliações de qualidade (RF4)

### MySQL Audit Table
- **Table**: `processing_jobs_log`
  - Registra cada processamento de foto (RF4)
  - `wardrobe_item_id`, `user_id`, `job_type`, `status`, `total_processing_time_ms`, `stage_times`, `final_quality_score`, `was_accepted`, `retry_count`, `fallback_used`, `created_at`, `completed_at`

### Redis Cache
- **Key**: `wardrobe:{userId}:items` – Lista resumida de peças
- **Key**: `wardrobe:{userId}:stats` – Estatísticas (total itens, itens favoritos, etc.)
- **TTL**: 3600s (1 hora)

### OpenSearch Index
- **Index**: `pieces_index`
- **Fields**: name, category, material, color, brand_name, owner_id, photoQualityScore, processingStatus
- **Allows**: full-text search de peças

### S3/Vercel Blob Storage
- **Path**: `/fashion-ai-assets/{userId}/clothing/{itemId}/original.{ext}`
- **Path**: `/fashion-ai-assets/{userId}/clothing/{itemId}/thumbnail.{ext}`

---

## 🔄 Fluxo de Processamento de Foto (RF4)

1. **Upload**: Usuário anexa foto (JPG/PNG/WebP até 10 MB)
2. **Validação Imediata**: Verifica formato e tamanho [FE]
3. **Armazenamento Inicial**: Salva em S3 e cria registro com `photoProcessingStatus = NEW`
4. **Fila de Processamento**: Enfileira job em ProcessingJob [BE]
5. **Pipeline Assíncrono**:
   - Background Removal (Rembg.com)
   - Perspective Correction (OpenCV)
   - Color Normalization (Cloudinary)
   - Composition (Canvas 2D)
   - Quality Validation
6. **Atualização de Status**: Muda para `COMPLETED` ou `FAILED`
7. **Qualidade Avaliada**: Se OK (score ≥ 0.6), peça fica visível em RF6/RF5; se FAILED, mostra com aviso
8. **Metadata Registrada**: Todos os campos de `flatLayMetadata` preenchidos

---

## ⚠️ Validações & Negócios

| Campo | Regra | Erro |
|-------|-------|------|
| `name` | 1-100 caracteres | "Nome deve ter entre 1 e 100 caracteres" |
| `imageUrl` | JPG/PNG/WebP, ≤10 MB | "Apenas JPG, PNG ou WebP até 10 MB" |
| `size` | Não vazio | "Tamanho é obrigatório" |
| `photoProcessingStatus` | Não pode ser vazio após salvar | Sistema auto-valida |
| `style` | Máximo 2 valores, restrito à taxonomia controlada | "Máximo 2 estilos permitidos" |
| `occasion` | Máximo 2 valores, restrito à taxonomia controlada | "Máximo 2 ocasiões permitidas" |
| `sex` | MASCULINO/FEMININO/UNISSEX | "Sexo obrigatório (alimenta Provador 2D)" |

---

## 📝 Notas Importantes

1. **RF4 Pipeline**: O processamento de foto é assíncrono; a peça aparece imediatamente no guarda-roupa, mas só fica visível em esquemas após `photoProcessingStatus = COMPLETED`
2. **Fallback**: Se o processamento falhar (ex: Rembg offline), usa a foto original com aviso
3. **Reprocessamento**: Campos `retry_count` e `fallback_used` rastreiam tentativas
4. **Cache de Thumbnail**: Gera thumbnail 300x300 para performance em listas
5. **Deduplicação**: `imageHash` impede duplicação de mesma foto

---

**Convenção de Área**: `[BE]` backend (Fastify) · `[DB]` Firestore · `[FE]` frontend (Next.js) · `[INT]` integração com API externa · `[IA]` inteligência artificial · `[QA]` testes/validação
