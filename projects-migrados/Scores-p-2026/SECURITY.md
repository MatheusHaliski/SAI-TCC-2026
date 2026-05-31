# SECURITY.md — Scores-p-2026

## Proteção de Credenciais
- Nunca commitar `.env` com valores reais.
- Usar `.env.example` como template.
- Chaves e tokens apenas em variáveis de ambiente seguras.

## Banco de Dados
- Aplicação usa `scores_app_user` — sem root, sem GRANT ALL.
- Backup usa `scores_backup_user` — somente leitura estrutural.
- Auditor usa `scores_auditor_user` — somente leitura.
- Backups com checksum SHA-256, armazenados fora do repositório.

## Autenticação
- Senhas hasheadas com bcrypt (fator 12+).
- `password_hash` nunca retornado na API.
- JWT com expiração de 1 hora.
- Rate limit em login: 5 tentativas por 15 minutos por IP.

## Autorização
- Scores só podem ser criados/alterados por `admin`.
- Toda alteração de pontuação registrada em `score_history`.
- Usuário comum acessa apenas seus próprios dados.
- Rotas admin exigem `role = 'admin'` + auditoria em `security_audit_logs`.

## Auditoria
Registrar em `security_audit_logs`:
- Login realizado / falha de login / logout
- Score criado / alterado / excluído
- Relatório gerado / exportado
- Tentativa de acesso negado
- Alteração de permissão

## Checklist Pré-Produção
```
[ ] .env não versionado
[ ] Usuário root não usado na aplicação
[ ] JWT com segredo forte
[ ] Rate limit em login
[ ] Logs sem dados sensíveis
[ ] Backup testado
[ ] Restore testado em ambiente de teste
[ ] Todas as rotas privadas com middleware de auth
```
