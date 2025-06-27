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
    const wrapper = mount(Rezeptliste, {
      props: {
        rezepte: [] // Geändert von recipes zu rezepte
      }
    })
    await wrapper.vm.$nextTick()

    const emptyState = wrapper.find('[data-test="empty-state"]')
    expect(emptyState.exists()).toBe(true)
  })

  it('filtert Rezepte nach Kategorie', async () => {
    const testRezepte = [ // Geändert von testRecipes zu testRezepte
      {
        id: 1,
        name: 'Pizza Margherita', // Geändert von title zu name
        kategorie: 'Mittagessen', // Geändert von category zu kategorie
        zubereitung: 'Test',
        dauer: 30,
        portionen: 2,
        bewertung: 4
      }
    ]

    const wrapper = mount(Rezeptliste, {
      props: {
        rezepte: testRezepte // Geändert von recipes zu rezepte
      }
    })

    await wrapper.find('[data-test="filter-select"]').setValue('Mittagessen')
    await wrapper.vm.$nextTick()

    const recipeCards = wrapper.findAll('[data-test="recipe-card"]')
    expect(recipeCards).toHaveLength(1)
  })

  it('öffnet Modal beim Klick auf Anzeigen-Button', async () => {
    const wrapper = mount(Rezeptliste, {
      props: {
        rezepte: [{
          id: 1,
          name: 'Test Rezept', // Geändert von title zu name
          kategorie: 'Test',
          zubereitung: 'Test',
          dauer: 30,
          portionen: 2,
          bewertung: 0
        }]
      }
    })

    const showButton = wrapper.find('[data-test="show-recipe-button"]')
    expect(showButton.exists()).toBe(true)
    await showButton.trigger('click')

    expect(wrapper.emitted('show-recipe')).toBeTruthy()
  })
})
