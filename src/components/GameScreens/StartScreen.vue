<script setup>
import EntropyGenerator from '../../components/EntropyGenerator.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { useGameDataStore } from '../../store/gameData'

const gameData = useGameDataStore()
const startButtonHovered = ref(false)

function listener (event) {
  window.removeEventListener('keydown', this.listener)
  startGame(event)
}

// TODO: Fix this mess
function startGame (event) {
  console.log('event', event)

  if ((startButtonHovered.value && event === 'click') || event === 'submit') {
    gameData.startGame()
  } else if (!startButtonHovered.value && event) {
    gameData.startGame()
    event.preventDefault()
  }
}

onMounted(() => {
  // Listen for keypresses to start the game
  window.addEventListener('keydown', listener)
})

onUnmounted(() => {
  window.removeEventListener('keydown', listener)
})

</script>
<template lang="pug">
//| Start a new game
//EntropyGenerator(@submit-entropy="startGame()")
//// start game button
//button.start-game(
//  @click="startGame()"
//)
//  | Go!
.start-screen(@mouseover="startButtonHovered = true" @mouseleave="startButtonHovered = false")
  // Drawns the welcome promt
  header( @click="startGame('click')")
    button
      | {{ !!startButtonHovered ? 'Click to start the game' : 'Press any key to continue' }}
  // Shows seed selection
  footer
    EntropyGenerator(@submitSeed="startGame('submit')" @inputFocused="startButtonHovered = true" @inputBlurred="startButtonHovered = false")
</template>
<style lang="stylus" scoped>
@import '../../styles/variables.styl'
@import '../../styles/utils.styl'
.start-screen
  opacity: 0.5
  flex()
    height 100%
    width 100%

  header
    padding 1em
    border-radius .3em
    background color1
    border solid 1px color5
    transition: all .3s ease-in-out
    button
      background none
      font-size 1.5em

  footer
    //justify-self flex-end
    //position to the bottom right of the screen

    flex()
    width 100%
    height 100%
  &:hover
    opacity: 1
</style>
