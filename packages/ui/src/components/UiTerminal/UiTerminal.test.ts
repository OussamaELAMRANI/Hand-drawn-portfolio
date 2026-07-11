import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UiTerminal from './UiTerminal.vue'

describe('UiTerminal', () => {
  it('renders title and code slot', () => {
    const wrapper = mount(UiTerminal, {
      props: { title: '~/deploy.ts' },
      slots: { default: 'const x = 1' },
    })
    expect(wrapper.text()).toContain('~/deploy.ts')
    expect(wrapper.find('pre').text()).toBe('const x = 1')
  })

  it('syntax-highlights the code prop', async () => {
    const wrapper = mount(UiTerminal, {
      props: { code: 'const x: number = 1', lang: 'typescript' },
    })
    // escaped fallback renders immediately
    expect(wrapper.find('.terminal-code pre').text()).toBe('const x: number = 1')
    // shiki upgrade lands async: token spans with inline colors
    await vi.waitUntil(() => wrapper.find('.terminal-code .shiki span[style]').exists(), {
      timeout: 10000,
    })
    expect(wrapper.find('.terminal-code .shiki').text()).toBe('const x: number = 1')
  })

  it('falls back to plain text for unknown languages', async () => {
    const wrapper = mount(UiTerminal, {
      props: { code: 'hello', lang: 'not-a-language' },
    })
    await vi.waitUntil(() => wrapper.find('.terminal-code .shiki code').exists(), {
      timeout: 10000,
    })
    expect(wrapper.find('.terminal-code').text()).toBe('hello')
  })
})
