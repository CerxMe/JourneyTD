<script setup>
// Renders the game canvas.
import Scene from '../game/scene.js'
import { ref, onMounted, onUnmounted } from 'vue'
import { useGameDataStore } from '../store/gameData'
const root = ref(null)
let scene = null
const gameData = useGameDataStore()
const getGameData = () => gameData

onMounted(() => {
  // the DOM element will be assigned to the ref after initial render
  scene = new Scene(root.value, getGameData)
  document.addEventListener('pointermove', updateScene)
  window.addEventListener('resize', resize)
})
function updateScene (e) {
  scene.onPointerMove(e)
}
function resize (e) {
  scene.onWindowResize(e)
}
onUnmounted(() => {
  console.log('deactivated')
  scene.destroy()
  document.removeEventListener('pointermove', updateScene)
  window.removeEventListener('resize', resize)
})

</script>

<template lang="pug">
canvas(
  id="container"
  ref="root"
)
</template>

<style scoped lang="stylus">
#container
  box-sizing: border-box
  height 100vh
  width 100vw
</style>
