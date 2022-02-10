<script setup>
// scale settings
// + and - buttons to change zoom level
import { useGameDataStore } from '../store/gameData'
import { onMounted, onUnmounted } from 'vue'
const gameData = useGameDataStore()
function increaseScale (amount) {
  const maximumScale = 45
  gameData.scene.scale = Math.min(gameData.scene.scale + amount, maximumScale)
}
function decreaseScale (amount) {
  const minimumScale = 1
  gameData.scene.scale = Math.max(minimumScale, gameData.scene.scale - amount)
}

onMounted(() => {
  gameData.scene.scale = 6.66
  window.addEventListener('wheel', (e) => {
    if (e.deltaY > 0) {
      increaseScale(0.5)
    } else {
      decreaseScale(0.5)
    }
  })
})
const onChange = (event) => {
  // convert value to int
  const value = parseInt(event.target.value)
  gameData.scene.scale = value
}
</script>

<template lang="pug">
.container
  //| {{ gameData.scene.scale }}
  //button(@click="increaseScale(5)")
  //  | -
  //button(@click="decreaseScale(5)")
  //  | +
  //input.zoom-level(type="range", min="1", max="60", step="0.5",
  //  v-model="gameData.scene.scale", @change="onChange")
</template>

<style lang="stylus" scoped>
.container
  font-size: 1.5em
  margin: 0 auto
  width: 100%
  text-align: center
  button
    font-size: 1em
    margin: 0.5em
    padding: 0.5em
    border: 1px solid #ccc
    border-radius: 3px
    background-color: #eee
</style>
