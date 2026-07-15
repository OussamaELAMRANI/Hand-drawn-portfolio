import { eq, users } from '@larevo/db'
import { verifyPassword } from '@larevo/db/password'

export default defineEventHandler(async (event) => {
  const { email, password, captchaToken } = await readValidatedBody(event, loginInput.parse)

  const captchaOk = await verifyCaptcha(captchaToken, getRequestIP(event, { xForwardedFor: true }))
  if (!captchaOk) {
    throw createError({ statusCode: 400, statusMessage: 'CAPTCHA verification failed — try again' })
  }

  const user = await useDb().query.users.findFirst({ where: eq(users.email, email) })
  if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  await createSession(event, user.id)
  return toPublicUser(user)
})
