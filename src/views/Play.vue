<script setup>
import GameCanvas from './../components/GameCanvas.vue'
import { useGameDataStore } from '../store/gameData'
import { ref } from 'vue'
const gameData = ref(useGameDataStore())

</script>

<template lang="pug">
.gameContainer
   // Renders the UI
   .gameOverlay.z-10.absolute.bottom-0.left-0
      .gameOverlay__content
         .gameOverlay__content__title
          pre
            | {{ gameData }}
   // Render the game on the background
   .gameCanvas.z-0.absolute.bottom-0.left-0
      GameCanvas
</template>
