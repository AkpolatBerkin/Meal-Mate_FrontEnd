<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Rezeptliste from './components/Rezeptliste.vue'

const isDarkMode = ref(false)

// Dark Mode aus localStorage laden
onMounted(() => {
  const savedMode = localStorage.getItem('darkMode')
  if (savedMode) {
    isDarkMode.value = JSON.parse(savedMode)
  } else {
    // System-Präferenz prüfen
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  updateTheme()
})

// Theme umschalten
function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', JSON.stringify(isDarkMode.value))
  updateTheme()
}

// Theme anwenden
function updateTheme() {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>

<template>
  <div id="app">
    <header>
      <h1>Meal Mate</h1>
      <button @click="toggleDarkMode" class="theme-toggle" :aria-label="isDarkMode ? 'Zu hellem Modus wechseln' : 'Zu dunklem Modus wechseln'">
        <span class="theme-icon">{{ isDarkMode ? '☀️' : '🌙' }}</span>
      </button>
    </header>

    <main>
      <Rezeptliste />
    </main>
  </div>
</template>

<style scoped>
/* Vollbild für app-Container */
#app {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background: transparent;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

/* Header Styling */
header {
  padding: 2rem 1.5rem 1rem;
  text-align: center;
  font-size: 2.8rem;
  font-weight: 300;
  color: var(--text-primary);
  letter-spacing: -1px;
  border-bottom: 1px solid var(--border-color);
  position: relative;
  transition: all 0.3s ease;
}

/* Theme Toggle Button */
.theme-toggle {
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.theme-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 16px var(--shadow-color);
}

.theme-icon {
  font-size: 1.5rem;
  transition: transform 0.3s ease;
}

.theme-toggle:hover .theme-icon {
  transform: rotate(15deg);
}

/* Main nimmt den verbleibenden Platz */
main {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem 1rem;
  box-sizing: border-box;
  overflow-y: auto;
}

/* Responsive Design für Button */
@media (max-width: 768px) {
  .theme-toggle {
    top: 1.5rem;
    right: 1.5rem;
    width: 45px;
    height: 45px;
  }

  .theme-icon {
    font-size: 1.3rem;
  }
}
</style>

<style>
/* CSS Custom Properties für Light Mode */
:root {
  --bg-primary: #fafafa;
  --bg-secondary: #ffffff;
  --text-primary: #2c3e50;
  --text-secondary: #5a6c7d;
  --text-muted: #95a5a6;
  --border-color: #f0f0f0;
  --border-hover: #e8e8e8;
  --card-background: #ffffff;
  --shadow-color: rgba(0, 0, 0, 0.06);
  --shadow-hover: rgba(0, 0, 0, 0.1);
  --button-primary: #2c3e50;
  --button-primary-hover: #34495e;
  --accent-color: #3498db;
  --accent-light: rgba(52, 152, 219, 0.1);
}

/* CSS Custom Properties für Dark Mode */
.dark {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --border-color: #374151;
  --border-hover: #4b5563;
  --card-background: #2d2d2d;
  --shadow-color: rgba(0, 0, 0, 0.3);
  --shadow-hover: rgba(0, 0, 0, 0.4);
  --button-primary: #3b82f6;
  --button-primary-hover: #2563eb;
  --accent-color: #60a5fa;
  --accent-light: rgba(96, 165, 250, 0.1);
}

/* Global styles */
html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  background: var(--bg-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: var(--text-primary);
  box-sizing: border-box;
  line-height: 1.6;
  transition: background-color 0.3s ease, color 0.3s ease;
}

* {
  box-sizing: border-box;
}
</style>
