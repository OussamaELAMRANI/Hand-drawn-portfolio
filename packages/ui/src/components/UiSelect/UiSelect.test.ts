import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UiSelect from './UiSelect.vue'

describe('UiSelect', () => {
  it('renders options from the prop', () => {
    const wrapper = mount(UiSelect, { props: { options: ['AI', 'Code', 'News'] } })
    expect(wrapper.findAll('option').map((o) => o.text())).toEqual(['AI', 'Code', 'News'])
  })

  it('emits update:modelValue on change', async () => {
    const wrapper = mount(UiSelect, { props: { options: ['AI', 'Code'] } })
    await wrapper.setValue('Code')
    expect(wrapper.emitted('update:modelValue')).toEqual([['Code']])
  })
})
