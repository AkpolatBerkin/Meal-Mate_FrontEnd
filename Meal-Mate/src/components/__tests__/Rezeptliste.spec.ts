import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Rezeptliste from '../Rezeptliste.vue'
import { apiService } from '@/services/api.service'
import { flushPromises } from '@vue/test-utils'


vi.mock('@/services/api.service', () => ({
  apiService: {
    getAllRezepte: vi.fn()
  }
}))

describe('Rezeptliste.vue', () => {
  const mockRezepte = [
    {
      id: 1,
      name: 'Pizza Margherita',
      kategorie: 'Mittagessen',
      zubereitung: 'Teig ausrollen...',
      dauer: 30,
      portionen: 2,
      bewertung: 4,
      zutaten: 'Mehl\nTomaten\nMozzarella'
    },
    {
      id: 2,
      name: 'Pasta Carbonara',
      kategorie: 'Abendessen',
      zubereitung: 'Nudeln kochen...',
      dauer: 20,
      portionen: 4,
      bewertung: 5,
      zutaten: 'Nudeln\nEier\nSpeck'
    }
  ]

  it('zeigt leere Liste wenn keine Rezepte vorhanden', async () => {
    vi.mocked(apiService.getAllRezepte).mockResolvedValue({ data: [] })
    const wrapper = mount(Rezeptliste)

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const emptyState = wrapper.find('[data-test="empty-state"]')
    expect(emptyState.exists()).toBe(true)
  })

  it('filtert Rezepte nach Kategorie', async () => {
    vi.mocked(apiService.getAllRezepte).mockResolvedValue({ data: mockRezepte })
    const wrapper = mount(Rezeptliste)

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await flushPromises()

    const select = wrapper.find('[data-test="filter-select"]')
    await select.setValue('Mittagessen')
    await wrapper.vm.$nextTick()

    const recipeCards = wrapper.findAll('[data-test="recipe-card"]')
    expect(recipeCards).toHaveLength(1)
  })

  it('öffnet Modal beim Klick auf Anzeigen-Button', async () => {
    vi.mocked(apiService.getAllRezepte).mockResolvedValue({ data: mockRezepte })
    const wrapper = mount(Rezeptliste)

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await flushPromises()

    const firstCard = wrapper.find('[data-test="recipe-card"]')
    const showButton = firstCard.find('[data-test="show-recipe-button"]')
    await showButton.trigger('click')
    await wrapper.vm.$nextTick()

    const modal = wrapper.find('.modal-overlay')
    expect(modal.exists()).toBe(true)
  })
})
