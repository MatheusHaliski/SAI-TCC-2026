# Relatório de Migração — FAI-TCC-2026

## Metadados

| Campo | Valor |
|---|---|
| **Projeto** | FAI-TCC-2026 (Fashion AI / StylistAI) |
| **Banco antigo** | Firestore `newsaidb` no projeto `funcionarioslistaapp2025` |
| **Banco novo** | MySQL `fai_tcc_2026` |
| **Data da migração** | ______/______/________ |
| **Responsável** | _________________________________ |

## Tabelas Migradas

| Tabela | Registros na origem | Registros no destino | Status |
|---|---|---|---|
| users | — | — | Pendente |
| user_sessions | — | — | Pendente |
| brands | — | — | Pendente |
| markets | — | — | Pendente |
| piece_items | — | — | Pendente |
| wardrobe_items | — | — | Pendente |
| outfits | — | — | Pendente |
| outfit_items | — | — | Pendente |
| outfit_cards | — | — | Pendente |
| photos | — | — | Pendente |
| wear_history | — | — | Pendente |
| security_audit_logs | — | — | Pendente |

## Backups Gerados

| Arquivo | Checksum | Data | Status |
|---|---|---|---|
| — | — | — | Pendente |

## Usuários de Banco Criados

| Usuário | Host | Permissões | Status |
|---|---|---|---|
| fai_app_user | % | SELECT, INSERT, UPDATE, DELETE | Pendente |
| fai_backup_user | localhost | SELECT, LOCK TABLES, SHOW VIEW, TRIGGER | Pendente |
| fai_auditor_user | localhost | SELECT | Pendente |

## Problemas Encontrados

- [ ] Nenhum problema identificado ainda — preencher durante a migração.

## Pendências

- [ ] Executar exportação do Firestore para JSON
- [ ] Executar script de importação Firestore → MySQL
- [ ] Validar contagem de registros por tabela
- [ ] Testar login com usuário migrado
- [ ] Testar backup no novo banco
- [ ] Testar restore em banco de teste

## Status Final

**Status:** 🔴 Pendente

---

> Este arquivo deve ser atualizado a cada etapa da migração.
> Não versionar backups reais. Armazenar em local seguro fora do repositório.
