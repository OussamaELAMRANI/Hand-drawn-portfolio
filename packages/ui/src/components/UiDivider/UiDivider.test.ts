import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UiDivider from './UiDivider.vue'

describe('UiDivider', () => {
  it('renders a dashed hr', () => {
    const wrapper = mount(UiDivider)
    expect(wrapper.element.tagName).toBe('HR')
    expect(wrapper.classes()).toContain('border-dashed')
  })
})
