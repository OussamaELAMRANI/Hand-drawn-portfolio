import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UiPill from './UiPill.vue'

describe('UiPill', () => {
  it('marks the active state', () => {
    const active = mount(UiPill, { props: { active: true }, slots: { default: 'All' } })
    const inactive = mount(UiPill, { slots: { default: 'AI' } })
    expect(active.classes().join(' ')).toContain('bg-ink')
    expect(inactive.classes().join(' ')).toContain('bg-white')
  })
})
