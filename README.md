# Portfolio

Hand-drawn / sketchbook-style personal portfolio. Nuxt 4 app; the doodle UI (rough borders, stamps, terminal, polaroids, booking calendar) lives as reusable components in `packages/ui`, documented in Storybook and unit-tested with Vitest.

## Where things live

```
apps/
  web/                     # this app — Nuxt 4, routes + page composition only
    app/
      pages/
        index.vue          # hero, experience, travel, book-me sections
      composables/
        useSnippetCode.ts       # wraps packages/services/snippet
    nuxt.config.ts
    package.json

packages/
  ui/                       # presentational Vue components, colocated tests + stories
    src/
      components/
    index.ts                # public exports consumed by apps/web and apps/storybook

  services/
    booking/                # slot availability, confirmation logic
    email/                  # transactional email (booking confirmation, contact form)
    recaptcha/               # spam guard on the contact/booking form
    search/                  # (not used by portfolio, shared package)

  db/                       # Prisma — BookingRequest, ContactSubmission models
    prisma/schema.prisma

  config/
    eslint-preset/
    prettier-preset/
    tsconfig-base/
    tailwind-preset/         # design tokens: ink/paper/yellow/cyan/magenta, Patrick Hand / Caveat / Fira Code
    vitest-base/
```

## Design tokens (`packages/config/tailwind-preset`)

The hand-drawn look is driven by a shared Tailwind preset so `apps/web` and `packages/ui` never disagree on color/type:

```js
// packages/config/tailwind-preset/index.js
module.exports = {
  theme: {
    extend: {
      colors: {
        paper: '#FDFDFD',
        ink: '#2A2A2A',
        'ink-soft': '#5A5A5A',
        marker: {
          yellow: '#FFD93D',
          cyan: '#4ECDC4',
          magenta: '#FF6F91',
        },
      },
      fontFamily: {
        hand: ['Patrick Hand', 'cursive'],
        script: ['Caveat', 'cursive'],
        marker: ['Permanent Marker', 'cursive'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
}
```

`apps/web/tailwind.config.ts` and `apps/storybook`'s config both extend this preset — component look-and-feel changes happen once, in `packages/config`.

## Component boundaries (`packages/ui`)

Each doodle element is its own component so it can be storyboarded and tested independently of the page:

| Component | Responsibility | Notes |
|---|---|---|
| `RoughCard` | Card with rough.js-drawn border, optional tape strip, optional passport stamp | used for experience cards, spotlight panel |
| `RoughButton` | Wobbly-border button with wiggle-on-hover | "Hire Me", CTA buttons |
| `PassportStamp` | Rotated circular stamp overlay | experience cards, travel section |
| `TerminalWindow` | Dark-mode code block with hand-drawn window controls | feature spotlight |
| `TravelPolaroid` | Taped polaroid card | travel section |
| `BookingCalendar` | Availability grid, emits `slotSelected` | wraps `packages/services/booking` for real data |

`RoughCard.spec.ts` and `BookingCalendar.spec.ts` cover logic (slot selection; stamp rotation is presentational only and doesn't need a test); every component gets a `.stories.ts` so Storybook is the living style guide for the sketchbook aesthetic.

## Booking flow (real data, not the static mock)

The static prototype hardcoded available dates. In `apps/web`, `BookingCalendar` should be wired to:

1. `packages/services/booking` — returns real availability
2. `packages/services/recaptcha` — verifies the request isn't a bot before submission
3. `packages/services/email` — sends confirmation to both parties
4. `packages/db` (Prisma) — persists the `BookingRequest`

```prisma
// packages/db/prisma/schema.prisma
model BookingRequest {
  id        String        @id @default(cuid())
  name      String
  email     String
  slot      DateTime
  status    BookingStatus @default(PENDING)
  createdAt DateTime      @default(now())
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
}
```

## Scripts

`apps/web/package.json`:

```json
{
  "name": "@repo/web",
  "private": true,
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "lint": "eslint .",
    "test": "vitest run"
  },
  "dependencies": {
    "@repo/ui": "workspace:*",
    "@repo/services": "workspace:*"
  },
  "devDependencies": {
    "@repo/config": "workspace:*"
  }
}
```

`packages/ui/package.json`:

```json
{
  "name": "@repo/ui",
  "private": true,
  "scripts": {
    "lint": "eslint .",
    "test": "vitest run",
    "build": "vue-tsc --declaration --emitDeclarationOnly"
  }
}
```

## Root `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".output/**", "dist/**", "storybook-static/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

`@repo/web`'s `build` depends on `@repo/ui`'s `build` (`^build`), so Turborepo builds the component library before the app that consumes it, and caches both independently.

## Root `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

## Common commands

```bash
pnpm install

# just the portfolio site
pnpm turbo run dev --filter=@repo/web

# just the component library + its Storybook
pnpm turbo run dev --filter=@repo/ui --filter=@repo/storybook

# everything, respecting dependency order
pnpm turbo run build

# only what changed since main
pnpm turbo run lint test --filter=...[origin/main]
```

## Notes / things to revisit

- `PassportStamp` rotation and rough.js seeds should stay deterministic (fixed `seed` prop) rather than random — otherwise Storybook snapshots and visual regression tests will be flaky.
- Once `BookingCalendar` is wired to real availability, add a Vitest case for the "no slots available" empty state — the static prototype never had to handle that.
- `packages/services/search` isn't used by the portfolio; don't pull it into `apps/web`'s bundle.