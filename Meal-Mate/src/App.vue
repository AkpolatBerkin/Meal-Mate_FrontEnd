<script setup lang="ts">
import Rezeptliste from './components/Rezeptliste.vue'
</script>

<template>
  <div id="app">
    <header>
      <h1>Meal Mate</h1>
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
  background: transparent; /* Hintergrund über html/body */
  color: white;
}

/* Header Styling */
header {
  padding: 1.5rem;
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #FFCC70;
}

/* Main nimmt den verbleibenden Platz */
main {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  box-sizing: border-box;
}
</style>

<style>
/* global styles für Hintergrund + Body & HTML */
html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  background: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: white;
  box-sizing: border-box;
}
</style>
