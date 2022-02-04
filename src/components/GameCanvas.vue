<script setup>
// Renders the game canvas.
import Scene from '../game/scene.js'
import { ref, onMounted } from 'vue'
import { useGameDataStore } from '../store/gameData'
const gameData = useGameDataStore()
const root = ref(null)

const scene = ref(null)

onMounted(() => {
  // the DOM element will be assigned to the ref after initial render
  scene.value = new Scene(root.value, gameData)
  document.addEventListener('pointermove', updateScene)
  window.addEventListener('resize', resize)
})
function updateScene (e) {
  scene.value.onPointerMove(e)
}
function resize (e) {
  scene.value.onWindowResize(e)
}

</script>

<template lang="pug">
canvas(
  id="container"
  ref="root"
)
</template>

<style lang="stylus">
#scene
  margin 0
  height 100%
  width 100%
</style>
