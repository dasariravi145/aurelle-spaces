/**
 * Aurelle Spaces — Cloudflare D1 Database Access Layer
 * 
 * Provides safe parameter-bound query execution, pagination helpers,
 * allowlisted sorting sanitization, and structured error mapping.
 */

import type { D1Database, D1Result } from "@/types/cloudflare";
import { getCloudflareEnv } from "@/lib/env";
import { DatabaseError } from "@/lib/errors/app-error";
import { logger } from "@/lib/logging/logger";
import type { PageParams, PagedResult, SortOptions } from "./types";

/**
 * Obtain the primary D1 database binding.
 * Throws a typed DatabaseError if the binding is not configured.
 */
export function getDatabase(injectedDb?: D1Database): D1Database {
  if (injectedDb) {
    return injectedDb;
  }

  const env = getCloudflareEnv();
  if (env && env.DB) {
    return env.DB;
  }

  throw new DatabaseError(
    "Cloudflare D1 Database binding 'DB' is not available in the current execution context."
  );
}

/**
 * Execute a parameter-bound query returning a single typed row or null.
 */
export async function queryOne<T>(
  db: D1Database,
  sql: string,
  ...params: unknown[]
): Promise<T | null> {
  try {
    const stmt = db.prepare(sql).bind(...params);
    const result = await stmt.first<T>();
    return result || null;
  } catch (error) {
    logger.error("D1 queryOne execution failed", { sql }, error);
    throw new DatabaseError("Database query failed while fetching a single record.", error);
  }
}

/**
 * Execute a parameter-bound query returning an array of typed rows.
 */
export async function queryAll<T>(
  db: D1Database,
  sql: string,
  ...params: unknown[]
): Promise<T[]> {
  try {
    const stmt = db.prepare(sql).bind(...params);
    const result = await stmt.all<T>();
    return result.results || [];
  } catch (error) {
    logger.error("D1 queryAll execution failed", { sql }, error);
    throw new DatabaseError("Database query failed while retrieving records.", error);
  }
}

/**
 * Execute a mutation query (INSERT, UPDATE, DELETE) with bound parameters.
 */
export async function execute(
  db: D1Database,
  sql: string,
  ...params: unknown[]
): Promise<D1Result> {
  try {
    const stmt = db.prepare(sql).bind(...params);
    return await stmt.run();
  } catch (error) {
    logger.error("D1 execute mutation failed", { sql }, error);
    throw new DatabaseError("Database mutation failed.", error);
  }
}

/**
 * Helper to build safe ORDER BY clause from an allowlist of permitted fields.
 * Prevents SQL injection via order-by column names.
 */
export function buildOrderByClause<T extends string>(
  sort: SortOptions<T> | undefined,
  allowedFields: readonly T[],
  defaultField: T,
  defaultOrder: "ASC" | "DESC" = "DESC"
): string {
  if (!sort) {
    return `ORDER BY ${defaultField} ${defaultOrder}`;
  }

  const field = allowedFields.includes(sort.field) ? sort.field : defaultField;
  const order = sort.order === "ASC" ? "ASC" : "DESC";

  return `ORDER BY ${field} ${order}`;
}

/**
 * Calculate standard limit and offset for pagination queries.
 */
export function getPaginationBounds(params?: PageParams): { limit: number; offset: number; page: number } {
  const page = Math.max(1, params?.page || 1);
  const limit = Math.min(100, Math.max(1, params?.limit || 20));
  const offset = (page - 1) * limit;

  return { limit, offset, page };
}

/**
 * Execute a paginated query returning structured page metadata and data rows.
 */
export async function queryPaged<T>(
  db: D1Database,
  countSql: string,
  dataSql: string,
  params: unknown[],
  pageParams?: PageParams
): Promise<PagedResult<T>> {
  const { limit, offset, page } = getPaginationBounds(pageParams);

  try {
    // 1. Fetch total count
    const countRow = await queryOne<{ total: number }>(db, countSql, ...params);
    const total = countRow?.total ?? 0;

    // 2. Fetch paginated data
    const pagedSql = `${dataSql} LIMIT ? OFFSET ?`;
    const data = await queryAll<T>(db, pagedSql, ...params, limit, offset);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  } catch (error) {
    logger.error("D1 queryPaged execution failed", { countSql, dataSql }, error);
    throw new DatabaseError("Failed to fetch paginated database records.", error);
  }
}

