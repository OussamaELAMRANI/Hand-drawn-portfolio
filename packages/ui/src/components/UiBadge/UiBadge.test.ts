import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UiBadge from './UiBadge.vue'

describe('UiBadge', () => {
  it.each([
    ['ai', 'bg-magenta'],
    ['code', 'bg-cyan'],
    ['news', 'bg-violet'],
    ['career', 'bg-amber'],
  ] as const)('variant %s gets %s', (variant, cls) => {
    const wrapper = mount(UiBadge, { props: { variant }, slots: { default: variant } })
    expect(wrapper.classes()).toContain(cls)
  })
})
