<template>
  <div class="rezepte-liste">
    <h2>Rezepte 🍲</h2>
    <form @submit.prevent="rezeptHinzufuegen" class="rezept-formular">
      <input v-model="neuesRezept.name" placeholder="Name" required />
      <input v-model="neuesRezept.kategorie" placeholder="Kategorie" required />
      <input v-model="neuesRezept.zubereitung" placeholder="Zubereitung" required />
      <input v-model.number="neuesRezept.dauer" placeholder="Dauer" type="number" required />
      <input v-model.number="neuesRezept.portionen" placeholder="Portionen" type="number" required />
      <button type="submit">Rezept hinzufügen</button>
    </form>
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

const neuesRezept = ref<Rezept>({
  name: '',
  kategorie: '',
  zubereitung: '',
  dauer: 0,
  portionen: 0
})

async function ladeRezepte() {
  try {
    const response = await axios.get('https://meal-mate-backend-3gvc.onrender.com/api/rezepte')
    rezepte.value = response.data
  } catch (error) {
    console.error('Fehler beim Laden der Rezepte:', error)
  }
}

async function rezeptHinzufuegen() {
  try {
    await axios.post('https://meal-mate-backend-3gvc.onrender.com/api/rezepte', neuesRezept.value)
    await ladeRezepte()
    // Felder zurücksetzen
    neuesRezept.value = { name: '', kategorie: '', zubereitung: '', dauer: 0, portionen: 0 }
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Rezepts:', error)
  }
}

onMounted(ladeRezepte)
</script>

<style scoped>
.rezepte-liste {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.rezept-formular {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.rezept-formular input {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.rezept-formular button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  background: #4caf50;
  color: white;
  cursor: pointer;
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
