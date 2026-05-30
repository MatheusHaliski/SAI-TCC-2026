# Scores-p-2026 — Sistema de Pontuações

Sistema de gerenciamento de pontuações com histórico, relatórios e controle de acesso por perfil.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Banco de dados | MySQL 8+ (scores_p_2026) |
| Autenticação | JWT |

## Instalação

```bash
cp .env.example .env
# Preencher .env com valores reais

mysql -u root -p < database/migrations/000_create_database_and_users.sql
mysql -u root -p scores_p_2026 < database/migrations/001_create_users.sql
mysql -u root -p scores_p_2026 < database/migrations/002_create_scores.sql
mysql -u root -p scores_p_2026 < database/migrations/003_create_security_audit_logs.sql
```

## Perfis de Acesso

| Perfil | Permissões |
|---|---|
| `user` | Visualiza apenas seus próprios scores |
| `admin` | Concede e altera scores com auditoria obrigatória |
| `auditor` | Visualiza logs e relatórios, sem alterar dados |

## Backup

```bash
./database/scripts/backup-mysql.sh
```

## Restore

```bash
./database/scripts/restore-mysql.sh <arquivo.sql.gz>
```

## Migração Pendente

Ver `database/security/migration-report.md`.
