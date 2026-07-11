import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UiButton from './UiButton.vue'

describe('UiButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(UiButton, { slots: { default: 'Click me' } })
    expect(wrapper.text()).toBe('Click me')
  })

  it('applies the variant classes', () => {
    const wrapper = mount(UiButton, { props: { variant: 'ghost' } })
    expect(wrapper.classes()).toContain('bg-transparent')
  })

  it('emits click when pressed', async () => {
    const wrapper = mount(UiButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(UiButton, { props: { disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
