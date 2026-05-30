# Índice de Migração — funcionarioslistaapp2025

Data de início: 2026-05-30
Responsável: Matheus Haliski

## Projetos em Migração

| Projeto Antigo | Novo Projeto | Pasta | Status |
|---|---|---|---|
| Fashion AI (funcionarioslistaapp2025) | FAI-TCC-2026 | `./FAI-TCC-2026/` | 🟡 Em andamento |
| Scores | Scores-p-2026 | `./Scores-p-2026/` | 🔴 Banco de origem não identificado neste repo |

## Regras Gerais

1. Projeto antigo **nunca** é apagado.
2. Banco antigo **nunca** é sobrescrito.
3. Backup sempre antes de qualquer alteração destrutiva.
4. `.env` real **nunca** versionado.
5. Credenciais **nunca** expostas em código.

## Próximos Passos

- [ ] Exportar dados do Firestore `newsaidb` para JSON
- [ ] Executar script de importação Firestore → MySQL `fai_tcc_2026`
- [ ] Identificar repositório/banco do projeto `Scores`
- [ ] Executar migrations em ambiente de produção
- [ ] Validar contagem de registros por tabela
- [ ] Testar autenticação pós-migração
- [ ] Configurar backups automáticos (cron)

## Arquivos Sensíveis Encontrados na Raiz do Repo

| Arquivo | Risco | Ação |
|---|---|---|
| `.env` | CRÍTICO — contém 25+ credenciais reais | Nunca commitar; adicionado ao .gitignore |
| `codelab-friendlyeats-web-main` | Possível chave privada SSH | Adicionado ao .gitignore; verificar se é seguro |
| `codelab-friendlyeats-web-main.pub` | Chave pública SSH | Adicionado ao .gitignore |
| `firebase.json` | Contém múltiplos backend IDs de projetos legados | Revisar e limpar entradas obsoletas |
