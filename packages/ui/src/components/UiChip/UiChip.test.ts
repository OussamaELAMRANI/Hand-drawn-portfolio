import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UiChip from './UiChip.vue'
import SketchBox from '#components/SketchBox/SketchBox.vue'

describe('UiChip', () => {
  it('renders subtle chip by default', () => {
    const wrapper = mount(UiChip, { slots: { default: 'Vue.js' } })
    expect(wrapper.text()).toBe('Vue.js')
    expect(wrapper.find('svg').exists()).toBe(false)
  })

  it('sketch variant renders a SketchBox', () => {
    const wrapper = mount(UiChip, { props: { variant: 'sketch' }, slots: { default: 'DDD' } })
    expect(wrapper.findComponent(SketchBox).exists()).toBe(true)
  })

  it.each([
    ['gray', '#b9b9af'],
    ['ink', '#2A2A2A'],
    ['cyan', '#0E93A8'],
    ['magenta', '#C0577F'],
    ['violet', '#8A6BCF'],
    ['amber', '#C98A2B'],
  ] as const)('sketch stroke %s outlines in %s', (stroke, color) => {
    const wrapper = mount(UiChip, {
      props: { variant: 'sketch', stroke },
      slots: { default: 'x' },
    })
    expect(wrapper.findComponent(SketchBox).props('color')).toBe(color)
  })

  it('custom color overrides the stroke preset but keeps neutral text', () => {
    const wrapper = mount(UiChip, {
      props: { variant: 'sketch', stroke: 'magenta', color: '#3178C6' },
      slots: { default: 'TypeScript' },
    })
    expect(wrapper.findComponent(SketchBox).props('color')).toBe('#3178C6')
    expect(wrapper.findComponent(SketchBox).classes()).not.toContain('text-magenta')
  })
})
