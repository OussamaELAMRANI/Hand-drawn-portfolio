<script setup lang="ts">
import { NuxtLink } from '#components'
import {
  CommentCode,
  SketchBox,
  Typography,
  UiArrow,
  UiBadge,
  UiButton,
  UiCard,
  UiChip,
  UiHighlight,
  UiLink,
  UiNavbar,
  UiPill,
  UiPin,
  UiTape,
  UiTerminal,
} from '@larevo/ui'
import type { BadgeVariant, TypographyVariant } from '@larevo/ui'

useHead({ htmlAttrs: { class: 'scroll-smooth' } })

const pageTitle = 'Design System — Oussama EL AMRANI'
const pageDescription =
  'A hand-drawn, notebook-style design system: the components, tokens and patterns used across this portfolio.'

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogType: 'website',
  twitterCard: 'summary_large_image',
})
defineOgImageComponent('Default', { title: pageTitle, description: pageDescription })

const { user, isAdmin, logout } = useAuth()

const navLinks = [
  { label: 'Experience', href: '/experience' },
  { label: 'Code', href: '/#code' },
  { label: 'Travels', href: '/#travels' },
  { label: 'Blog', href: '/blog' },
  { label: 'Design System', href: '/design-system', class: 'rounded-sm bg-marker px-1.5 py-0.5 -rotate-1' },
]

const toc = [
  { label: 'Colors', href: '#colors' },
  { label: 'Type', href: '#type' },
  { label: 'Buttons', href: '#buttons' },
  { label: 'Links', href: '#links' },
  { label: 'Tags', href: '#tags' },
  { label: 'Menus', href: '#menu' },
  { label: 'Inputs', href: '#inputs' },
  { label: 'Cards', href: '#cards' },
  { label: 'Terminal', href: '#terminal' },
  { label: 'Doodles', href: '#doodles' },
  { label: 'Elevation', href: '#elevation' },
]

const colors = [
  { name: 'Paper', hex: '#FDFDFD', use: 'background' },
  { name: 'Ink', hex: '#2A2A2A', use: 'primary text' },
  { name: 'Graphite', hex: '#3A3A3A', use: 'body text' },
  { name: 'Faded ink', hex: '#7A7A70', use: 'muted / captions' },
  { name: 'Marker yellow', hex: '#FCE34B', use: 'highlight · primary fill' },
  { name: 'Cyan', hex: '#0E93A8', use: 'links · accents' },
  { name: 'Sky fill', hex: '#6FD3E0', use: 'tape · secondary fill' },
  { name: 'Magenta', hex: '#C0577F', use: 'CTA · destructive · AI' },
  { name: 'Violet', hex: '#8A6BCF', use: 'category · News' },
  { name: 'Amber', hex: '#C98A2B', use: 'category · Career' },
  { name: 'Dot grid', hex: '#DCDCD4', use: 'paper texture' },
  { name: 'Terminal', hex: '#22252B', use: 'code surface' },
]

const typeScale: { meta: string; variant: TypographyVariant; sample: string }[] = [
  { meta: 'H1 · 56px', variant: 'h1', sample: 'The big hello' },
  { meta: 'H2 · 40px', variant: 'h2', sample: 'Section heading' },
  { meta: 'Lead · 30px', variant: 'lead', sample: 'A handwritten lead line' },
  { meta: 'Label · 19px', variant: 'label', sample: 'UI label / caption' },
  {
    meta: 'Body · 17px',
    variant: 'body',
    sample: 'Readable body copy for long-form content and paragraphs.',
  },
  { meta: 'mono / code', variant: 'mono', sample: 'const ship = () => deploy(app); // JetBrains Mono' },
]

const badges: { variant: BadgeVariant; label: string }[] = [
  { variant: 'ai', label: 'AI' },
  { variant: 'code', label: 'Code' },
  { variant: 'news', label: 'News' },
  { variant: 'career', label: 'Career' },
]

