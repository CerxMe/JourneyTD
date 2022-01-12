<template>
  <canvas
    id="container"
    ref="root"
  />
</template>
<script setup>
import Scene from '../game/scene.js'
import { ref, onMounted } from 'vue'
import { useGameDataStore } from '../store/gameData.js'
const gameData = useGameDataStore()

const root = ref(null)

onMounted(() => {
  // the DOM element will be assigned to the ref after initial render
  console.log('GAME DATA', gameData)
  const scene = new Scene(root.value)
})
</script>

<style lang="stylus">
#scene
  margin 0
  height 100%
  width 100%
</style>
