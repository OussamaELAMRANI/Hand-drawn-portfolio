import { and, bookings, eq, googleConnections } from '@larevo/db'

// public: anyone can book a slot — this is the "hire me" contact flow, no auth
export default defineEventHandler(async (event) => {
  const { captchaToken, ...input } = await readValidatedBody(event, bookingInput.parse)
  const db = useDb()

  const captchaOk = await verifyCaptcha(captchaToken, getRequestIP(event, { xForwardedFor: true }))
  if (!captchaOk) {
    throw createError({ statusCode: 400, statusMessage: 'CAPTCHA verification failed — try again' })
  }

  const today = new Date().toISOString().slice(0, 10)
  if (input.date < today) {
    throw createError({ statusCode: 400, statusMessage: 'That date has already passed' })
  }

  const taken = await db.query.bookings.findFirst({
    where: and(
      eq(bookings.date, input.date),
      eq(bookings.slot, input.slot),
      eq(bookings.status, 'confirmed'),
    ),
  })
  if (taken) {
    throw createError({ statusCode: 409, statusMessage: 'That slot was just booked — pick another' })
  }

  let created
  try {
    ;[created] = await db.insert(bookings).values(input).returning()
  } catch (e) {
    // the app-level check above is best-effort — this DB constraint is what
    // actually protects against two people booking the same slot at once
    if (isUniqueViolation(e)) {
      throw createError({ statusCode: 409, statusMessage: 'That slot was just booked — pick another' })
    }
    throw e
  }

  // best-effort: put the meeting on the primary Google connection's calendar
  // with a Meet link — a booking still succeeds if this fails
  const primary = await db.query.googleConnections.findFirst({
    where: eq(googleConnections.isPrimary, true),
  })
  if (primary) {
    try {
      const { bookingTimezone, bookingSlotMinutes } = useRuntimeConfig()
      const startIso = zonedTimeToUtcIso(input.date, input.slot, bookingTimezone)
      const endIso = new Date(new Date(startIso).getTime() + bookingSlotMinutes * 60_000).toISOString()
      const { eventId } = await createCalendarEvent(primary, {
        summary: `Meeting with ${input.name}`,
        description: input.message ?? undefined,
        startIso,
        endIso,
        timeZone: bookingTimezone,
        attendeeEmail: input.email,
      })
      await db.update(bookings).set({ googleEventId: eventId }).where(eq(bookings.id, created!.id))
      created!.googleEventId = eventId
    } catch (e) {
      console.error(`[google] failed to create calendar event for booking ${created!.id}:`, e)
    }
  }

  const when = `${input.date} at ${input.slot}`
  await sendEmail({
    to: input.email,
    subject: 'Your meeting is booked',
    html: `<p>Hi ${input.name},</p><p>You're booked for <strong>${when}</strong>. Talk soon!</p>`,
  })
  await sendEmail({
    to: useRuntimeConfig().bookingNotifyEmail,
    subject: `New booking: ${input.name} — ${when}`,
    html: `<p><strong>${input.name}</strong> (${input.email}) booked <strong>${when}</strong>.</p>${
      input.message ? `<p>Message: ${input.message}</p>` : ''
    }`,
  })

  setResponseStatus(event, 201)
  return created
})
