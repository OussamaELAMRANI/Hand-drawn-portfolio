import { createDb, type Database } from '@larevo/db'

let db: Database | undefined

// one shared pool per server instance; auto-imported in server routes
export function useDb() {
  db ??= createDb(useRuntimeConfig().databaseUrl)
  return db
}

// Postgres unique_violation (23505) — surfaces through drizzle's cause chain
export function isUniqueViolation(error: unknown): boolean {
  return (error as { cause?: { code?: string } })?.cause?.code === '23505'
}
