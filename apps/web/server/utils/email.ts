import nodemailer from 'nodemailer'

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

let smtpTransport: nodemailer.Transporter | undefined

function getSmtpTransport(host: string, port: number) {
  // one shared transport per server instance, same pattern as useDb()
  smtpTransport ??= nodemailer.createTransport({ host, port, secure: false })
  return smtpTransport
}

/** best-effort send — logs and no-ops if unconfigured, never throws (a
 *  booking shouldn't fail just because the email didn't).
 *
 *  Prefers SMTP (set NUXT_SMTP_HOST, e.g. to the MailCatcher docker service
 *  in dev) over Resend's REST API, so local dev never needs a real API key. */
export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const { smtpHost, smtpPort, resendApiKey, bookingFromEmail } = useRuntimeConfig()

  if (smtpHost) {
    try {
      await getSmtpTransport(smtpHost, smtpPort).sendMail({ from: bookingFromEmail, to, subject, html })
    } catch (e) {
      console.error(`[email] SMTP send failed for "${subject}" to ${to}:`, e)
    }
    return
  }

  if (!resendApiKey) {
    console.warn(`[email] no SMTP host or RESEND_API_KEY set — skipping "${subject}" to ${to}`)
    return
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: bookingFromEmail, to: [to], subject, html }),
    })
    if (!res.ok) console.error(`[email] failed to send "${subject}" to ${to}:`, await res.text())
  } catch (e) {
    console.error(`[email] failed to send "${subject}" to ${to}:`, e)
  }
}
