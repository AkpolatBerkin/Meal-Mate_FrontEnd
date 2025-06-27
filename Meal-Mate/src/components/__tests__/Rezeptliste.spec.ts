// src/components/__tests__/Rezeptliste.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Rezeptliste from '../Rezeptliste.vue'
import axios from 'axios'

vi.mock('axios')

describe('Rezeptliste.vue', () => {
  const mockRezepte = [
    {
      id: 1,
      name: 'Pizza Margherita',
      kategorie: 'Mittagessen',
      zubereitung: 'Teig ausrollen...',
      dauer: 30,
      portionen: 2,
      bewertung: 4
    },
    {
      id: 2,
      name: 'Pasta Carbonara',
      kategorie: 'Abendessen',
      zubereitung: 'Nudeln kochen...',
      dauer: 20,
      portionen: 4,
      bewertung: 5
    }
  ]

  it('zeigt leere Liste wenn keine Rezepte vorhanden', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: [] })
    const wrapper = mount(Rezeptliste)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.find('.empty-content').text()).toContain('Keine Rezepte gefunden')
  })

  it('filtert Rezepte nach Kategorie', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockRezepte })
    const wrapper = mount(Rezeptliste)
    await wrapper.vm.$nextTick()

    await wrapper.find('.filter-select').setValue('Mittagessen')
    expect(wrapper.findAll('.recipe-card')).toHaveLength(1)
    expect(wrapper.find('.recipe-title').text()).toBe('Pizza Margherita')
  })

  it('öffnet Modal beim Klick auf Anzeigen-Button', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockRezepte })
    const wrapper = mount(Rezeptliste)
    await wrapper.vm.$nextTick()

    await wrapper.find('.action-btn.view').trigger('click')
    expect(wrapper.find('.modal-content').exists()).toBe(true)
    expect(wrapper.find('.recipe-details').text()).toContain('Pizza Margherita')
  })
})
