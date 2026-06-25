import mysql, { type Pool, type PoolOptions } from "mysql2/promise";

/** Valores aceitos como parâmetros (?) de uma query preparada. */
export type SqlParam = string | number | boolean | Date | Buffer | null;

/**
 * Pool de conexões MySQL — camada de dados principal da aplicação.
 *
 * Substitui o Firestore. O Firebase passa a ser usado APENAS para
 * autenticação / controle de acesso (ver app/lib/firebaseAdmin.ts).
 *
 * Toda configuração vem de variáveis de ambiente (nunca hardcoded).
 * A aplicação NUNCA usa o usuário root — ver SECURITY.md.
 */

let pool: Pool | null = null;

function buildPoolOptions(): PoolOptions {
    const host = process.env.MYSQL_HOST;
    const user = process.env.MYSQL_USER;
    const password = process.env.MYSQL_PASSWORD;
    const database = process.env.MYSQL_DATABASE;

    if (!host || !user || !database) {
        throw new Error(
            "MySQL não configurado. Defina MYSQL_HOST, MYSQL_USER e MYSQL_DATABASE no .env."
        );
    }

    return {
        host,
        port: Number(process.env.MYSQL_PORT ?? 3306),
        user,
        password: password ?? "",
        database,
        connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT ?? 10),
        waitForConnections: true,
        queueLimit: 0,
        // Datas como string ISO em vez de Date para serializar previsível em JSON.
        dateStrings: true,
        // Nunca permitir múltiplos statements numa mesma query (anti SQL injection).
        multipleStatements: false,
        ssl:
            process.env.MYSQL_SSL === "true"
                ? { rejectUnauthorized: true }
                : undefined,
    };
}

/**
 * Retorna o pool singleton, criando-o sob demanda na primeira chamada.
 */
export function getPool(): Pool {
    if (!pool) {
        pool = mysql.createPool(buildPoolOptions());
    }
    return pool;
}

/**
 * Executa uma query parametrizada e retorna as linhas tipadas.
 * SEMPRE use placeholders (?) — nunca interpole valores na string SQL.
 *
 * @example
 *   const users = await query<UserRow>(
 *     "SELECT * FROM users WHERE email = ?",
 *     [email]
 *   );
 */
export async function query<T = Record<string, unknown>>(
    sql: string,
    params: ReadonlyArray<SqlParam> = []
): Promise<T[]> {
    const [rows] = await getPool().execute(sql, params as SqlParam[]);
    return rows as T[];
}

/**
 * Executa uma query de escrita (INSERT/UPDATE/DELETE) e retorna o
 * ResultSetHeader (insertId, affectedRows, etc.).
 */
export async function execute(
    sql: string,
    params: ReadonlyArray<SqlParam> = []
): Promise<import("mysql2").ResultSetHeader> {
    const [result] = await getPool().execute(sql, params as SqlParam[]);
    return result as import("mysql2").ResultSetHeader;
}

/**
 * Executa um conjunto de operações dentro de uma transação.
 * Faz COMMIT em caso de sucesso e ROLLBACK em caso de erro.
 *
 * @example
 *   await withTransaction(async (conn) => {
 *     await conn.execute("INSERT INTO schemes (...) VALUES (...)", [...]);
 *     await conn.execute("INSERT INTO scheme_items (...) VALUES (...)", [...]);
 *   });
 */
export async function withTransaction<T>(
    fn: (conn: mysql.PoolConnection) => Promise<T>
): Promise<T> {
    const conn = await getPool().getConnection();
    try {
        await conn.beginTransaction();
        const result = await fn(conn);
        await conn.commit();
        return result;
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}
