import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Typography from './Typography.vue'

describe('Typography', () => {
  it('renders slot content', () => {
    const wrapper = mount(Typography, { slots: { default: 'Hello' } })
    expect(wrapper.text()).toBe('Hello')
  })

  it('defaults to a body paragraph', () => {
    const wrapper = mount(Typography)
    expect(wrapper.element.tagName).toBe('P')
    expect(wrapper.classes()).toContain('text-body')
  })

  it.each([
    ['h1', 'H1', 'text-h1'],
    ['h2', 'H2', 'text-h2'],
    ['lead', 'P', 'text-lead'],
    ['label', 'SPAN', 'text-label'],
    ['body', 'P', 'text-body'],
    ['mono', 'CODE', 'text-mono'],
  ] as const)('variant %s renders <%s> with %s', (variant, tag, cls) => {
    const wrapper = mount(Typography, { props: { variant } })
    expect(wrapper.element.tagName).toBe(tag)
    expect(wrapper.classes()).toContain(cls)
  })

  it('honors the `as` tag override', () => {
    const wrapper = mount(Typography, { props: { variant: 'lead', as: 'div' } })
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.classes()).toContain('text-lead')
  })
})
