<script setup>
import EntropyGenerator from '../../components/EntropyGenerator.vue'
import { useGameDataStore } from '../../store/gameData'
// function startGame () {
//   this.$emit('start-game')
// }
// function showRules () {
//   this.$emit('show-rules')
// }
const gameData = useGameDataStore()
</script>
<template lang="pug">
.hello
  | Welcome to the game!
  EntropyGenerator
  // start game button
  button.start-game(
    @click="gameData.startGame()"
  )
    | Go!
</template>
<style scoped>

</style>
