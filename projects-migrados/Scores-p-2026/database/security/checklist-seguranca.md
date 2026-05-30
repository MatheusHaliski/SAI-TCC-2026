# Checklist de Segurança — Scores-p-2026

## Migração e Preservação

- [ ] Projeto antigo (`Scores`) identificado e preservado
- [x] Novo projeto criado (`Scores-p-2026`)
- [x] Novo banco MySQL definido (`scores_p_2026`)
- [ ] Banco MySQL `scores_p_2026` criado em produção
- [ ] Usuário root removido da aplicação
- [x] Usuário específico da aplicação definido (`scores_app_user`)
- [x] Permissões mínimas definidas (SELECT, INSERT, UPDATE, DELETE)
- [x] Usuário de backup definido (`scores_backup_user`)
- [x] Usuário auditor definido (`scores_auditor_user`)

## Banco de Dados

- [x] Migrations criadas (000 a 003)
- [ ] Migrations executadas em produção
- [ ] Banco de origem do projeto Scores identificado
- [ ] Backup do banco de origem gerado
- [ ] Checksum do backup gerado
- [ ] Backup não versionado no Git
- [ ] Dados importados para MySQL
- [ ] Quantidade de registros validada
- [ ] Tabela `security_audit_logs` criada

## Autenticação e Autorização

- [ ] Autenticação revisada
- [ ] JWT com segredo forte configurado
- [ ] Expiração de token configurada
- [ ] Hash de senha validado (bcrypt fator 12+)
- [ ] Scores só alterados por `admin`
- [ ] Toda alteração de score registrada em `score_history`
- [ ] Rate limit em login configurado

## Configuração

- [x] `.env.example` criado
- [x] `.gitignore` configurado
- [ ] `.env` de produção configurado no hosting

## Documentação

- [x] `README.md` criado
- [x] `SECURITY.md` criado
- [x] `migration-report.md` criado
- [x] Scripts de backup/restore/verify criados

## Status Geral

**Scores-p-2026:** 🔴 Pendente — banco de origem não identificado neste repositório

---
_Atualizado em: 2026-05-30_
