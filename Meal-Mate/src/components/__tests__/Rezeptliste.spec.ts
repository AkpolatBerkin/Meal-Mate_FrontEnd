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

  // Korrektur für leere Liste Test
  it('zeigt leere Liste wenn keine Rezepte vorhanden', async () => {
    const wrapper = mount(Rezeptliste, {
      props: {
        recipes: [] // Leeres Array
      }
    })
    await wrapper.vm.$nextTick()

    // Stellen Sie sicher, dass diese CSS-Klassen in der Komponente existieren
    const emptyState = wrapper.find('[data-test="empty-state"]') // Besserer Selektor
    expect(emptyState.exists()).toBe(true)
  })

  // Korrektur für Filter Test
  it('filtert Rezepte nach Kategorie', async () => {
    const testRecipes = [
      {id: 1, title: 'Pizza Margherita', category: 'Mittagessen'},
      {id: 2, title: 'Pasta', category: 'Abendessen'}
    ]

    const wrapper = mount(Rezeptliste, {
      props: {
        recipes: testRecipes
      }
    })

    await wrapper.find('[data-test="filter-select"]').setValue('Mittagessen')
    await wrapper.vm.$nextTick()

    const recipeCards = wrapper.findAll('[data-test="recipe-card"]')
    expect(recipeCards).toHaveLength(1)
  })

  // Korrektur für Modal Test
  it('öffnet Modal beim Klick auf Anzeigen-Button', async () => {
    const wrapper = mount(Rezeptliste, {
      props: {
        recipes: [{id: 1, title: 'Test Rezept'}]
      }
    })

    const showButton = wrapper.find('[data-test="show-recipe-button"]')
    expect(showButton.exists()).toBe(true)
    await showButton.trigger('click')

    expect(wrapper.emitted('show-recipe')).toBeTruthy()
  })
})
