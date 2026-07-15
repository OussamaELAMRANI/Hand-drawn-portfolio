// booking emails styled to match the site's paper/ink notebook look — table
// layout and inline styles throughout since most email clients strip <style>
// blocks and don't support flex/grid.
const INK = '#2A2A2A'
const INK_MUTED = '#6a6a60'
const INK_FAINT = '#8a8a80'
const PAPER = '#FDFDFD'
const PAPER_SHELL = '#f2f2ea'
const BORDER = '#e3e3da'
const CYAN = '#0E93A8'
const BLUSH = '#fff7fa'
const MAGENTA = '#C0577F'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return isoDate
  return parsed.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

function infoRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:7px 0;font-size:14px;color:${INK_MUTED};width:100px;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
    <td style="padding:7px 0;font-size:15px;color:${INK};font-weight:600;vertical-align:top;">${escapeHtml(value)}</td>
  </tr>`
}

interface EmailLayoutOptions {
  preheader: string
  heading: string
  bodyHtml: string
}

function emailLayout({ preheader, heading, bodyHtml }: EmailLayoutOptions): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(heading)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${PAPER_SHELL};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <span style="display:none;font-size:1px;color:${PAPER_SHELL};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(preheader)}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${PAPER_SHELL};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:${PAPER};border:2px solid ${BORDER};border-radius:12px;">
            <tr>
              <td style="padding:26px 32px 18px;border-bottom:2px dashed ${BORDER};">
                <span style="font-size:24px;font-weight:700;color:${INK};">Oussama<span style="color:${CYAN};">. EL AMRANI</span></span>
              </td>
            </tr>
            <tr>
              <td style="padding:26px 32px 6px;">
                <h1 style="margin:0 0 18px;font-size:21px;line-height:1.3;color:${INK};">${escapeHtml(heading)}</h1>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px 26px;">
                <p style="margin:0;font-size:12px;line-height:1.5;color:${INK_FAINT};">Sent automatically from the booking form — no action needed unless something looks off.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

interface BookingConfirmationInput {
  name: string
  date: string
  slot: string
}

export function bookingConfirmationEmail({ name, date, slot }: BookingConfirmationInput): string {
  const bodyHtml = `
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${INK};">
      Hi ${escapeHtml(name)}, you're booked. Here are the details:
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:6px;">
      ${infoRow('Date', formatDate(date))}
      ${infoRow('Time', slot)}
    </table>
    <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:${INK_MUTED};">
      A calendar invite with a video call link is on its way separately. Talk soon!
    </p>
  `
  return emailLayout({
    preheader: `Your meeting on ${formatDate(date)} at ${slot} is confirmed`,
    heading: "You're booked!",
    bodyHtml,
  })
}

interface BookingNotificationInput {
  name: string
  email: string
  date: string
  slot: string
  message?: string | null
}

export function bookingNotificationEmail({ name, email, date, slot, message }: BookingNotificationInput): string {
  const messageBlock = message
    ? `<div style="padding:14px 16px;background-color:${BLUSH};border-left:3px solid ${MAGENTA};border-radius:6px;margin:18px 0;">
        <p style="margin:0;font-size:14px;line-height:1.6;color:${INK};">${escapeHtml(message)}</p>
      </div>`
    : ''

  const bodyHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:6px;">
      ${infoRow('Name', name)}
      ${infoRow('Email', email)}
      ${infoRow('Date', formatDate(date))}
      ${infoRow('Time', slot)}
    </table>
    ${messageBlock}
    <a href="mailto:${escapeHtml(email)}" style="display:inline-block;margin-top:12px;padding:10px 20px;background-color:${CYAN};color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:6px;">Reply to ${escapeHtml(name)}</a>
  `
  return emailLayout({
    preheader: `New booking from ${name} on ${formatDate(date)} at ${slot}`,
    heading: 'New booking received',
    bodyHtml,
  })
}
