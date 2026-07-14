import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema/',
  out: './migrations',

  dbCredentials: {
    // matches the defaults in the root docker-compose.yml
    url: process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/larevo',
  },
})
