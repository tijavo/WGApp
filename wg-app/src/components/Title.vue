<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const scrollY = ref(0)

// Scroll event handler
const handleScroll = () => {
  scrollY.value = window.scrollY
}

// Berechne die Kurve basierend auf Scroll-Position
const getCurveAmount = () => {
  const maxScroll = 130 // Nach 400px ist der Text komplett gerade
  const progress = Math.min(scrollY.value / maxScroll, 1)
  return 1 - progress // 1 = voll gebogen, 0 = gerade
}

// SVG Path für den gebogenen Text (Lächeln unter dem Logo)
const getTextPath = () => {
  const curve = getCurveAmount()
  const centerX = 150
  const startY = 20 // Höher = mehr oben

  if (curve === 0) {
    // Gerade Linie für ungekrümmten Text
    return `M 30 ${startY} L 270 ${startY}`
  }

  // Gebogener Pfad (Lächeln nach unten)
  const curveDepth = 80 * curve // Wie tief die Kurve geht
  const controlY = startY + curveDepth

  return `M 30 ${startY} Q ${centerX} ${controlY} 270 ${startY}`
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="container">
    <!-- Logo (bleibt immer sichtbar) -->
    <div class="logo-container">
      <img alt="Vue logo" src="@/assets/BungerLogo.png" width="150" height="150" class="logo" />
    </div>

    <!-- Curved Text unter dem Logo -->
    <div class="text-container ">
      <svg width="300" :height="33 + getCurveAmount() * 70" :viewBox="'0 0 300 ' + (20 + getCurveAmount() * 70)"
        class="text-svg">
        <defs>
          <path :d="getTextPath()" id="textpath" />
        </defs>
        <text class="curved-text">
          <textPath href="#textpath" startOffset="50%" text-anchor="middle" class="text-3xl font-bold">
            Bungerburg grüßt!
          </textPath>
        </text>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5px;
  position: relative;
}

.logo {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.text-svg {
  max-width: 100%;
  height: auto;
}

.curved-text {
  fill: #42b883;
  font-family: 'Arial', sans-serif;
  font-size: 28px;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.content {
  width: 100%;
  max-width: 800px;
}

/* Mobile Responsive */
@media (max-width: 768px) {

  .text-svg {
    width: 90vw;
  }

  .curved-text {
    font-size: 22px;
  }
}

@media (max-width: 480px) {


  .curved-text {
    font-size: 18px;
  }
}
</style>