<script setup>
// scale settings
// + and - buttons to change zoom level
import { useGameDataStore } from '../store/gameData'
import { onMounted, onUnmounted } from 'vue'
const gameData = useGameDataStore()
function increaseScale (amount) {
  const maximumScale = 45
  const scene = gameData.scene
  scene.scale = Math.min(gameData.scene.scale + amount, maximumScale)
  gameData.updateCamera(scene)
}
function decreaseScale (amount) {
  const minimumScale = 1
  const scene = gameData.scene
  scene.scale = Math.max(minimumScale, gameData.scene.scale - amount)
  gameData.updateCamera(scene)
}

onMounted(() => {
  window.addEventListener('wheel', (e) => {
    if (e.deltaY > 0) {
      increaseScale(0.5)
    } else {
      decreaseScale(0.5)
    }
  })
})
</script>

<template lang="pug">
.container
  | Scale:
  | {{ gameData.scene.scale }}
  button(@click="increaseScale(5)")
    | -
  button(@click="decreaseScale(5)")
    | +
  //input.zoom-level(type="range", min="1", max="60", step="0.5",
  //  v-model="gameData.scene.scale", @change="onChange")
</template>

<style lang="stylus" scoped>
@import '../styles/variables.styl'
@import '../styles/utils.styl'
.container
  font-size: 1em
  margin: 0 auto
  width: 100%
  text-align: center
  flex()
  flex-direction row
  background color1
  color color2
  padding: 0.3em
  button
    font-size: 1em
    padding: 0.3em
    min-width 22px
    margin: auto 0.3em
    border-radius: 3px
    background-color: color2
</style>
