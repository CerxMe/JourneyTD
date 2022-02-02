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
  | Start a new game
  EntropyGenerator
  // start game button
  button.start-game(
    @click="gameData.startGame()"
  )
    | Go!
</template>
<style lang="stylus" scoped>
@import '../../styles/variables.styl'
.hello
  opacity: 0.755
  background color1
  padding 1em
  border-radius .3em
  border solid 1px color5
  transition: all .3s ease-in-out
.hello:hover
  opacity: 1
</style>
