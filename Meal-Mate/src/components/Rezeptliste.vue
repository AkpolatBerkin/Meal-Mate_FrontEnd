<template>
  <div class="rezepte-liste">
    <h2>Rezepte 🍲</h2>
    <div class="rezepte-container">
      <div v-for="(rezept, index) in rezepte" :key="index" class="rezept-card">
        <h3>{{ rezept.name }}</h3>
        <p><strong>Kategorie:</strong> {{ rezept.kategorie }}</p>
        <p><strong>Zubereitung:</strong> {{ rezept.zubereitung }}</p>
        <p><strong>Dauer:</strong> {{ rezept.dauer }} Minuten</p>
        <p><strong>Portionen:</strong> {{ rezept.portionen }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Rezept {
  name: string;
  kategorie: string;
  zubereitung: string;
  dauer: number;
  portionen: number;
}

const rezepte = ref<Rezept[]>([])

onMounted(async () => {
  try {
    const response = await axios.get('https://meal-mate-backend-3gvc.onrender.com')
    rezepte.value = response.data
  } catch (error) {
    console.error('Fehler beim Laden der Rezepte:', error)
  }
})
</script>

<style scoped>
.rezepte-liste {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.rezepte-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.rezept-card {
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(6px);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  color: white;
  transition: transform 0.3s;
}

.rezept-card:hover {
  transform: translateY(-5px);
}
</style>
