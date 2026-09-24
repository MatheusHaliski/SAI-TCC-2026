# SECURITY.md — FAI-TCC-2026

Política de segurança e proteção de dados do projeto Fashion AI / StylistAI.

## 1. Proteção de Credenciais

- **Nunca** commitar `.env`, `.env.local`, `.env.production` ou qualquer arquivo com valor real de variável de ambiente.
- **Sempre** usar `.env.example` com nomes de variáveis e sem valores.
- Chaves de service account (`serviceAccount*.json`, `firebase-adminsdk*.json`) são confidenciais e nunca devem ser versionadas.
- Tokens de API (Gemini, Meshy, FASHN, Remove.bg, Resend, etc.) devem existir apenas em variáveis de ambiente seguras.
- Em CI/CD, usar secrets gerenciados pela plataforma (GitHub Actions Secrets, Cloud Run environment, etc.).

## 2. Regras de .env

- `.env` real: apenas em máquina local ou ambiente de produção seguro.
- `.env.example`: sempre atualizado com todas as variáveis necessárias, sem valores.
- Usar ferramentas como Doppler, AWS Secrets Manager, GCP Secret Manager ou similar em produção.

## 3. Regras de Backup

- Backups de banco de dados são gerados fora do repositório Git.
- A pasta `database/backups/` está no `.gitignore`.
- Backups devem ser armazenados em storage seguro (S3, GCS) com acesso restrito.
- Todo backup deve ter checksum SHA-256 gerado e verificado antes de restauração.
- Backups de produção nunca são restaurados automaticamente — sempre exigem confirmação manual.
- Reter mínimo 7 dias de backups diários e 4 semanas de backups semanais.

## 4. Regras de Acesso ao Banco

- A aplicação nunca usa o usuário `root` do MySQL.
- Usuário da aplicação: `fai_app_user` — permissões: `SELECT, INSERT, UPDATE, DELETE` apenas.
- Usuário de backup: `fai_backup_user` — permissões: `SELECT, LOCK TABLES, SHOW VIEW, TRIGGER` apenas.
- Usuário auditor: `fai_auditor_user` — permissão: `SELECT` apenas.
- Senhas de banco com mínimo de 20 caracteres, geradas aleatoriamente.
- Conexão com TLS/SSL quando o ambiente permitir (`FAI_DB_SSL=true` em produção).

## 5. Regras de Autenticação

- Senhas de usuário hasheadas com bcrypt (fator 12+) ou Argon2.
- `password_hash` nunca retornado em respostas de API.
- Tokens JWT assinados com segredo forte (mínimo 256 bits).
- Tokens com expiração máxima de 1 hora. Refresh token com expiração de 7 dias.
- Sessão invalidada no logout (cookie removido + token revogado no banco).
- Rate limit em endpoints de login: máximo 5 tentativas em 15 minutos por IP.
- Firebase Auth como camada primária de autenticação.

## 6. Regras de Autorização

- Cada usuário acessa apenas dados vinculados ao próprio `user_id`.
- Exceção: usuários com `role = 'admin'` — mas com auditoria obrigatória.
- Rotas privadas exigem token válido em TODAS as requisições.
- Middleware de autorização aplicado globalmente nas rotas `/api/**` (exceto rotas públicas explícitas).
- Outfits privados (`visibility = 'private'`) acessíveis apenas pelo proprietário.
- Fotos privadas (`is_private = true`) inacessíveis por outros usuários.

## 7. Regras de Logs

- Logs de aplicação não devem conter senhas, tokens, chaves de API ou dados pessoais sensíveis.
- Logs de erro devem registrar mensagem e stack trace, sem dados de credenciais.
- Eventos de segurança registrados em `security_audit_logs` (ver migration 006).
- Logs de produção enviados para serviço centralizado (Cloud Logging, Datadog, etc.).

## 8. Regras de Deploy

- Nunca fazer deploy com `NODE_ENV=development` em produção.
- Variáveis de ambiente de produção gerenciadas pelo provedor de hosting (Firebase App Hosting, Vercel, etc.).
- Revisão de código obrigatória antes de merge para branch principal.
- Scan de segredos no código (git-secrets, truffleHog ou similar) configurado no CI.
- Headers de segurança obrigatórios: `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`.

## 9. CORS e Segurança de API

- `Access-Control-Allow-Origin` nunca usa `*` em produção quando há autenticação.
- Apenas domínios oficiais do frontend permitidos no CORS de produção.
- Rate limiting em endpoints sensíveis (login, upload, AI).
- Limite de tamanho de upload configurado (máximo 10MB por arquivo por padrão).
- Validação de tipo de arquivo em uploads (apenas imagens: jpg, png, webp).

## 10. Checklist de Segurança antes de Produção

```
[ ] .env real não versionado
[ ] .env.example atualizado
[ ] Usuário root não usado na aplicação
[ ] Senhas de banco com 20+ caracteres
[ ] TLS/SSL ativado na conexão com banco
[ ] JWT com segredo forte (256+ bits)
[ ] Expiração de token configurada
[ ] Rate limit em login ativo
[ ] Headers de segurança configurados
[ ] CORS com domínios específicos
[ ] Logs sem dados sensíveis
[ ] Tabela de auditoria criada
[ ] Backup testado e checksum verificado
[ ] Restore testado em ambiente de teste
[ ] Scan de segredos executado no código
[ ] Todas as rotas privadas com middleware de auth
[ ] Usuário não acessa dados de outro usuário (testado)
[ ] Upload validando tipo e tamanho de arquivo
```

## Contato de Segurança

Para reportar vulnerabilidades, entre em contato com o responsável pelo projeto antes de qualquer divulgação pública.
