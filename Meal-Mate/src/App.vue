<template>
  <div id="app">
    <!-- Animated Background -->
    <div class="background-animation">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="nav-container">
        <!-- Logo-Bereich -->
        <div class="nav-left">
          <div class="logo">
            <span class="logo-icon">🍽️</span>
            <span class="logo-text">Meal Mate</span>
            <span class="version-badge">Pro</span>
          </div>
        </div>

        <div class="nav-center">
          <div class="nav-links">
            <router-link to="/rezepte" class="nav-link" active-class="active">
              <span class="nav-icon">📖</span>
              Rezepte
            </router-link>
          </div>
        </div>

        <div class="nav-right">
          <div class="nav-buttons">
            <Timer />
            <button @click="toggleDarkMode" class="theme-toggle">
              <span class="toggle-icon">{{ isDarkMode ? '🌙' : '☀️' }}</span>
              <span class="toggle-text">{{ isDarkMode ? 'Dark' : 'Light' }}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-container">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Timer from './components/Timer.vue'
const isDarkMode = ref(false)

onMounted(() => {
  const savedMode = localStorage.getItem('darkMode')
  if (savedMode) {
    isDarkMode.value = JSON.parse(savedMode)
  } else {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  updateTheme()
})

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', JSON.stringify(isDarkMode.value))
  updateTheme()
}

function updateTheme() {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
}

/* Animated Background */
.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.2;
  animation: float 25s infinite ease-in-out;
}

.blob-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.blob-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, #f093fb, #f5576c);
  top: 50%;
  right: -150px;
  animation-delay: -10s;
}

.blob-3 {
  width: 350px;
  height: 350px;
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  bottom: -175px;
  left: 30%;
  animation-delay: -20s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-30px) rotate(2deg);
  }
  50% {
    transform: translateY(-60px) rotate(-2deg);
  }
  75% {
    transform: translateY(-30px) rotate(1deg);
  }
}

/* Navigation */
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(20px);
  background: var(--glass-background);
  border-bottom: 1px solid var(--glass-border);
  height: 70px;
  border-radius: 10px;
}

.nav-container {
  width: 100%;
  padding: 0 2rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.nav-left {
  flex: 0 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  font-size: 2rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  background: var(--text-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.version-badge {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--hover-background);
}

.nav-link.active {
  color: var(--text-primary);
  background: var(--active-background);
}

.nav-link.active::before {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 1px;
}

.nav-icon {
  font-size: 1.1rem;
}

.nav-right {
  flex: 0 0 auto;
}

.nav-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.theme-toggle {
  background: var(--button-background);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
}

.theme-toggle:hover {
  background: var(--hover-background);
  transform: translateY(-1px);
}

.toggle-icon {
  font-size: 1.1rem;
}

.toggle-text {
  font-weight: 500;
  font-size: 0.9rem;
}

/* Main Container */
.main-container {
  flex: 1;
  padding: 3rem 10rem;
  max-width: 4000px;
  margin: 0 auto;
  width: 100%;
}

/* Desktop-first Responsive */
@media (max-width: 1200px) {
  .main-container {
    max-width: 1200px;
  }
}

@media (max-width: 900px) {
  .nav-center {
    display: none;
  }

  .nav-container {
    justify-content: space-between;
  }
}

@media (max-width: 600px) {
  .nav-container {
    padding: 0 1rem;
  }

  .main-container {
    padding: 2rem 1rem;
  }

  .logo-text {
    display: none;
  }

  .toggle-text {
    display: none;
  }
}
</style>

<style>
:root {
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f1f5f9;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  --glass-background: rgba(255, 255, 255, 0.85);
  --glass-border: rgba(255, 255, 255, 0.2);
  --hover-background: rgba(102, 126, 234, 0.1);
  --active-background: rgba(102, 126, 234, 0.15);
  --button-background: rgba(255, 255, 255, 0.7);
  --text-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --button-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --button-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --button-success: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  --button-danger: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --card-background: rgba(255, 255, 255, 0.9);
  --card-border: rgba(255, 255, 255, 0.2);
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
}

.dark {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --text-muted: #64748b;
  --glass-background: rgba(30, 41, 59, 0.85);
  --glass-border: rgba(255, 255, 255, 0.1);
  --hover-background: rgba(102, 126, 234, 0.2);
  --active-background: rgba(102, 126, 234, 0.25);
  --button-background: rgba(30, 41, 59, 0.7);
  --card-background: rgba(30, 41, 59, 0.9);
  --card-border: rgba(255, 255, 255, 0.1);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    'Roboto',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
  font-size: 16px;
}

::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #667eea, #764ba2);
  border-radius: 6px;
  border: 2px solid var(--bg-secondary);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #5a6fd8, #6a4190);
}

::selection {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

*:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

button:focus,
input:focus,
textarea:focus {
  outline: none;
}

* {
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
}
</style>
