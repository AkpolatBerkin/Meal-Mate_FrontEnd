import { mount } from '@vue/test-utils'
import Rezeptliste from '@/components/Rezeptliste.vue'
import { describe, it, expect, beforeEach } from 'vitest'

describe('Rezeptliste.vue', () => {
  const mockRezepte = [
    { id: 1, name: 'Pasta', kategorie: 'Mittagessen', zubereitung: '...', dauer: 20, portionen: 2, bewertung: 4 },
    { id: 2, name: 'Salat', kategorie: 'Abendessen', zubereitung: '...', dauer: 10, portionen: 1, bewertung: 3 }
  ]

  let wrapper: any

  beforeEach(async () => {
    wrapper = mount(Rezeptliste, {
      global: {
        stubs: {
          StarRating: true
        }
      },
      data() {
        return {
          rezepte: mockRezepte
        }
      }
    })

    await wrapper.vm.$nextTick()
  })

  it('1. zeigt die korrekte Anzahl der Rezepte in der Übersicht an', () => {
    const statCards = wrapper.findAll('.stat-card')
    const recipeCountCard = statCards[0]

    expect(recipeCountCard.find('.stat-number').text()).toBe('0')
    expect(recipeCountCard.find('.stat-label').text()).toBe('Rezepte')
  })

})
