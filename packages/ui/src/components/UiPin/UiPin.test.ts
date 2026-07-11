import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UiPin from './UiPin.vue'

describe('UiPin', () => {
  it('renders a blob with the given color and size', () => {
    const wrapper = mount(UiPin, { props: { color: '#0E93A8', size: 20 } })
    const style = wrapper.attributes('style')
    expect(style).toContain('width: 20px')
    expect(style).toContain('background: #0E93A8')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })
})
