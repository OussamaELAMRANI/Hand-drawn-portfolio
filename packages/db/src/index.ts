import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// query operators re-exported so consumers don't need a direct drizzle-orm dep
export { and, asc, desc, eq, ilike, inArray, isNull, ne, not, or, sql } from 'drizzle-orm'

export * from './schema'

export type Database = ReturnType<typeof createDb>

export function createDb(connectionString: string) {
  const pool = new Pool({ connectionString })
  return drizzle(pool, { schema })
}
