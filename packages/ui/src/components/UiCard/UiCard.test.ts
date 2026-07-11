import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UiCard from './UiCard.vue'

describe('UiCard', () => {
  it('index card shows a pin', () => {
    const wrapper = mount(UiCard, { slots: { default: 'card' } })
    expect(wrapper.findComponent({ name: 'UiPin' }).exists()).toBe(true)
  })

  it('polaroid shows tape', () => {
    const wrapper = mount(UiCard, { props: { variant: 'polaroid' }, slots: { default: 'p' } })
    expect(wrapper.findComponent({ name: 'UiTape' }).exists()).toBe(true)
  })

  it('callout shows neither doodle', () => {
    const wrapper = mount(UiCard, { props: { variant: 'callout' }, slots: { default: 'c' } })
    expect(wrapper.findComponent({ name: 'UiPin' }).exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'UiTape' }).exists()).toBe(false)
  })
})
