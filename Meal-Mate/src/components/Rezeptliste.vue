<template>
  <div class="rezepte-liste">
    <h2>Rezepte 🍲</h2>

    <!-- Status-Anzeige -->
    <div v-if="loading" class="status-message">
      Lade Rezepte...
    </div>

    <div v-if="error" class="error-message">
      ❌ {{ errorMessage }}
    </div>

    <div v-if="!error && !loading && rezepte.length > 0" class="success-message">
      ✅ {{ rezepte.length }} Rezepte geladen
    </div>

    <form @submit.prevent="rezeptHinzufuegen" class="rezept-formular">
      <input v-model="neuesRezept.name" placeholder="Name" required />
      <input v-model="neuesRezept.kategorie" placeholder="Kategorie" required />
      <textarea v-model="neuesRezept.zubereitung" placeholder="Zubereitung" required rows="3"></textarea>
      <input v-model.number="neuesRezept.dauer" placeholder="Dauer (Minuten)" type="number" required />
      <input v-model.number="neuesRezept.portionen" placeholder="Portionen" type="number" required />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Wird hinzugefügt...' : 'Rezept hinzufügen' }}
      </button>
    </form>

    <div class="rezepte-container">
      <div v-for="rezept in rezepte" :key="rezept.id" class="rezept-card">
        <h3>{{ rezept.name }}</h3>
        <p><strong>Kategorie:</strong> {{ rezept.kategorie }}</p>
        <p><strong>Zubereitung:</strong> {{ rezept.zubereitung }}</p>
        <p><strong>Dauer:</strong> {{ rezept.dauer }} Minuten</p>
        <p><strong>Portionen:</strong> {{ rezept.portionen }}</p>
        <button @click="rezeptLoeschen(rezept.id)" class="delete-btn" :disabled="loading">
          🗑️ Löschen
        </button>
      </div>
    </div>

    <div v-if="rezepte.length === 0 && !loading && !error" class="no-recipes">
      Noch keine Rezepte vorhanden. Fügen Sie Ihr erstes Rezept hinzu! 👆
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Rezept {
  id: number;
  name: string;
  kategorie: string;
  zubereitung: string;
  dauer: number;
  portionen: number;
  zutaten?: string | null;
}

const rezepte = ref<Rezept[]>([])
const loading = ref(false)
const error = ref(false)
const errorMessage = ref('')

const neuesRezept = ref({
  name: '',
  kategorie: '',
  zubereitung: '',
  dauer: 0,
  portionen: 0
})

const API_BASE_URL = 'https://meal-mate-backend-3gvc.onrender.com/api/rezept'

// Rezepte vom Backend laden
async function ladeRezepte() {
  loading.value = true
  error.value = false
  errorMessage.value = ''

  try {
    const response = await axios.get(API_BASE_URL, {
      timeout: 15000 // 15 Sekunden Timeout für Render.com
    })
    rezepte.value = response.data
    console.log(`${response.data.length} Rezepte geladen`)
  } catch (err: any) {
    error.value = true
    if (err.code === 'ECONNABORTED') {
      errorMessage.value = 'Timeout: Backend antwortet nicht'
    } else if (err.response?.status) {
      errorMessage.value = `Backend-Fehler: ${err.response.status}`
    } else {
      errorMessage.value = 'Backend nicht erreichbar'
    }
    console.error('Fehler beim Laden der Rezepte:', err)
  } finally {
    loading.value = false
  }
}

