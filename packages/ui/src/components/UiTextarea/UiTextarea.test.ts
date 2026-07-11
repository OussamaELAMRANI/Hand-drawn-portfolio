import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UiTextarea from './UiTextarea.vue'

describe('UiTextarea', () => {
  it('renders with the given rows', () => {
    const wrapper = mount(UiTextarea, { props: { rows: 5 } })
    expect(wrapper.attributes('rows')).toBe('5')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(UiTextarea)
    await wrapper.setValue('notes')
    expect(wrapper.emitted('update:modelValue')).toEqual([['notes']])
  })
})
