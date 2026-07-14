// public: the homepage hero content — null until an admin has saved it once
export default defineEventHandler(async () => {
  const row = await useDb().query.overview.findFirst()
  return row ?? null
})