// Neues Rezept hinzufügen
async function rezeptHinzufuegen() {
  if (loading.value) return

  loading.value = true
  error.value = false
  errorMessage.value = ''

  try {
    const response = await axios.post(API_BASE_URL, neuesRezept.value, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log('Rezept hinzugefügt:', response.data)

    // Formular zurücksetzen
    neuesRezept.value = { name: '', kategorie: '', zubereitung: '', dauer: 0, portionen: 0 }

    // Rezepte neu laden
    await ladeRezepte()
  } catch (err: any) {
    error.value = true
    if (err.code === 'ECONNABORTED') {
      errorMessage.value = 'Timeout: Rezept konnte nicht hinzugefügt werden'
    } else if (err.response?.status) {
      errorMessage.value = `Fehler beim Hinzufügen: ${err.response.status}`
    } else {
      errorMessage.value = 'Rezept konnte nicht hinzugefügt werden'
    }
    console.error('Fehler beim Hinzufügen:', err)
  } finally {
    loading.value = false
  }
}

// Rezept löschen
async function rezeptLoeschen(id: number) {
  if (!confirm('Möchten Sie dieses Rezept wirklich löschen?')) {
    return
  }

  if (loading.value) return

  loading.value = true
  error.value = false
  errorMessage.value = ''

  try {
    await axios.delete(`${API_BASE_URL}/${id}`, {
      timeout: 15000
    })
    console.log(`Rezept ${id} gelöscht`)

    // Rezepte neu laden
    await ladeRezepte()
  } catch (err: any) {
    error.value = true
    if (err.code === 'ECONNABORTED') {
      errorMessage.value = 'Timeout: Rezept konnte nicht gelöscht werden'
    } else if (err.response?.status) {
      errorMessage.value = `Fehler beim Löschen: ${err.response.status}`
    } else {
      errorMessage.value = 'Rezept konnte nicht gelöscht werden'
    }
    console.error('Fehler beim Löschen:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  ladeRezepte()
})
</script>

<style scoped>
.rezepte-liste {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.rezepte-liste h2 {
  font-size: 1.8rem;
  font-weight: 400;
  margin-bottom: 2rem;
  color: var(--text-primary);
  text-align: center;
  transition: color 0.3s ease;
}

.status-message {
  text-align: center;
  padding: 1rem;
  background: var(--accent-light);
  color: var(--accent-color);
  border-radius: 8px;
  margin-bottom: 2rem;
  font-weight: 500;
}

.success-message {
  text-align: center;
  padding: 1rem;
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
  border-radius: 8px;
  margin-bottom: 2rem;
  font-weight: 500;
}

.error-message {
  text-align: center;
  padding: 1rem;
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border-radius: 8px;
  margin-bottom: 2rem;
  font-weight: 500;
}

.no-recipes {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
  font-size: 1.1rem;
  font-style: italic;
}

.delete-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 1rem;
  transition: all 0.2s ease;
}

.delete-btn:hover:not(:disabled) {
  background: #c82333;
  transform: translateY(-1px);
}

.delete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.rezept-formular {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: var(--card-background);
  border-radius: 16px;
  box-shadow: 0 1px 3px var(--shadow-color);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.rezept-formular input,
.rezept-formular textarea {
  padding: 0.875rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-family: inherit;
  resize: vertical;
}

.rezept-formular textarea {
  grid-column: 1 / -1;
}

.rezept-formular input:focus,
.rezept-formular textarea:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px var(--accent-light);
}

.rezept-formular input::placeholder,
.rezept-formular textarea::placeholder {
  color: var(--text-muted);
}

.rezept-formular button {
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  border: none;
  background: var(--button-primary);
  color: white;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
  grid-column: 1 / -1;
  justify-self: center;
  max-width: 200px;
}

.rezept-formular button:hover:not(:disabled) {
  background: var(--button-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--shadow-hover);
}

.rezept-formular button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.rezepte-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.rezept-card {
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.75rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.rezept-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent-color), var(--button-primary));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.rezept-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px var(--shadow-hover);
  border-color: var(--border-hover);
}

.rezept-card:hover::before {
  opacity: 1;
}

.rezept-card h3 {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  line-height: 1.3;
  transition: color 0.3s ease;
}

.rezept-card p {
  margin: 0.75rem 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
  transition: color 0.3s ease;
}

.rezept-card p strong {
  color: var(--text-primary);
  font-weight: 600;
}

.rezept-card p:last-child {
  margin-bottom: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .rezept-formular {
    grid-template-columns: 1fr;
    padding: 1.5rem;
  }

  .rezepte-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .rezept-card {
    padding: 1.5rem;
  }
}
</style>
