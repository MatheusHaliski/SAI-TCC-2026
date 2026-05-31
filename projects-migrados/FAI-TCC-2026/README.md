# FAI-TCC-2026 — Fashion AI / StylistAI

Guarda-roupa virtual inteligente com provador 2D/3D, criação de outfits com IA e histórico de vestimenta.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS |
| Backend | Next.js API Routes, Firebase Admin SDK |
| Banco de dados | MySQL 8+ (fai_tcc_2026) + Firestore (migração gradual) |
| Autenticação | Firebase Auth + sessão JWT assinada |
| Storage | Firebase Storage + Vercel Blob |
| IA | Google Gemini, Meshy (3D), FASHN (try-on), Remove.bg |
| 3D Pipeline | Python + Blender + RunPod |

## Instalação

```bash
# 1. Clonar o repositório
git clone <repo-url>
cd FAI-TCC-2026

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com os valores reais (nunca commitar)

# 4. Criar banco MySQL e usuários (usa senhas do .env — não executa o .sql diretamente)
./database/scripts/setup-users.sh

# 5. Executar migrations de schema
mysql -u root -p fai_tcc_2026 < database/migrations/001_create_users.sql
mysql -u root -p fai_tcc_2026 < database/migrations/002_create_brands_markets.sql
mysql -u root -p fai_tcc_2026 < database/migrations/003_create_wardrobe.sql
mysql -u root -p fai_tcc_2026 < database/migrations/004_create_outfits.sql
mysql -u root -p fai_tcc_2026 < database/migrations/005_create_photos_history.sql
mysql -u root -p fai_tcc_2026 < database/migrations/006_create_security_audit_logs.sql
```

## Desenvolvimento

```bash
npm run dev
# Acesse http://localhost:3000
```

## Produção

```bash
npm run build
npm run start
```

## Backup

```bash
# Gerar backup
./database/scripts/backup-mysql.sh

# Os arquivos serão salvos em database/backups/
# Armazene os backups fora do repositório (S3, GCS, etc.)
```

## Restaurar Backup

```bash
# Exige confirmação explícita
./database/scripts/restore-mysql.sh ./database/backups/fai_tcc_2026_backup_YYYYMMDD_HHMMSS.sql.gz
```

## Validação pós-migração

```bash
./database/scripts/verify-backup.sh
```

## Verificar conexão com banco

```bash
mysql -h $FAI_DB_HOST -u $FAI_DB_USER -p $FAI_DB_NAME -e "SELECT 1;"
```

## Verificar autenticação

Acesse `GET /api/auth/session` com cookie de sessão válido.
Deve retornar `{ ok: true, profile: { user_id, email } }`.

## Estrutura do projeto

```
FAI-TCC-2026/
├── app/                    # Next.js (frontend + API routes)
│   ├── api/                # Endpoints da API
│   ├── lib/                # Utilitários (auth, db, firebase)
│   └── (views)/            # Páginas da aplicação
├── blender-api/            # API Python para pipeline 3D
├── blender-worker/         # Worker Python para renderização
├── database/
│   ├── migrations/         # Scripts SQL de criação do banco
│   ├── backups/            # NÃO versionar backups reais
│   ├── scripts/            # backup, restore, verify
│   └── security/           # Relatório de migração
├── docs/                   # Documentação técnica
├── .env.example            # Template de variáveis (sem valores)
├── .gitignore
├── README.md
└── SECURITY.md
```

## Perfis de acesso

| Perfil | Permissões |
|---|---|
| `user` | Acessa apenas seus próprios dados |
| `admin` | Acesso administrativo com auditoria obrigatória |
| `auditor` | Leitura de logs e relatórios, sem alteração de dados |

## Migrações pendentes

Ver `database/security/migration-report.md`.
