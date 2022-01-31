<script setup>
// Initializes a button for selecting the game seed value

import { useGameDataStore } from '../store/gameData'
import { ref, onMounted, onUnmounted } from 'vue'

const gameData = useGameDataStore()
const displayEntropySettings = ref(false)
// gather entropy from the browser
const getEntropy = function (num) {
  const bytes = new Uint8Array(num)
  return window.crypto.getRandomValues(bytes) || null
}

const entropy = ref(null)

async function shuffleEntropy () {
  entropy.value = getEntropy(256)
  await gameData.setEntropy(entropy.value)
}

onMounted(() => {
  shuffleEntropy()
  const shuffler = setInterval(() => {
    shuffleEntropy()
  }, 3500)
  onUnmounted(() => {
    clearInterval(shuffler)
  })
})

</script>

<template lang="pug">
button
  main
  | seedHash for generated entropy.
  footer
    // draw a shaded pixel for each bit of entropy
    .entropy(
      @mouseover="displayEntropySettings = true"
      @mouseleave="displayEntropySettings = false"
    )
      .entropy__bit(
        v-for="bit in entropy"
        :style="{ 'background-color': `rgb(${bit},${bit},${bit})`}"
      )
    .hash {{ gameData.$state.seed }}

    // display the seed hash in the footer
      .entropySettings(v-if="displayEntropySettings")
        | Click to generate new entropy
        button(
          @click="shuffleEntropy"
        )
          | Shuffle
</template>

<style lang="stylus" scoped>
$entropy-width = 32px
$bit-width = $entropy-width / 16

.entropy
  display flex
  flex-direction row
  justify-content center
  align-items center
  flex-wrap wrap
  width $entropy-width
  margin-right: 0.5em

.entropy__bit
  width: $bit-width
  height: $bit-width
  display: inline-block
  transition: all 0.25s ease

button
  font-size: 1.5em
  font-weight: bold
  text-align: center
  margin: 0 auto
  padding: 0.3em
  border-radius: 0.3em
  background-color: #fff
  cursor: pointer
  display flex
  flex-direction column
  footer
    display flex
    flex-direction row
    font-size: 0.6em
    font-weight normal
    word-break break-all
    justify-content center
    align-items center
    .hash
      font-weight: lighter
      width 600px
</style>
