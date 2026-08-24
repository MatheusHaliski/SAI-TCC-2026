# `app/lib/datasources` — persistência poliglota (Ports & Adapters)

Camada que desacopla os **Services** dos **bancos de dados**. Os Services
dependem de **portas** (interfaces em `ports.ts`), nunca de um driver. Cada
store ganha um **adaptador** concreto que implementa a porta. Trocar de
tecnologia (ou de ambiente dev↔prod) é trocar o adaptador / o endpoint — o
código de domínio não muda.

```
Services ──▶ Ports (interfaces) ◀── Adapters ──▶ Driver ──▶ Store
             (este diretório)        (por store)
```

## Arquivos

| Arquivo | Papel | Dependências |
|---|---|---|
| `config.ts` | Lê o ambiente e devolve a config tipada de cada store | nenhuma |
| `ports.ts` | Interfaces: `EventBusPort`, `FeedTimelinePort`, `CounterStorePort`, `SearchIndexPort`, `ObjectStorePort` | nenhuma |
| adaptadores | Implementações concretas (adicionadas por fase) | o driver do store |

> **Fonte da verdade = MySQL** (`app/lib/db/pool.ts`). Feed, contadores e
> busca são **projeções** preenchidas por eventos (fan-out on write) e,
> portanto, **eventualmente consistentes**.

## Regra de dependências (mantém o build verde)

`config.ts` e `ports.ts` **não importam nenhum driver**, por isso já compilam
sem instalar nada. Cada adaptador só entra no repositório **junto com a
instalação da sua dependência**, para não quebrar `npm run build` /
`npm run typecheck`:

| Store | Adaptador implementa | Instalar |
|---|---|---|
| Redis | `CounterStorePort` | `npm i ioredis` |
| DynamoDB | `FeedTimelinePort` | `npm i @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb` |
| OpenSearch | `SearchIndexPort` | `npm i @opensearch-project/opensearch` |
| S3 / MinIO | `ObjectStorePort` | `npm i @aws-sdk/client-s3` |
| Vercel Blob | `ObjectStorePort` | `@vercel/blob` (já instalado) |

## Exemplo de adaptador — Redis (`CounterStorePort`)

Criar `redis/RedisCounterStore.ts` **depois** de `npm i ioredis`:

```ts
import Redis from 'ioredis';
import { loadDatasourceConfig } from '../config';
import type { CounterStorePort } from '../ports';

const { redis } = loadDatasourceConfig();
const client = new Redis(redis.url);

export class RedisCounterStore implements CounterStorePort {
  increment(key: string, delta = 1) { return client.incrby(key, delta); }
  async get(key: string) { return Number((await client.get(key)) ?? 0); }
  async cacheSet<T>(key: string, value: T, ttl = redis.cacheTtlSeconds) {
    await client.set(key, JSON.stringify(value), 'EX', ttl);
  }
  async cacheGet<T>(key: string) {
    const raw = await client.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }
  async invalidate(key: string) { await client.del(key); }
}
```

Um Service passa a receber a **porta**, não o Redis:

```ts
class PieceStatsService {
  constructor(private readonly counters: CounterStorePort) {}
  like(pieceId: string) { return this.counters.increment(`piece:${pieceId}:likes`); }
}
```

Em produção, injeta-se `RedisCounterStore`; num teste, um `InMemoryCounterStore`
que também implementa `CounterStorePort`. O Service é o mesmo.

## Credenciais AWS nos adaptadores (DynamoDB / S3)

`config.ts` deixa `accessKeyId`/`secretAccessKey` **indefinidos** quando as
variáveis não existem. Passe credenciais estáticas ao cliente **somente quando
ambas estiverem presentes** — caso contrário deixe o SDK usar a cadeia padrão
(IAM role em produção). Isto evita quebrar o acesso à AWS em produção:

```ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { loadDatasourceConfig } from '../config';

const { dynamo } = loadDatasourceConfig();
const client = new DynamoDBClient({
  region: dynamo.region,
  endpoint: dynamo.endpoint, // definido só em dev (DynamoDB Local)
  ...(dynamo.accessKeyId && dynamo.secretAccessKey
    ? { credentials: { accessKeyId: dynamo.accessKeyId, secretAccessKey: dynamo.secretAccessKey } }
    : {}), // ausentes em prod → cadeia IAM
});
```

> Em **dev**, `.env.example` já define `AWS_ACCESS_KEY_ID=local` e a tabela
> `sai_timeline` é criada automaticamente pelo serviço `dynamodb-setup` do
> `docker-compose.dev.yml` (partition key `ownerUserId`, sort key `createdAt`).

## Fan-out on write (publicar um look)

1. `SchemesRepository` (MySQL) grava o look **em transação** — fonte da verdade.
2. Service chama `EventBusPort.publish({ type: 'LookPublished', ... })`.
3. Projetores assíncronos consomem o evento:
   - `CounterStorePort` → zera/atualiza contadores e invalida cache;
   - `FeedTimelinePort.fanOut(...)` → grava na timeline de cada seguidor (DynamoDB);
   - `SearchIndexPort.index(...)` → indexa o look, se público (OpenSearch).

O usuário recebe `201 Created` após o passo 1 — nunca espera o fan-out.

Ver o plano completo em [`docs/arquitetura-persistencia-poliglota.md`](../../../docs/arquitetura-persistencia-poliglota.md).
