<script setup>
// This page contains all the logic for the game.
import { useGameDataStore } from '../store/gameData'

// imported components
import GameCanvas from '~/components/GameCanvas.vue'
import StartScreen from '~/components/GameScreens/StartScreen.vue'
import EndScreen from '~/components/GameScreens/EndScreen.vue'
import ScaleSettings from '~/components/ScaleSettings.vue'
import MovementOptions from '../components/MovementOptions.vue'

const gameData = useGameDataStore()
</script>

<template lang="pug">
.gameContainer
  // This is the canvas that the game is rendered on.
  .background
    GameCanvas
  // Any UI components that need to be rendered on top of the game.
  .foreground
    StartScreen(v-if="gameData.gameState === 'startScreen'" )
    EndScreen(v-if="gameData.gameState === 'endScreen'" )
    .game(v-if="gameData.gameState === 'game'")
      nav.menu
        .body
          ScaleSettings
          MovementOptions
        .seed Seed: {{ gameData.seedHash }}

</template>

<style lang="stylus" scoped>
@import '../styles/utils.styl'
@import '../styles/variables.styl'
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

  .foreground,  .game
    width 100%
    height 100%
    z-index 10
    flex()
  .game
    flex-direction row
    justify-content start
.menu
  min-height: 100vh;
  background: alpha(color1, 0.5)
  width: 300px
  height 100%
  flex()
  flex-direction column
  justify-content end
  .body
    width 100%
    flex()
    flex-grow 1
    justify-content start
  .seed
    color color5
    flex()
    flex-direction row
    font-size: 0.6em
    font-weight normal
    word-break break-all
    padding: 0.5em
</style>
