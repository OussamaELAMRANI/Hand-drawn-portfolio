import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UiTape from './UiTape.vue'

describe('UiTape', () => {
  it('renders a rotated strip with the given dimensions', () => {
    const wrapper = mount(UiTape, { props: { width: 80, height: 24, angle: -5 } })
    const style = wrapper.attributes('style')
    expect(style).toContain('width: 80px')
    expect(style).toContain('height: 24px')
    expect(style).toContain('rotate(-5deg)')
  })
})
