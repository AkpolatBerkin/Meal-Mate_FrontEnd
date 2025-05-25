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
const rezepte = [
  {
    name: "Spaghetti Bolognese",
    kategorie: "Hauptgericht",
    zubereitung: "Hackfleisch anbraten, Tomatensauce dazugeben, servieren.",
    dauer: 30,
    portionen: 2,
  },
  {
    name: "Pfannkuchen",
    kategorie: "Dessert",
    zubereitung: "Teig anrühren, in Pfanne goldbraun backen.",
    dauer: 20,
    portionen: 4,
  },
  {
    name: "Salat mit Feta",
    kategorie: "Vorspeise",
    zubereitung: "Gemüse schneiden, Feta darüber, Dressing dazu.",
    dauer: 10,
    portionen: 1,
  }
]
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
