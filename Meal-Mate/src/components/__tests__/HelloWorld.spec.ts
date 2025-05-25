import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RezeptListe from '../Rezeptliste.vue'

describe('Rezeptliste', () => {
  it('wird korrekt gerendert', () => {
    const wrapper = mount(RezeptListe)
    expect(wrapper.exists()).toBe(true)
  })
})
