import { hashPassword } from './password'
import { users } from './schema'
import { createDb } from './index'

const db = createDb(
  process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/larevo',
)

const password = process.env.SEED_ADMIN_PASSWORD
if (!password) {
  console.error('SEED_ADMIN_PASSWORD is not set (add it to packages/db/.env)')
  process.exit(1)
}
const passwordHash = await hashPassword(password)

const [admin] = await db
  .insert(users)
  .values({
    email: 'oussama1elamrani@gmail.com',
    name: 'Oussama ELAMRANI',
    role: 'admin',
    passwordHash,
  })
  .onConflictDoUpdate({ target: users.email, set: { role: 'admin', passwordHash } })
  .returning({ id: users.id, email: users.email, role: users.role })

console.log('admin user ready:', admin)
process.exit(0)
