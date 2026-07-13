<script setup lang="ts">
import type { CodeExprProps } from './CodeExpr.types'
import CommentCode from '#components/CommentCode/CommentCode.vue'
import SketchBox from '#components/SketchBox/SketchBox.vue'
import Typography from '#components/Typography/Typography.vue'
import UiLink from '#components/UiLink/UiLink.vue'
import UiTerminal from '#components/UiTerminal/UiTerminal.vue'

const DEPLOY_CODE = `import { pipeline } from '@core/ci';

export async function deploy(app: Service) {
  const build = await pipeline.build(app, {
    cache: true,
    runner: 'vite',
  });
  if (!build.ok) throw new DeployError(build.errors);

  await pipeline.test(build, { runner: 'vitest' });
  await pipeline.push(build, {
    target: 'aws',
    region: 'eu-west-3',
  });

  return { url: \`https://\${app.slug}.vercel.app\`, ok: true };
}`

withDefaults(defineProps<CodeExprProps>(), {
  eyebrow: 'feature spotlight',
  title: 'From sketch to shipped',
  moreHref: '/projects',
  moreLabel: 'all projects & snippets →',
  code: DEPLOY_CODE,
  codeTitle: '~/ci/deploy.ts',
  lang: 'ts',
  wireframeLabel: 'wireframe · deploy dashboard',
})
</script>

<template>
  <section id="code" class="mx-auto max-w-[1120px] px-6 pb-10 pt-[50px]">
    <CommentCode :rotate="-0.8">{{ eyebrow }}</CommentCode>
    <div class="mb-[30px] mt-1.5 flex flex-wrap items-baseline justify-between gap-4">
      <Typography variant="h2" class="!text-[46px]">{{ title }}</Typography>
      <UiLink v-if="moreHref" :href="moreHref" class="whitespace-nowrap font-hand text-lg">
        {{ moreLabel }}
      </UiLink>
    </div>
    <div class="grid items-center gap-[34px] md:grid-cols-[0.85fr_1.15fr]">
      <!-- wireframe sketch -->
      <SketchBox
        :stroke-width="1.9"
        class="-rotate-[1.4deg] bg-white p-[18px] shadow-sticky dark:bg-night-800"
      >
        <div class="mb-2.5 font-hand text-base text-ink-400 dark:text-chalk-500">
          {{ wireframeLabel }}
        </div>
        <div class="flex flex-col gap-2.5">
          <SketchBox color="#b9b9af" :stroke-width="1.3" class="h-[34px]"><span /></SketchBox>
          <div class="flex gap-2.5">
            <SketchBox color="#b9b9af" :stroke-width="1.3" class="h-[70px] flex-1">
              <span />
            </SketchBox>
            <SketchBox color="#0E93A8" :stroke-width="1.5" class="h-[70px] flex-1">
              <span />
            </SketchBox>
          </div>
          <SketchBox color="#b9b9af" :stroke-width="1.3" class="h-11"><span /></SketchBox>
          <div class="self-start">
            <SketchBox
              tag="span"
              shape="ellipse"
              color="#C0577F"
              :stroke-width="1.8"
              class="inline-block px-4 py-1.5 font-hand text-[15px] text-magenta"
            >
              Ship it
            </SketchBox>
          </div>
        </div>
      </SketchBox>
      <!-- terminal -->
      <div class="rotate-[0.6deg]">
        <UiTerminal :title="codeTitle" :code="code" :lang="lang" />
      </div>
    </div>
  </section>
</template>
