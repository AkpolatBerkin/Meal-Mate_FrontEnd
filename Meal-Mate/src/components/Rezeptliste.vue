<template>
  <div class="desktop-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-content">
        <div class="stats-section">
          <h3 class="section-title">📊 Übersicht</h3>
          <div class="stat-cards">
            <div class="stat-card">
              <div class="stat-icon">📖</div>
              <div class="stat-content">
                <div class="stat-number">{{ rezepte.length }}</div>
                <div class="stat-label">Rezepte</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⭐</div>
              <div class="stat-content">
                <div class="stat-number">{{ averageRating }}</div>
                <div class="stat-label">Ø Bewertung</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⏱️</div>
              <div class="stat-content">
                <div class="stat-number">{{ averageTime }}</div>
                <div class="stat-label">Ø Zeit (min)</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Rezept-Detail-Modal -->
        <Transition name="modal">
          <div v-if="showRecipeModal" class="modal-overlay" @click.self="showRecipeModal = false">
            <div class="modal-content">
              <button class="modal-close" @click="showRecipeModal = false">&times;</button>

              <div v-if="selectedRecipe" class="recipe-details">
                <h2 class="recipe-title">{{ selectedRecipe.name }}</h2>
                <div class="recipe-meta">
                  <span class="category">{{ selectedRecipe.kategorie }}</span>
                  <span>⏱️ {{ selectedRecipe.dauer }} Minuten</span>
                  <span>👥 {{ selectedRecipe.portionen }} Personen</span>
                </div>

                <div class="recipe-content">
                  <h3>Zubereitung</h3>
                  <p class="recipe-preparation">{{ selectedRecipe.zubereitung }}</p>

                  <div v-if="selectedRecipe.zutaten" class="recipe-ingredients">
                    <h3>Zutaten</h3>
                    <ul>
                      <li
                        v-for="(ingredient, index) in selectedRecipe.zutaten.split('\n')"
                        :key="index"
                      >
                        {{ ingredient }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <div class="filters-section">
          <h3 class="section-title">🔍 Filter</h3>
          <div class="filter-group">
            <label>Kategorie</label>
            <select v-model="selectedCategory" class="filter-select">
              <option value="">Alle Kategorien</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <div class="filter-group">
            <label>Zubereitungszeit</label>
            <select v-model="selectedTimeRange" class="filter-select">
              <option value="">Alle Zeiten</option>
              <option value="quick">Schnell (&lt; 30 min)</option>
              <option value="medium">Mittel (30-60 min)</option>
              <option value="long">Langsam (&gt; 60 min)</option>
            </select>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Header Section -->
      <header class="content-header">
        <div class="header-left">
          <h1 class="page-title">Rezept-Sammlung</h1>
          <p class="page-subtitle">Verwalten Sie Ihre kulinarischen Kreationen</p>
        </div>
        <div class="header-right">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rezepte durchsuchen..."
              class="search-input"
            />
          </div>
        </div>
      </header>

      <!-- Status Messages -->
      <Transition name="slide-down">
        <div v-if="loading" class="status-banner loading">
          <div class="status-content">
            <div class="loading-spinner"></div>
            <span>Rezepte werden geladen...</span>
          </div>
        </div>
      </Transition>

      <Transition name="slide-down">
        <div v-if="error" class="status-banner error">
          <div class="status-content">
            <span class="status-icon">⚠️</span>
            <div>
              <strong>Fehler beim Laden:</strong> {{ errorMessage }}
              <button @click="ladeRezepte" class="retry-btn">Erneut versuchen</button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Add Recipe Form -->
      <section id="add-form" class="form-section">
        <div class="form-header">
          <h2 class="form-title">Neues Rezept erstellen</h2>
          <button @click="toggleForm" class="form-toggle">
            {{ showForm ? 'Ausblenden' : 'Anzeigen' }}
          </button>
        </div>

        <Transition name="expand">
          <div v-if="showForm" class="form-container">
            <form @submit.prevent="rezeptHinzufuegen" class="recipe-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="name">Rezeptname *</label>
                  <input
                    id="name"
                    v-model="neuesRezept.name"
                    type="text"
                    placeholder="z.B. Spaghetti Carbonara"
                    required
                    class="form-input"
                  />
                </div>

                <div class="form-group">
                  <label for="kategorie">Kategorie *</label>
                  <select
                    id="kategorie"
                    v-model="neuesRezept.kategorie"
                    required
                    class="form-input"
                  >
                    <option value="" disabled>Bitte wählen</option>
                    <option value="Frühstück">Frühstück</option>
                    <option value="Mittagessen">Mittagessen</option>
                    <option value="Abendessen">Abendessen</option>
                    <option value="Snacks">Snacks</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="dauer">Zubereitungszeit *</label>
                  <div class="input-with-unit">
                    <input
                      id="dauer"
                      v-model.number="neuesRezept.dauer"
                      type="number"
                      placeholder="30"
                      required
                      min="1"
                      class="form-input"
                    />
                    <span class="input-unit">Minuten</span>
                  </div>
                </div>

                <div class="form-group">
                  <label for="portionen">Portionen *</label>
                  <div class="input-with-unit">
                    <input
                      id="portionen"
                      v-model.number="neuesRezept.portionen"
                      type="number"
                      placeholder="4"
                      required
                      min="1"
                      class="form-input"
                    />
                    <span class="input-unit">Personen</span>
                  </div>
                </div>
              </div>

              <div class="form-group full-width">
                <label for="zubereitung">Zubereitung *</label>
                <textarea
                  id="zubereitung"
                  v-model="neuesRezept.zubereitung"
                  placeholder="Beschreiben Sie die Zubereitung Schritt für Schritt..."
                  required
                  rows="6"
                  class="form-textarea"
                ></textarea>
              </div>

              <div class="form-actions">
                <button type="button" @click="resetForm" class="btn-secondary">Zurücksetzen</button>
                <button type="submit" :disabled="loading" class="btn-primary">
                  <span v-if="!loading">
                    <span class="button-icon">✨</span>
                    Rezept speichern
                  </span>
                  <span v-else class="loading-content">
                    <div class="mini-spinner"></div>
                    Wird gespeichert...
                  </span>
                </button>
              </div>
            </form>
          </div>
        </Transition>
      </section>

      <!-- Recipes Grid -->
      <section class="recipes-section">
        <div class="recipes-header">
          <h2 class="section-title">Ihre Rezepte ({{ filteredRecipes.length }})</h2>
          <div class="view-controls">
            <button
              @click="viewMode = 'grid'"
              :class="['view-btn', { active: viewMode === 'grid' }]"
            >
              <span class="view-icon">⊞</span>
              Grid
            </button>
            <button
              @click="viewMode = 'list'"
              :class="['view-btn', { active: viewMode === 'list' }]"
            >
              <span class="view-icon">☰</span>
              Liste
            </button>
          </div>
        </div>

        <TransitionGroup
          :name="viewMode === 'grid' ? 'recipe-grid' : 'recipe-list'"
          tag="div"
          :class="['recipes-container', viewMode]"
        >
          <div
            v-for="rezept in filteredRecipes"
            :key="rezept.id"
            class="recipe-card"
            :class="viewMode"
          >
            <div class="recipe-content">
              <div class="recipe-header">
                <h3 class="recipe-title">{{ rezept.name }}</h3>
                <span class="recipe-category">{{ rezept.kategorie }}</span>
              </div>

              <div class="recipe-description">
                <p>{{ truncateText(rezept.zubereitung, 120) }}</p>
              </div>

              <div class="recipe-meta">
                <div class="meta-item">
                  <span class="meta-icon">⭐</span>
                  <StarRating
                    v-model="rezept.bewertung"
                    @update:modelValue="bewerteRezept(rezept, $event)"
                    :showValue="true"
                  />
                  <span class="meta-icon">⏱️</span>
                  <span>{{ rezept.dauer }} min</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">👥</span>
                  <span>{{ rezept.portionen }} Pers.</span>
                </div>
              </div>
            </div>

            <div class="recipe-actions">
              <button class="action-btn view" @click="viewRecipe(rezept)">
                <span class="btn-icon">👁️</span>
                Anzeigen
              </button>
              <button class="action-btn edit" @click="startEditing(rezept)">
                <span class="btn-icon">✏️</span>
                Bearbeiten
              </button>
              <button
                class="action-btn delete"
                @click="rezeptLoeschen(rezept.id)"
                :disabled="loading"
              >
                <span class="btn-icon">🗑️</span>
                Löschen
              </button>
            </div>
          </div>
        </TransitionGroup>

        <!-- Empty State -->
        <div v-if="filteredRecipes.length === 0 && !loading && !error" class="empty-state">
          <div class="empty-content">
            <div class="empty-icon">🍽️</div>
            <h3>Keine Rezepte gefunden</h3>
            <p>
              {{
                searchQuery
                  ? 'Keine Rezepte entsprechen Ihrer Suche.'
                  : 'Erstellen Sie Ihr erstes Rezept!'
              }}
            </p>
            <button @click="scrollToForm" class="empty-action-btn">Erstes Rezept hinzufügen</button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import StarRating from './StarRating.vue'
import { apiService } from '@/services/api.service'

interface Rezept {
  id: number
  name: string
  kategorie: string
  zubereitung: string
  dauer: number
  portionen: number
  zutaten?: string | null
  bewertung: number // Neue Eigenschaft
}

const rezepte = ref<Rezept[]>([])
const loading = ref(false)
const error = ref(false)
const errorMessage = ref('')
const showForm = ref(true)
const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedTimeRange = ref('')

// Rezepte laden
const loadRezepte = async () => {
  try {
    const response = await apiService.getAllRezepte()
    rezepte.value = response.data
  } catch (error) {
    console.error('Fehler beim Laden der Rezepte:', error)
  }
}

const neuesRezept = ref({
  name: '',
  kategorie: '',
  zubereitung: '',
  dauer: 0,
  portionen: 0,
  bewertung: 0,
})

const selectedRecipe = ref<Rezept | null>(null)
const showRecipeModal = ref(false)

function viewRecipe(rezept: Rezept) {
  selectedRecipe.value = rezept
  showRecipeModal.value = true
}
const API_BASE_URL = 'https://meal-mate-backend-3gvc.onrender.com/api/rezept'

// Computed Properties
const categories = computed(() => {
  const cats = [...new Set(rezepte.value.map((r) => r.kategorie))]
  return cats.sort()
})

const averageRating = computed(() => {
  if (rezepte.value.length === 0) return '0'
  const sum = rezepte.value.reduce((acc, r) => acc + (r.bewertung || 0), 0)
  return (sum / rezepte.value.length).toFixed(1)
})

const averageTime = computed(() => {
  if (rezepte.value.length === 0) return '0'
  const total = rezepte.value.reduce((sum, r) => sum + r.dauer, 0)
  return Math.round(total / rezepte.value.length).toString()
})

const filteredRecipes = computed(() => {
  let filtered = rezepte.value

  // Suchfilter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r.kategorie.toLowerCase().includes(query) ||
        r.zubereitung.toLowerCase().includes(query),
    )
  }

  // Kategorie-Filter
  if (selectedCategory.value) {
    filtered = filtered.filter((r) => r.kategorie === selectedCategory.value)
  }

  // Zeit-Filter
  if (selectedTimeRange.value) {
    filtered = filtered.filter((r) => {
      switch (selectedTimeRange.value) {
        case 'quick':
          return r.dauer < 30
        case 'medium':
          return r.dauer >= 30 && r.dauer <= 60
        case 'long':
          return r.dauer > 60
        default:
          return true
      }
    })
  }

  return filtered
})

