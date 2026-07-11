import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UiLink from './UiLink.vue'

describe('UiLink', () => {
  it('renders an anchor with wavy underline classes', () => {
    const wrapper = mount(UiLink, { props: { href: '/x' }, slots: { default: 'go' } })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/x')
    expect(wrapper.classes()).toContain('decoration-wavy')
  })
})
