import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UiArrow from './UiArrow.vue'

describe('UiArrow', () => {
  it('renders a decorative container with an svg layer', () => {
    const wrapper = mount(UiArrow)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('svg').exists()).toBe(true)
  })
})