// Methoden
async function ladeRezepte() {
  loading.value = true
  error.value = false
  errorMessage.value = ''

  try {
    const response = await axios.get(API_BASE_URL, {
      timeout: 15000,
    })
    rezepte.value = response.data
  } catch (err: any) {
    error.value = true
    if (err.code === 'ECONNABORTED') {
      errorMessage.value = 'Timeout: Backend antwortet nicht'
    } else if (err.response?.status) {
      errorMessage.value = `Backend-Fehler: ${err.response.status}`
    } else {
      errorMessage.value = 'Backend nicht erreichbar'
    }
  } finally {
    loading.value = false
  }
}
async function bewerteRezept(rezept: Rezept, newRating: number) {
  try {
    // Optimistische Aktualisierung
    const index = rezepte.value.findIndex((r) => r.id === rezept.id)
    if (index !== -1) {
      rezepte.value[index] = { ...rezept, bewertung: newRating }
    }

    // Backend-Update mit vollständigem Objekt
    const updatedRezept = {
      id: rezept.id,
      name: rezept.name,
      kategorie: rezept.kategorie,
      zubereitung: rezept.zubereitung,
      dauer: rezept.dauer,
      portionen: rezept.portionen,
      zutaten: rezept.zutaten,
      bewertung: newRating,
    }

    await axios.put(`${API_BASE_URL}/${rezept.id}`, updatedRezept)

    // Kein erneutes Laden nötig, da optimistische Aktualisierung
  } catch (err) {
    // Fehlerbehandlung
    const index = rezepte.value.findIndex((r) => r.id === rezept.id)
    if (index !== -1) {
      rezepte.value[index] = { ...rezept } // Setze ursprünglichen Wert zurück
    }
    error.value = true
    errorMessage.value = 'Fehler beim Bewerten des Rezepts'
    setTimeout(() => {
      error.value = false
      errorMessage.value = ''
    }, 3000)
  }
}

