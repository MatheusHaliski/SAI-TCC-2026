/**
 * config.ts — Configuração tipada dos data stores da arquitetura poliglota.
 *
 * Um único ponto que lê variáveis de ambiente e devolve a configuração de
 * cada store. Nenhum driver é importado aqui (zero dependências externas):
 * os adaptadores concretos (ver ./README.md) recebem estes objetos e criam
 * seus clientes. Assim dev e produção diferem SOMENTE em variáveis de ambiente.
 *
 * Fonte da verdade = MySQL (ver app/lib/db/pool.ts). Os demais stores são
 * projeções derivadas por eventos.
 */

export interface MySqlConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean;
  connectionLimit: number;
}

export interface RedisConfig {
  url: string;
  cacheTtlSeconds: number;
}

export interface DynamoConfig {
  /** Vazio em produção (usa o endpoint padrão da AWS); preenchido em dev (Local). */
  endpoint?: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  timelineTable: string;
}

export interface SearchConfig {
  node: string;
  username?: string;
  password?: string;
}

export interface ObjectStoreConfig {
  /** Vazio quando se usa Vercel Blob; preenchido para S3 / MinIO. */
  endpoint?: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  forcePathStyle: boolean;
}

export interface DatasourceConfig {
  mysql: MySqlConfig;
  redis: RedisConfig;
  dynamo: DynamoConfig;
  search: SearchConfig;
  objectStore: ObjectStoreConfig;
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  return value;
}

function optional(name: string, fallback = ''): string {
  return process.env[name] ?? fallback;
}

/** Lê o ambiente e monta a configuração de todos os stores. */
export function loadDatasourceConfig(): DatasourceConfig {
  return {
    mysql: {
      host: required('MYSQL_HOST'),
      port: Number(process.env.MYSQL_PORT ?? 3306),
      database: required('MYSQL_DATABASE'),
      user: required('MYSQL_USER'),
      password: optional('MYSQL_PASSWORD'),
      ssl: process.env.MYSQL_SSL === 'true',
      connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT ?? 10),
    },
    redis: {
      url: optional('REDIS_URL', 'redis://127.0.0.1:6379'),
      cacheTtlSeconds: Number(process.env.REDIS_CACHE_TTL_SECONDS ?? 300),
    },
    dynamo: {
      endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
      region: optional('AWS_REGION', 'us-east-1'),
      accessKeyId: optional('AWS_ACCESS_KEY_ID', 'local'),
      secretAccessKey: optional('AWS_SECRET_ACCESS_KEY', 'local'),
      timelineTable: optional('DYNAMODB_TABLE_TIMELINE', 'sai_timeline'),
    },
    search: {
      node: optional('OPENSEARCH_NODE', 'http://127.0.0.1:9200'),
      username: process.env.OPENSEARCH_USERNAME || undefined,
      password: process.env.OPENSEARCH_PASSWORD || undefined,
    },
    objectStore: {
      endpoint: process.env.S3_ENDPOINT || undefined,
      bucket: optional('S3_BUCKET', 'sai-assets'),
      accessKeyId: optional('S3_ACCESS_KEY_ID', 'minioadmin'),
      secretAccessKey: optional('S3_SECRET_ACCESS_KEY', 'minioadmin'),
      region: optional('AWS_REGION', 'us-east-1'),
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
    },
  };
}
