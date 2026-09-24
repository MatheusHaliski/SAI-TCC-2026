# Índice de Migração — funcionarioslistaapp2025

Data de início: 2026-05-30
Responsável: Matheus Haliski

## Projeto Firebase de Origem

Todos os projetos abaixo compartilham o **mesmo projeto Firebase**: `FuncionariosListaApp2025`.
Cada projeto usa um banco Firestore distinto dentro desse projeto.

| Novo Projeto | Banco Firestore de Origem | Banco MySQL de Destino | Pasta | Status |
|---|---|---|---|---|
| FAI-TCC-2026 | `newsaidb` (FuncionariosListaApp2025) | `fai_tcc_2026` | `./FAI-TCC-2026/` | 🟡 Em andamento |
| Scores-p-2026 | `(default)` (FuncionariosListaApp2025) | `scores_p_2026` | `./Scores-p-2026/` | 🟡 Em andamento |

## Regras Gerais

1. Projeto antigo **nunca** é apagado.
2. Banco antigo **nunca** é sobrescrito.
3. Backup sempre antes de qualquer alteração destrutiva.
4. `.env` real **nunca** versionado.
5. Credenciais **nunca** expostas em código.

## Próximos Passos

- [ ] Exportar coleções do Firestore `newsaidb` para JSON (FAI-TCC-2026)
- [ ] Exportar coleções do Firestore `(default)` para JSON (Scores-p-2026)
- [ ] Identificar nomes das coleções do Scores no banco `(default)`
- [ ] Executar migrations MySQL em ambiente de produção (ambos os projetos)
- [ ] Importar dados exportados do Firestore para MySQL
- [ ] Validar contagem de registros por tabela
- [ ] Testar autenticação pós-migração
- [ ] Configurar backups automáticos (cron)

## Nota sobre Service Account

Como ambos os projetos estão no mesmo Firebase (`FuncionariosListaApp2025`),
a **mesma service account** pode ser usada para exportar os dois bancos Firestore.
A chave deve ser obtida em:
> Firebase Console → FuncionariosListaApp2025 → Configurações → Contas de serviço → Gerar nova chave privada

Salvar em `keys/serviceAccount.json` (nunca versionar — já coberto pelo `.gitignore`).

## Arquivos Sensíveis Encontrados na Raiz do Repo

| Arquivo | Risco | Ação |
|---|---|---|
| `.env` | CRÍTICO — contém 25+ credenciais reais | Nunca commitar; adicionado ao .gitignore |
| `codelab-friendlyeats-web-main` | Possível chave privada SSH | Adicionado ao .gitignore; verificar se é seguro |
| `codelab-friendlyeats-web-main.pub` | Chave pública SSH | Adicionado ao .gitignore |
| `firebase.json` | Contém múltiplos backend IDs de projetos legados | Revisar e limpar entradas obsoletas |