async function rezeptHinzufuegen() {
  if (loading.value) return

  loading.value = true
  error.value = false

  try {
    // Speichere aktuelle Bewertungen
    const currentRatings = new Map(rezepte.value.map((r: Rezept) => [r.id, r.bewertung]))

    // Füge neues Rezept hinzu
    await axios.post(API_BASE_URL, neuesRezept.value, {
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' },
    })

    // Lade Rezepte neu
    const response = await axios.get(API_BASE_URL)

    // Stelle Bewertungen wieder her
    rezepte.value = response.data.map((r: Rezept) => ({
      ...r,
      bewertung: currentRatings.get(r.id) || r.bewertung || 0,
    }))

    resetForm()
  } catch (err: any) {
    error.value = true
    errorMessage.value = 'Fehler beim Hinzufügen des Rezepts'
  } finally {
    loading.value = false
  }
}

async function rezeptLoeschen(id: number) {
  if (!confirm('Möchten Sie dieses Rezept wirklich löschen?')) return

  try {
    await axios.delete(`${API_BASE_URL}/${id}`, { timeout: 15000 })
    await ladeRezepte()
  } catch (err) {
    error.value = true
    errorMessage.value = 'Fehler beim Löschen des Rezepts'
  }
}
function startEditing(rezept: Rezept) {
  neuesRezept.value = { ...rezept }
  showForm.value = true
  document.getElementById('add-form')?.scrollIntoView({ behavior: 'smooth' })
}

