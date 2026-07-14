import { createDb, type Database } from '@larevo/db'

let db: Database | undefined

// one shared pool per server instance; auto-imported in server routes
export function useDb() {
  db ??= createDb(useRuntimeConfig().databaseUrl)
  return db
}
