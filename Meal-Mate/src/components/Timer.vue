<template>
  <div class="timer-dropdown">
    <button @click="toggleTimer" class="timer-toggle">
      <span class="toggle-icon">⏰</span>
      <span v-if="running" class="time-display">{{ minutes }}:{{ seconds < 10 ? '0' : '' }}{{ seconds }}</span>
    </button>

    <div v-show="isOpen" class="timer-menu">
      <div class="timer-container">
        <div class="time">{{ minutes }}:{{ seconds < 10 ? '0' : '' }}{{ seconds }}</div>
        <div class="time-input" v-if="!running">
          <input
            type="number"
            v-model="inputMinutes"
            min="0"
            max="60"
            @change="updateTime"
          > min
        </div>
        <div class="timer-buttons">
          <button @click="start" :disabled="running" class="timer-btn">
            <span>▶️</span>
          </button>
          <button @click="pause" :disabled="!running" class="timer-btn">
            <span>⏸️</span>
          </button>
          <button @click="reset" class="timer-btn">
            <span>🔄</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, computed } from 'vue';

const isOpen = ref(false);
const inputMinutes = ref(5);
const time = ref(5 * 60);
const running = ref(false);
let interval: ReturnType<typeof setInterval> | null = null;

const minutes = computed(() => Math.floor(time.value / 60));
const seconds = computed(() => time.value % 60);

function toggleTimer() {
  isOpen.value = !isOpen.value;
}

function updateTime() {
  time.value = inputMinutes.value * 60;
}

function start() {
  if (!running.value) {
    running.value = true;
    interval = setInterval(() => {
      if (time.value > 0) {
        time.value--;
      } else {
        pause();
      }
    }, 1000);
  }
  isOpen.value = false;
}

function pause() {
  running.value = false;
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
}

function reset() {
  pause();
  time.value = inputMinutes.value * 60;
}

onUnmounted(() => {
  if (interval) clearInterval(interval);
});
</script>

<style scoped>
.timer-dropdown {
  position: relative;
}

.timer-toggle {
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

.timer-toggle:hover {
  background: var(--hover-background);
  transform: translateY(-1px);
}

.time-display {
  font-weight: 500;
  font-size: 0.9rem;
}

.timer-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: var(--card-background);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(20px);
  padding: 1rem;
  min-width: 200px;
  z-index: 1000;
}

.timer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.time {
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: 2px;
  background: var(--text-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.time-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-input input {
  width: 60px;
  padding: 0.3rem;
  border: 1px solid var(--glass-border);
  border-radius: 6px;
  background: var(--glass-background);
  color: var(--text-primary);
  text-align: center;
}

.timer-buttons {
  display: flex;
  gap: 0.8rem;
}

.timer-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.3rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.timer-btn:not(:disabled):hover {
  transform: translateY(-1px);
  background: var(--hover-background);
}
</style>