function resetForm() {
  neuesRezept.value = {
    name: '',
    kategorie: '',
    zubereitung: '',
    dauer: 0,
    portionen: 0,
    bewertung: 0,
  }
}

function toggleForm() {
  showForm.value = !showForm.value
}

function scrollToForm() {
  showForm.value = true
  document.getElementById('add-form')?.scrollIntoView({ behavior: 'smooth' })
}

function truncateText(text: string, maxLength: number) {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

onMounted(() => {
  ladeRezepte()
})
</script>

<style scoped>
.desktop-layout {
  display: grid;
  grid-template-columns: 300px 5fr;
  gap: 2rem;
  min-height: calc(100vh - 140px);
}

/* Sidebar */
.sidebar {
  background: var(--card-background);
  backdrop-filter: blur(20px);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 100px;
  box-shadow: var(--shadow-lg);
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.stat-cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--card-border);
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.filter-group {
  margin-bottom: 1rem;
}

.filter-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.filter-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.9rem;
}

.action-button {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.action-button.primary {
  background: var(--button-primary);
  color: white;
}

.action-button.secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--card-border);
}

.action-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Main Content */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: var(--text-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.header-right {
  flex: 0 0 auto;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid var(--card-border);
  border-radius: 12px;
  background: var(--card-background);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

/* Status Banner */
.status-banner {
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.status-banner.loading {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.status-banner.error {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(238, 90, 36, 0.1));
  border: 1px solid rgba(255, 107, 107, 0.2);
}

.status-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.retry-btn {
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 1rem;
}

/* Form Section */
.form-section {
  background: var(--card-background);
  backdrop-filter: blur(20px);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--card-border);
}

.form-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.form-toggle {
  background: var(--button-primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.form-container {
  padding: 2rem;
}

.recipe-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.form-input,
.form-textarea {
  padding: 0.875rem 1rem;
  border: 2px solid var(--card-border);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.input-with-unit {
  position: relative;
}

.input-unit {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 0.9rem;
  pointer-events: none;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--button-primary);
  color: white;
  border: none;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--card-border);
}

.btn-primary:hover,
.btn-secondary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.mini-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Recipes Section */
.recipes-section {
  background: var(--card-background);
  backdrop-filter: blur(20px);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--shadow-lg);
}

.recipes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.view-controls {
  display: flex;
  gap: 0.5rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 0.25rem;
  border: 1px solid var(--card-border);
}

.view-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  color: var(--text-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.view-btn.active {
  background: var(--button-primary);
  color: white;
}

.recipes-container {
  display: grid;
  gap: 1.5rem;
}

.recipes-container.grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.recipes-container.list {
  grid-template-columns: 1fr;
}

.recipe-card {
  background: linear-gradient(to right bottom, var(--bg-secondary), var(--card-background));
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 1.2rem;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;
}

/* Spezifische Styles für Grid-Ansicht */
.recipe-card.grid {
  padding: 1.8rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Spezifische Styles für Listen-Ansicht */
.recipe-card.list {
  padding: 1.5rem;
  display: flex; /* Änderung von grid zu flex */
  flex-direction: row;
  align-items: flex-start;
  gap: 2rem;
}
.recipe-card.list .recipe-content {
  flex: 1;
}
.recipe-card.list .recipe-actions {
  flex-direction: column;
  gap: 0.8rem;
  width: 120px; /* Fixe Breite für Aktions-Buttons */
  flex-shrink: 0; /* Verhindert Schrumpfen */
}

.recipe-card.list .action-btn {
  width: 100%;
  justify-content: center;
}
.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.recipe-content {
  flex: 1;
  margin-bottom: 1rem;
}

.recipe-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.recipe-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
}

.recipe-category {
  background: var(--button-primary);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.recipe-description {
  border-left: 3px solid var(--button-primary);
  padding-left: 1rem;
  margin: 0.5rem 0;
}

.recipe-description p {
  color: var(--text-secondary);
  line-height: 1.4;
  margin: 0;
  font-size: 0.9rem;
}
.recipe-meta {
  display: flex;
  gap: 1rem;
  padding: 0.7rem 0;
  border-top: 1px solid var(--card-border);
  border-bottom: 1px solid var(--card-border);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.meta-icon {
  font-size: 1.2rem;
  opacity: 0.8;
}

.recipe-actions {
  display: flex;
  gap: 0.8rem;
  margin-top: auto;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  justify-content: center;
}

.action-btn.view {
  background: var(--button-success);
  color: white;
}

.action-btn.edit {
  background: var(--button-primary);
  color: white;
}

.action-btn.delete {
  background: var(--button-danger);
  color: white;
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-content {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.empty-action-btn {
  background: var(--button-primary);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.empty-action-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Animations */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: scaleY(0);
  transform-origin: top;
}

.recipe-grid-enter-active,
.recipe-list-enter-active {
  transition: all 0.5s ease;
}

.recipe-grid-leave-active,
.recipe-list-leave-active {
  transition: all 0.3s ease;
}

.recipe-grid-enter-from,
.recipe-list-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.recipe-grid-leave-to,
.recipe-list-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.recipes-container.list {
  grid-template-columns: 1fr;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: var(--text-primary);
  font-size: 1rem;
}

.meta-icon {
  font-size: 1.2rem;
  opacity: 0.8;
}

.recipe-actions {
  display: flex;
  gap: 0.8rem;
  margin-top: auto;
}

/* Responsive Anpassungen */
@media (max-width: 1200px) {
  .recipe-card.list .recipe-content {
    grid-template-columns: 1fr;
  }

  .recipe-card.list .recipe-meta {
    grid-column: 1;
    flex-direction: row;
    padding-top: 1rem;
    border-top: 1px solid var(--card-border);
  }
}

@media (max-width: 768px) {
  .recipe-card.list {
    flex-direction: column;
  }

  .recipe-card.list .recipe-actions {
    flex-direction: row;
    width: 100%;
  }

  .recipe-card.list .action-btn {
    flex: 1;
  }
}
/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--card-background);
  border-radius: 16px;
  padding: 2rem;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: var(--shadow-xl);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
}

.recipe-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.recipe-meta {
  display: flex;
  gap: 1rem;
  color: var(--text-secondary);
  flex-wrap: wrap;
}

.recipe-meta .category {
  background: var(--button-secondary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.recipe-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.recipe-preparation {
  white-space: pre-line;
  line-height: 1.6;
}

.recipe-ingredients ul {
  list-style-type: none;
  padding-left: 0;
}

.recipe-ingredients li {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--card-border);
}

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: translateY(-20px);
  opacity: 0;
}

.recipe-meta .meta-item .rating {
  margin-top: -2px;
}

.recipe-meta .meta-item .star {
  font-size: 1.2rem;
}

.recipe-meta .meta-item .rating-value {
  font-size: 0.9rem;
}
</style>
