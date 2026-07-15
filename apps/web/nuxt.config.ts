import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint'],
  eslint: {
    config: {
      stylistic: false, // you're using Prettier for formatting
    },
  },
  app: {
    head: {
      script: [
        {
          // apply the saved (or OS) theme before first paint to avoid a light flash
          innerHTML:
            "(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()",
          tagPosition: 'head',
        },
      ],
    },
  },
  runtimeConfig: {
    // server-only; overridden by NUXT_DATABASE_URL in .env
    databaseUrl: 'postgres://postgres:postgres@localhost:5432/larevo',
    // server-only; overridden by NUXT_SMTP_HOST — set to 'localhost' in dev to
    // route mail through the MailCatcher docker service instead of Resend
    smtpHost: '',
    // server-only; overridden by NUXT_SMTP_PORT — MailCatcher's SMTP port
    smtpPort: 1025,
    // server-only; overridden by NUXT_RESEND_API_KEY — used when smtpHost is
    // unset; booking emails no-op without either configured
    resendApiKey: '',
    // server-only; overridden by NUXT_BOOKING_FROM_EMAIL — must be on a domain
    // verified in Resend to send to arbitrary recipients (their sandbox sender
    // can only email the Resend account's own address)
    bookingFromEmail: 'Larevo Bookings <onboarding@resend.dev>',
    // server-only; overridden by NUXT_BOOKING_NOTIFY_EMAIL — who gets pinged on a new booking
    bookingNotifyEmail: 'oussama1elamrani@gmail.com',
    // server-only; overridden by NUXT_GOOGLE_CLIENT_ID / NUXT_GOOGLE_CLIENT_SECRET —
    // OAuth client from Google Cloud Console. Google Calendar sync no-ops without them
    googleClientId: '',
    googleClientSecret: '',
    // server-only; overridden by NUXT_GOOGLE_REDIRECT_URI — must exactly match an
    // authorized redirect URI on the OAuth client (e.g. http://localhost:3000/api/google/callback)
    googleRedirectUri: 'http://localhost:3000/api/google/callback',
    // server-only; overridden by NUXT_BOOKING_TIMEZONE — IANA zone used to convert
    // slot labels to real datetimes for freebusy checks and calendar events
    bookingTimezone: 'Africa/Casablanca',
    // server-only; overridden by NUXT_BOOKING_SLOT_MINUTES
    bookingSlotMinutes: 30,
    // server-only; overridden by NUXT_TURNSTILE_SECRET_KEY — verifies the
    // booking form's CAPTCHA token; verification no-ops (passes) without it,
    // matching this app's dev-convenience pattern for other optional integrations
    turnstileSecretKey: '',
    // server-only; overridden by NUXT_BOOKING_RATE_LIMIT_MAX — max booking
    // requests a single IP can make per rolling 24h window
    bookingRateLimitMax: 5,
    public: {
      // client-exposed by design (Turnstile site keys are meant to be public);
      // overridden by NUXT_PUBLIC_TURNSTILE_SITE_KEY — the CAPTCHA widget
      // doesn't render without it
      turnstileSiteKey: '',
    },
  },
  css: ['@larevo/config/fonts.css', '~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  typescript: {
    // extra strictness from @larevo/config/tsconfig/base that Nuxt doesn't set;
    // Nuxt owns the generated tsconfigs, so options go here instead of "extends"
    tsConfig: {
      compilerOptions: {
        noUncheckedIndexedAccess: true,
      },
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
})
