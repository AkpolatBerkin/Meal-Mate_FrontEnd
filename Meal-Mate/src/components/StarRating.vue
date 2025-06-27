<template>
  <div class="rating">
    <button
      v-for="star in 5"
      :key="star"
      class="star-btn"
      @click="updateRating(star)"
      @mouseenter="hoverRating = star"
      @mouseleave="hoverRating = 0"
    >
      <span class="star">
        {{ (hoverRating || rating) >= star ? '★' : '☆' }}
      </span>
    </button>
    <span v-if="showValue" class="rating-value">{{ rating }}/5</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue: number
  showValue?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const rating = computed(() => props.modelValue)
const hoverRating = ref(0)

function updateRating(value: number) {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.star-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  transition: transform 0.2s ease;
}

.star-btn:hover {
  transform: scale(1.1);
}

.star {
  font-size: 1.5rem;
  color: #ffd700;
}

.rating-value {
  margin-left: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}
</style>
