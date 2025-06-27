// src/components/__tests__/StarRating.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import StarRating from '../StarRating.vue'

describe('StarRating.vue', () => {
  it('zeigt korrekte Anzahl Sterne', () => {
    const wrapper = mount(StarRating, {
      props: { modelValue: 3 }
    })
    expect(wrapper.findAll('.star')).toHaveLength(5)
  })
})
