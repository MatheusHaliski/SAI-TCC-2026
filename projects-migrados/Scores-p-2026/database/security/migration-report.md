# Relatório de Migração — Scores-p-2026

## Metadados

| Campo | Valor |
|---|---|
| **Projeto** | Scores-p-2026 |
| **Projeto Firebase de origem** | `FuncionariosListaApp2025` |
| **Banco Firestore de origem** | `(default)` |
| **Banco MySQL de destino** | `scores_p_2026` |
| **Data da migração** | ______/______/________ |
| **Responsável** | _________________________________ |

## Coleções Firestore de Origem (a confirmar)

As coleções do projeto Scores estão no banco `(default)` do Firebase `FuncionariosListaApp2025`.
Os nomes exatos precisam ser confirmados no Firebase Console antes da migração.

| Coleção Firestore (origem) | Tabela MySQL (destino) | Status |
|---|---|---|
| A confirmar | users | Pendente |
| A confirmar | user_sessions | Pendente |
| A confirmar | score_categories | Pendente |
| A confirmar | scores | Pendente |
| A confirmar | score_history | Pendente |
| A confirmar | reports | Pendente |
| — | security_audit_logs | Pendente |

## Tabelas Migradas

| Tabela | Registros na origem | Registros no destino | Status |
|---|---|---|---|
| users | — | — | Pendente |
| user_sessions | — | — | Pendente |
| score_categories | — | — | Pendente |
| scores | — | — | Pendente |
| score_history | — | — | Pendente |
| reports | — | — | Pendente |
| security_audit_logs | — | — | Pendente |

## Pendências

- [ ] Acessar Firebase Console → FuncionariosListaApp2025 → Firestore → banco `(default)`
- [ ] Listar e documentar os nomes reais das coleções do Scores
- [ ] Exportar dados do banco `(default)` para JSON (usar mesma service account do FAI)
- [ ] Mapear coleções Firestore → tabelas MySQL
- [ ] Executar migrations no novo banco
- [ ] Importar dados
- [ ] Validar contagem de registros
- [ ] Testar autenticação
- [ ] Testar backup no novo banco

## Status Final

**Status:** 🟡 Em andamento — origem identificada (`(default)` em `FuncionariosListaApp2025`), coleções a confirmar.
