import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UiInput from './UiInput.vue'

describe('UiInput', () => {
  it('renders value and placeholder', () => {
    const wrapper = mount(UiInput, {
      props: { modelValue: 'hi', placeholder: 'you@email.com' },
    })
    expect((wrapper.element as HTMLInputElement).value).toBe('hi')
    expect(wrapper.attributes('placeholder')).toBe('you@email.com')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(UiInput)
    await wrapper.setValue('typed')
    expect(wrapper.emitted('update:modelValue')).toEqual([['typed']])
  })
})
