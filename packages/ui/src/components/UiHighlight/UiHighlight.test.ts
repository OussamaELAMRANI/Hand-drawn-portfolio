import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UiHighlight from './UiHighlight.vue'

describe('UiHighlight', () => {
  it('renders a mark with marker background', () => {
    const wrapper = mount(UiHighlight, { slots: { default: 'hey' } })
    expect(wrapper.element.tagName).toBe('MARK')
    expect(wrapper.classes()).toContain('bg-marker')
  })
})
