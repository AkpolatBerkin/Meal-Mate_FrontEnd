// src/components/__tests__/Timer.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Timer from '../Timer.vue'

describe('Timer.vue', () => {
  it('rendert korrekt', () => {
    const wrapper = mount(Timer)
    expect(wrapper.exists()).toBe(true)
  })

  it('startet bei 5 Minuten', () => {
    const wrapper = mount(Timer)
    expect(wrapper.text()).toContain('5:00')
  })

  it('zeigt Timer-Menü beim Klick', async () => {
    const wrapper = mount(Timer)
    await wrapper.find('.timer-toggle').trigger('click')
    expect(wrapper.find('.timer-menu').isVisible()).toBe(true)
  })
})
