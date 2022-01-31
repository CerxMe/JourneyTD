<script setup>
// This page contains all the logic for the game.
import { useGameDataStore } from '../store/gameData'
import { ref } from 'vue'

// imported components
import GameCanvas from '~/components/GameCanvas.vue'
import StartScreen from '~/components/GameScreens/StartScreen.vue'
import EndScreen from '~/components/GameScreens/EndScreen.vue'

const gameData = useGameDataStore()
console.log('GAME DATA', gameData.seed)
gameData.generateTiles()
</script>

<template lang="pug">
.gameContainer
  // This is the canvas that the game is rendered on on a background layer.
  .background
    GameCanvas
  .foreground
    StartScreen(v-if="gameData.gameState === 'startScreen'" )
    EndScreen(v-if="gameData.gameState === 'endScreen'" )

</template>

<style lang="stylus" scoped>
.gameContainer
  width: 100%
  height: 100%
  display: flex
  justify-content: center
  align-items: center

  .background
    position: absolute
    bottom: 0
    right: 0
    width: 100%
    height: 100%
    display: flex
    justify-content: center
    align-items: center
    z-index: 5

  .foreground
    position: absolute
    bottom: 0
    right: 0
    width: 100%
    height: 100%
    display: flex
    justify-content: center
    align-items: center
    z-index: 10
    .menu
      background red
</style>
