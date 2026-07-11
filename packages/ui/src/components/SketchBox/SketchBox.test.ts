import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SketchBox from './SketchBox.vue'

describe('SketchBox', () => {
  it('renders the given tag with slot content', () => {
    const wrapper = mount(SketchBox, { props: { tag: 'span' }, slots: { default: 'boxed' } })
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.text()).toBe('boxed')
  })

  it('defaults to a div', () => {
    const wrapper = mount(SketchBox, { slots: { default: 'x' } })
    expect(wrapper.element.tagName).toBe('DIV')
  })
})
