# Checklist de Segurança — FAI-TCC-2026

## Migração e Preservação

- [x] Projeto antigo (`funcionarioslistaapp2025`) preservado — não foi apagado
- [x] Novo projeto criado (`FAI-TCC-2026`)
- [x] Novo banco MySQL definido (`fai_tcc_2026`)
- [ ] Banco MySQL `fai_tcc_2026` criado em produção
- [ ] Usuário root removido da aplicação
- [x] Usuário específico da aplicação definido (`fai_app_user`)
- [x] Permissões mínimas definidas (SELECT, INSERT, UPDATE, DELETE)
- [x] Usuário de backup definido (`fai_backup_user`)
- [x] Usuário auditor definido (`fai_auditor_user`)

## Banco de Dados

- [x] Migrations criadas (000 a 006)
- [ ] Migrations executadas em produção
- [ ] Backup do banco Firestore `newsaidb` gerado
- [ ] Checksum do backup gerado e verificado
- [ ] Backup não versionado no Git
- [ ] Dados importados do Firestore para MySQL
- [ ] Quantidade de registros validada por tabela
- [ ] Tabela de auditoria `security_audit_logs` criada
- [ ] Índices críticos criados e verificados

## Autenticação e Autorização

- [ ] Autenticação revisada (Firebase Auth + sessão JWT)
- [ ] JWT com segredo forte (256+ bits) configurado
- [ ] Expiração de token configurada (1h)
- [ ] Refresh token implementado (7d)
- [ ] Hash de senha validado (bcrypt fator 12+)
- [ ] `password_hash` não retornado na API
- [ ] Rotas privadas protegidas por middleware
- [ ] Usuário não acessa dados de outro usuário (testado)
- [ ] Rate limit em login configurado (5 req/15min por IP)
- [ ] Logout remove cookie e revoga token no banco

## Configuração de Ambiente

- [x] `.env.example` criado com todas as variáveis
- [x] `.env` real ignorado pelo Git (`.gitignore` atualizado)
- [x] `.gitignore` cobre: `.env*`, `*.pem`, `*.key`, `serviceAccount*.json`, backups
- [ ] Variáveis de ambiente de produção configuradas no hosting
- [ ] Nenhuma credencial hardcoded no código

## Queries e API

- [ ] Queries SQL parametrizadas (sem concatenação)
- [ ] Endpoints sem `SELECT *` em dados sensíveis
- [ ] Soft delete implementado onde necessário
- [ ] CORS configurado com domínios específicos (não `*`)
- [ ] Headers de segurança configurados
- [ ] Limite de tamanho de upload configurado (10MB)
- [ ] Validação de tipo de arquivo em uploads (jpg, png, webp)

## Logs e Auditoria

- [ ] Logs de aplicação sem dados sensíveis (senhas, tokens, chaves)
- [ ] Eventos de segurança registrados em `security_audit_logs`
- [ ] Logs de produção enviados para serviço centralizado

## Documentação

- [x] `.env.example` criado
- [x] `README.md` criado
- [x] `SECURITY.md` criado
- [x] `migration-report.md` criado
- [x] Scripts de backup criados
- [x] Scripts de restore criados
- [x] Scripts de validação criados

## Backup e Restore

- [ ] Backup gerado e testado
- [ ] Restore testado em banco de teste (não produção)
- [ ] Checksum SHA-256 verificado no restore
- [ ] Backups armazenados fora do repositório (S3, GCS, etc.)
- [ ] Política de retenção definida (7 dias diários, 4 semanas semanais)

## Status Geral

**FAI-TCC-2026:** 🟡 Em andamento — infraestrutura criada, execução pendente

---
_Atualizado em: 2026-05-30_
