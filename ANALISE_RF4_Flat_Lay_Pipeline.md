# Análise RF4: Pipeline de Standardização de Fotos de Peças em Flat Lay

**Projeto:** FashionAI (SAI-TCC-2026)  
**Data:** 18 de setembro de 2026  
**Requisito Funcional:** RF4 — Adicionar uma nova peça de roupa ao guarda-roupa por fotografia e formulário

---

## 1. Diagnóstico do Problema Atual

### Estado Atual
- Sistema realiza apenas **remoção de fundo** (background removal)
- Não aplica nenhuma normalização de imagem
- Não padroniza posicionamento, iluminação ou perspectiva
- Resultado: fotos heterogêneas com qualidade inconsistente

### Impacto
- **Experiência do usuário:** Looks criados com peças de qualidades visuais diferentes
- **Fidelidade visual:** Renderização irregular no provador virtual 2D
- **Busca visual:** Índices OpenSearch com qualidade inconsistente
- **E-commerce:** Imagens não seguem padrão profissional de marketplace

### Requisito: "Flat Lay Perfeitamente Composto"
Um flat lay profissional deve atender:
- ✅ **Fundo neutro e uniforme** (branco, cinza ou transparente)
- ✅ **Perspectiva padronizada** (vista frontal ou levemente angular)
- ✅ **Iluminação consistente** (sem sombras agressivas, distribuição uniforme)
- ✅ **Exposição otimizada** (brilho e contraste adequados)
- ✅ **Cores precisas** (sem color shift, fidelidade ao original)
- ✅ **Posicionamento alinhado** (centro, margens simétricas)
- ✅ **Detalhes visíveis** (texturas, padrões legíveis)
- ✅ **Dimensões padronizadas** (resolução consistent)

---

## 2. Três Abordagens Propostas

### Opção A: Pipeline Híbrido com APIs Especializadas (⭐ RECOMENDADO)

**Arquitetura:**
```
Upload Bruto 
  ↓
[Etapa 1] Remoção de Fundo → Rembg.com / Remove.bg
  ↓
[Etapa 2] Correção Perspectiva → OpenCV (Local)
  ↓
[Etapa 3] Normalização Cores → Cloudinary / PIL (Local)
  ↓
[Etapa 4] Posicionamento Flat Lay → Canvas 2D (Local)