// framework/language brand colors, stroke only (JS yellow darkened a notch
// so a 1.4px stroke stays visible on paper)
const chips = [
  { label: 'TypeScript', color: '#3178C6' },
  { label: 'JavaScript', color: '#D4B106' },
  { label: 'Node.js', color: '#5FA04E' },
  { label: 'Next.js', color: '#2A2A2A' },
  { label: 'Vue.js', color: '#42B883' },
  { label: 'PostgreSQL', color: '#336791' },
  { label: 'Redis', color: '#DC382D' },
  { label: 'AWS', color: '#FF9900' },
  { label: 'DDD', color: '#8A6BCF' },
]

const shadows = [
  { name: 'Sticky note', value: '5px 7px 0 rgba(42,42,42,.10)', class: 'shadow-sticky' },
  { name: 'Lifted card', value: '7px 9px 0 rgba(42,42,42,.12)', class: 'shadow-lifted' },
  { name: 'Terminal', value: '8px 10px 0 rgba(42,42,42,.14)', class: 'shadow-terminal' },
]

const deployCode = `export async function deploy(app) {
  const build = await pipeline.build(app);
  await pipeline.test(build);
  return { url: app.url, ok: true };
}`
</script>

<template>
  <div>
    <!-- NAV -->
    <UiNavbar
      :links="navLinks"
      :cta="{ label: 'Hire Me', href: '/#book' }"
      :link-component="NuxtLink"
    >
      <template #end>
        <template v-if="user">
          <NuxtLink
            v-if="isAdmin"
            to="/admin"
            class="font-hand text-lg text-cyan underline decoration-wavy underline-offset-4
                   transition-colors hover:text-magenta"
          >
            ✎ Admin
          </NuxtLink>
          <button
            class="cursor-pointer font-hand text-lg text-ink-400 transition-colors
                   hover:text-magenta dark:text-chalk-500"
            @click="logout()"
          >
            logout
          </button>
        </template>
        <NuxtLink
          v-else
          to="/login"
          class="font-hand text-lg text-ink-400 no-underline transition-colors hover:text-cyan
                 dark:text-chalk-500"
        >
          login
        </NuxtLink>
      </template>
    </UiNavbar>

    <!-- HEADER -->
    <header class="mx-auto max-w-[1120px] px-6 pb-2.5 pt-14">
      <CommentCode>the sketchbook</CommentCode>
      <Typography variant="h1" class="mb-2 mt-1.5">Design System</Typography>
      <Typography variant="body" class="max-w-[60ch]">
        Every token and component the portfolio is built from — colors, type, buttons, tags, cards,
        menus and the hand-drawn patterns that tie them together. One source of truth.
      </Typography>
    </header>

    <!-- QUICK NAV -->
    <div class="mx-auto flex max-w-[1120px] flex-wrap gap-x-2.5 gap-y-1 px-6 pt-5">
      <UiLink v-for="t in toc" :key="t.href" :href="t.href" class="font-hand text-base">
        {{ t.label }}
      </UiLink>
    </div>

    <!-- 01 COLORS -->
    <section id="colors" class="mx-auto max-w-[1120px] px-6 pb-5 pt-11">
      <div class="mb-5 flex items-baseline gap-3.5">
        <span class="font-mono text-[13px] text-cyan">01</span>
        <Typography variant="h2">Color palette</Typography>
      </div>
      <div class="grid grid-cols-2 gap-[18px] md:grid-cols-4">
        <SketchBox
          v-for="c in colors"
          :key="c.hex"
          :stroke-width="1.7"
          class="bg-white p-3 shadow-sticky dark:bg-night-800"
        >
          <div
            class="h-[78px] rounded-md border border-ink/10 dark:border-chalk/10"
            :style="{ background: c.hex }"
          />
          <div class="mt-2 font-hand text-[17px] leading-none">{{ c.name }}</div>
          <div class="font-mono text-[11.5px] text-ink-400 dark:text-chalk-500">{{ c.hex }}</div>
          <div class="mt-0.5 text-xs text-ink-500 dark:text-chalk-500">{{ c.use }}</div>
        </SketchBox>
      </div>
    </section>

    <!-- 02 TYPOGRAPHY -->
    <section id="type" class="mx-auto max-w-[1120px] px-6 pb-5 pt-9">
      <div class="mb-5 flex items-baseline gap-3.5">
        <span class="font-mono text-[13px] text-cyan">02</span>
        <Typography variant="h2">Typography</Typography>
      </div>
      <div class="mb-6 grid gap-[18px] md:grid-cols-3">
        <SketchBox :stroke-width="1.7" class="bg-white px-[22px] py-5 shadow-sticky dark:bg-night-800">
          <div class="font-display text-[52px] leading-none">Caveat</div>
          <div class="mt-1.5 font-mono text-[11px] text-ink-400 dark:text-chalk-500">
            display · headings · signatures
          </div>
          <div class="mt-2 font-display text-[22px] text-ink-600 dark:text-chalk-600">
            Aa Bb Cc — 1234567890
          </div>
        </SketchBox>
        <SketchBox :stroke-width="1.7" class="bg-white px-[22px] py-5 shadow-sticky dark:bg-night-800">
          <div class="font-hand text-[40px] leading-none">Patrick Hand</div>
          <div class="mt-1.5 font-mono text-[11px] text-ink-400 dark:text-chalk-500">
            labels · captions · UI accents
          </div>
          <div class="mt-2 font-hand text-[20px] text-ink-600 dark:text-chalk-600">
            Aa Bb Cc — 1234567890
          </div>
        </SketchBox>
        <SketchBox :stroke-width="1.7" class="bg-white px-[22px] py-5 shadow-sticky dark:bg-night-800">
          <div class="font-sans text-[34px] font-bold leading-none">Nunito Sans</div>
          <div class="mt-1.5 font-mono text-[11px] text-ink-400 dark:text-chalk-500">
            body · long-form · accessible
          </div>
          <div class="mt-2 font-sans text-[17px] text-ink-600 dark:text-chalk-600">
            Aa Bb Cc — 1234567890
          </div>
        </SketchBox>
      </div>
      <SketchBox :stroke-width="1.7" class="bg-white px-[26px] py-6 shadow-lifted dark:bg-night-800">
        <div
          v-for="(t, i) in typeScale"
          :key="t.meta"
          class="flex items-baseline gap-[18px] py-3"
          :class="i < typeScale.length - 1 && 'border-b border-dashed border-ink-100 dark:border-night-500'"
        >
          <div class="w-24 flex-shrink-0 font-mono text-[11px] text-ink-400 dark:text-chalk-500">
            {{ t.meta }}
          </div>
          <Typography :variant="t.variant" as="div">{{ t.sample }}</Typography>
        </div>
      </SketchBox>
    </section>

    <!-- 03 BUTTONS -->
    <section id="buttons" class="mx-auto max-w-[1120px] px-6 pb-5 pt-9">
      <div class="mb-5 flex items-baseline gap-3.5">
        <span class="font-mono text-[13px] text-cyan">03</span>
        <Typography variant="h2">Buttons</Typography>
        <span class="font-hand text-base text-ink-400 dark:text-chalk-500">
          — hover for the scribble fill &amp; tilt
        </span>
      </div>
      <SketchBox
        color="#c9c9bf"
        :stroke-width="1.5"
        class="flex flex-wrap items-center gap-[22px] bg-white p-[30px] shadow-lifted dark:bg-night-800"
      >
        <UiButton variant="primary">Primary →</UiButton>
        <UiButton variant="secondary">Secondary</UiButton>
        <UiButton variant="ghost" shape="ellipse">Circled CTA</UiButton>
        <UiButton variant="sketch">Sketch / list</UiButton>
        <UiButton variant="danger" fill-style="cross-hatch">Destructive</UiButton>
        <UiButton variant="primary" disabled>Disabled</UiButton>
      </SketchBox>
    </section>

    <!-- 04 LINKS -->
    <section id="links" class="mx-auto max-w-[1120px] px-6 pb-5 pt-9">
      <div class="mb-5 flex items-baseline gap-3.5">
        <span class="font-mono text-[13px] text-cyan">04</span>
        <Typography variant="h2">Links</Typography>
      </div>
      <SketchBox
        color="#c9c9bf"
        :stroke-width="1.5"
        class="flex flex-col gap-3 bg-white px-[30px] py-7 text-[17px] text-ink-600 shadow-lifted
               dark:bg-night-800 dark:text-chalk-600"
      >
        <div>
          Default wavy underline: <UiLink href="#links">read the case study</UiLink> — hover to see
          it shift to magenta.
        </div>
        <div>
          Inline in a sentence, links stay <UiLink href="#links">legible and quiet</UiLink> against
          the body text.
        </div>
        <div class="font-hand text-[17px]">
          Back-nav style: <UiLink href="/">← back home</UiLink>
        </div>
      </SketchBox>
    </section>

    <!-- 05 TAGS & BADGES -->
    <section id="tags" class="mx-auto max-w-[1120px] px-6 pb-5 pt-9">
      <div class="mb-5 flex items-baseline gap-3.5">
        <span class="font-mono text-[13px] text-cyan">05</span>
        <Typography variant="h2">Tags &amp; badges</Typography>
      </div>
      <SketchBox
        color="#c9c9bf"
        :stroke-width="1.5"
        class="flex flex-col gap-5 bg-white px-[30px] py-7 shadow-lifted dark:bg-night-800"
      >
        <div>
          <div class="mb-2 font-hand text-[15px] text-ink-400 dark:text-chalk-500">
            category badges (solid)
          </div>
          <div class="flex flex-wrap gap-2">
            <UiBadge v-for="b in badges" :key="b.variant" :variant="b.variant">{{ b.label }}</UiBadge>
          </div>
        </div>
        <div>
          <div class="mb-2 font-hand text-[15px] text-ink-400 dark:text-chalk-500">
            stack chips (subtle)
          </div>
          <div class="flex flex-wrap gap-2">
            <UiChip v-for="c in chips" :key="c.label">{{ c.label }}</UiChip>
          </div>
        </div>
        <div>
          <div class="mb-2 font-hand text-[15px] text-ink-400 dark:text-chalk-500">
            sketchy outline chips (hover)
          </div>
          <div class="flex flex-wrap gap-3">
            <UiChip v-for="c in chips" :key="c.label" variant="sketch" :color="c.color">
              {{ c.label }}
            </UiChip>
          </div>
        </div>
        <div>
          <div class="mb-2 font-hand text-[15px] text-ink-400 dark:text-chalk-500">
            filter pills (active / inactive)
          </div>
          <div class="flex flex-wrap gap-2.5">
            <UiPill active>All</UiPill>
            <UiPill>AI</UiPill>
            <UiPill>Code</UiPill>
          </div>
        </div>
        <div>
          <div class="mb-2 font-hand text-[15px] text-ink-400 dark:text-chalk-500">
            highlighter mark
          </div>
          <UiHighlight class="text-[17px]">marked like a real highlighter</UiHighlight>
        </div>
      </SketchBox>
    </section>

    <!-- 06 MENUS & NAV -->
    <section id="menu" class="mx-auto max-w-[1120px] px-6 pb-5 pt-9">
      <div class="mb-5 flex items-baseline gap-3.5">
        <span class="font-mono text-[13px] text-cyan">06</span>
        <Typography variant="h2">Menus &amp; nav</Typography>
      </div>
      <div class="grid gap-[18px] md:grid-cols-[1.3fr_0.7fr]">
        <SketchBox
          color="#c9c9bf"
          :stroke-width="1.5"
          class="bg-white p-5 shadow-sticky dark:bg-night-800"
        >
          <div class="mb-2.5 font-hand text-[15px] text-ink-400 dark:text-chalk-500">
            top bar (as used site-wide)
          </div>
          <div
            class="flex flex-wrap items-center justify-between gap-4 rounded-lg border-[1.5px]
                   border-dashed border-ink-200 px-[18px] py-3 dark:border-night-500"
          >
            <span class="font-display text-[26px] font-bold">
              Oussama<span class="text-cyan">.el</span>
            </span>
            <span class="flex flex-wrap items-center gap-[18px] font-hand text-base">
              <UiHighlight class="text-base">Experience</UiHighlight>
              <span>Code</span><span>Travels</span><span>Blog</span>
              <span class="text-magenta">Hire Me</span>
            </span>
          </div>
        </SketchBox>
        <SketchBox
          color="#c9c9bf"
          :stroke-width="1.5"
          class="bg-white p-5 shadow-sticky dark:bg-night-800"
        >
          <div class="mb-2.5 font-hand text-[15px] text-ink-400 dark:text-chalk-500">
            sidebar item (admin)
          </div>
          <div class="flex flex-col gap-1.5">
            <div
              class="flex -rotate-[0.6deg] items-center gap-2.5 rounded-[9px] bg-marker px-3 py-2
                     font-hand text-base text-[#2A2A2A]"
            >
              <span class="h-[9px] w-[9px] rounded-sm bg-[#2A2A2A]" />Overview
            </div>
            <div class="flex items-center gap-2.5 px-3 py-2 font-hand text-base">
              <span class="h-[9px] w-[9px] rounded-sm bg-magenta" />Blog Posts
              <span class="ml-auto font-mono text-[11px] text-ink-300 dark:text-chalk-500">4</span>
            </div>
            <div class="flex items-center gap-2.5 px-3 py-2 font-hand text-base">
              <span class="h-[9px] w-[9px] rounded-sm bg-cyan" />Experience
              <span class="ml-auto font-mono text-[11px] text-ink-300 dark:text-chalk-500">3</span>
            </div>
          </div>
        </SketchBox>
      </div>
    </section>

    <!-- 07 FORM INPUTS -->
    <section id="inputs" class="mx-auto max-w-[1120px] px-6 pb-5 pt-9">
      <div class="mb-5 flex items-baseline gap-3.5">
        <span class="font-mono text-[13px] text-cyan">07</span>
        <Typography variant="h2">Form inputs</Typography>
      </div>
      <SketchBox
        color="#c9c9bf"
        :stroke-width="1.5"
        class="grid items-start gap-[18px] bg-white px-[30px] py-7 shadow-lifted md:grid-cols-3
               dark:bg-night-800"
      >
        <div>
          <div class="mb-1 font-hand text-[15px] text-ink-600 dark:text-chalk-600">Text field</div>
          <input class="ds-input" placeholder="you@email.com" />
        </div>
        <div>
          <div class="mb-1 font-hand text-[15px] text-ink-600 dark:text-chalk-600">Select</div>
          <select class="ds-input">
            <option>AI</option>
            <option>Code</option>
            <option>News</option>
          </select>
        </div>
        <div>
          <div class="mb-1 font-hand text-[15px] text-ink-600 dark:text-chalk-600">
            Focused (cyan ring)
          </div>
          <input class="ds-input !border-cyan" value="focused state" />
        </div>
        <div class="md:col-span-3">
          <div class="mb-1 font-hand text-[15px] text-ink-600 dark:text-chalk-600">Textarea</div>
          <textarea class="ds-input" rows="3" placeholder="One or two sentences…" />
        </div>
      </SketchBox>
    </section>

    <!-- 08 CARDS -->
    <section id="cards" class="mx-auto max-w-[1120px] px-6 pb-5 pt-9">
      <div class="mb-5 flex items-baseline gap-3.5">
        <span class="font-mono text-[13px] text-cyan">08</span>
        <Typography variant="h2">Cards</Typography>
      </div>
      <div class="grid gap-6 md:grid-cols-3">
        <UiCard variant="index">
          <div class="font-mono text-[11.5px] text-cyan">pinned index card</div>
          <div class="font-display text-[30px] leading-none">Card title</div>
          <p class="mt-2 text-sm text-ink-600 dark:text-chalk-600">
            Rough border, offset shadow, a push-pin and a slight tilt that straightens on hover.
          </p>
        </UiCard>
        <UiCard variant="polaroid">
          <div
            class="flex aspect-square items-center justify-center
                   bg-[repeating-linear-gradient(45deg,#efefe8_0_10px,#f7f7f1_10px_20px)]
                   dark:bg-[repeating-linear-gradient(45deg,#262931_0_10px,#20232a_10px_20px)]"
          >
            <span class="font-mono text-[10px] text-ink-300 dark:text-chalk-500">[ photo ]</span>
          </div>
          <div class="mt-2 font-display text-[26px] leading-none">Polaroid</div>
          <div class="font-hand text-[13px] text-ink-500 dark:text-chalk-500">taped photo card</div>
        </UiCard>
        <UiCard variant="callout">
          <div class="mb-1 font-hand text-base text-magenta">✎ callout / note</div>
          <p class="m-0 text-[15px] text-ink-600 dark:text-chalk-600">
            For rules, tips and asides — tinted background with a colored sketchy border.
          </p>
        </UiCard>
      </div>
    </section>

    <!-- 09 TERMINAL -->
    <section id="terminal" class="mx-auto max-w-[1120px] px-6 pb-5 pt-9">
      <div class="mb-5 flex items-baseline gap-3.5">
        <span class="font-mono text-[13px] text-cyan">09</span>
        <Typography variant="h2">Terminal / code block</Typography>
      </div>
      <UiTerminal title="~/deploy.ts" :code="deployCode" lang="ts" class="max-w-[640px]" />
    </section>

    <!-- 10 DOODLE ELEMENTS -->
    <section id="doodles" class="mx-auto max-w-[1120px] px-6 pb-5 pt-9">
      <div class="mb-5 flex items-baseline gap-3.5">
        <span class="font-mono text-[13px] text-cyan">10</span>
        <Typography variant="h2">Doodle elements</Typography>
      </div>
      <SketchBox
        color="#c9c9bf"
        :stroke-width="1.5"
        class="flex flex-wrap items-center gap-9 bg-white p-[30px] shadow-lifted dark:bg-night-800"
      >
        <div class="text-center">
          <UiArrow />
          <div class="font-hand text-[13px] text-ink-400 dark:text-chalk-500">hand arrow</div>
        </div>
        <div class="text-center">
          <SketchBox
            tag="span"
            shape="ellipse"
            color="#0E93A8"
            :stroke-width="2.2"
            class="inline-block px-[22px] py-3.5 font-display text-[26px]"
          >
            circled
          </SketchBox>
          <div class="mt-1.5 font-hand text-[13px] text-ink-400 dark:text-chalk-500">
            scribble ellipse
          </div>
        </div>
        <div class="text-center">
          <UiPin :size="18" />
          <div class="mt-1.5 font-hand text-[13px] text-ink-400 dark:text-chalk-500">push-pin</div>
        </div>
        <div class="text-center">
          <UiTape :width="80" :height="24" />
          <div class="mt-2.5 font-hand text-[13px] text-ink-400 dark:text-chalk-500">tape</div>
        </div>
        <div class="text-center">
          <span class="inline-block w-[90px] border-b-2 border-dashed border-ink-200 dark:border-night-500" />
          <div class="mt-1.5 font-hand text-[13px] text-ink-400 dark:text-chalk-500">
            dashed divider
          </div>
        </div>
      </SketchBox>
    </section>

    <!-- 11 ELEVATION -->
    <section id="elevation" class="mx-auto max-w-[1120px] px-6 pb-5 pt-9">
      <div class="mb-5 flex items-baseline gap-3.5">
        <span class="font-mono text-[13px] text-cyan">11</span>
        <Typography variant="h2">Elevation &amp; borders</Typography>
      </div>
      <div class="flex flex-wrap gap-[26px]">
        <div
          v-for="s in shadows"
          :key="s.name"
          class="rounded-lg border-[1.5px] border-[#ecece4] bg-white px-6 py-5 dark:border-night-500
                 dark:bg-night-800"
          :class="s.class"
        >
          <div class="font-hand text-lg">{{ s.name }}</div>
          <div class="mt-1 font-mono text-[11px] text-ink-400 dark:text-chalk-500">{{ s.value }}</div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="mx-auto max-w-[1120px] px-6 pb-[70px] pt-11 text-center">
      <div
        class="border-t-2 border-dashed border-ink-200 pt-[30px] font-display text-[28px]
               dark:border-night-500"
      >
        One system, hand-drawn <span class="text-magenta">&amp;</span> consistent.
      </div>
      <UiLink href="/" class="font-hand text-[17px]">← back to the portfolio</UiLink>
    </footer>
  </div>
</template>

<style scoped>
/* the design system's shared input treatment (source: DesignSystem.dc.html helmet styles) */
.ds-input {
  width: 100%;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  color: #2a2a2a;
  border: 1.5px solid #dcdcd2;
  border-radius: 8px;
  padding: 10px 12px;
  background: #fff;
  outline: none;
  transition: border-color 0.15s ease;
}
.ds-input:focus {
  border-color: #0e93a8;
}
:global(.dark) .ds-input {
  color: #e9e9e1;
  background: #20232a;
  border-color: #3a3d45;
}
</style>