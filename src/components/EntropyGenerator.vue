<script setup>
// Initializes a button for selecting the game seed value
import { useGameDataStore } from '../store/gameData'
import { ref, onMounted, onUnmounted } from 'vue'

const gameData = useGameDataStore()

const seedInput = ref(null)
const inputElement = ref(null)

// generates random values to seed the game
class EntropyGenerator {
  constructor (interval) {
    this.interval = interval
    this.generator = true
  }

  // start the entropy generator with the given interval
  start () {
    seedInput.value = null
    this.generator = setInterval(async () => {
      await this.generate()
    }, this.interval)
  }

  // stop the entropy generator
  stop () {
    if (this.generator) {
      clearInterval(this.generator)
    }
    this.generator = null
  }

  // update the entropy generator interval
  updateInterval (interval) {
    this.interval = interval
    this.stop()
    this.start()
  }

  // gather entropy from the browser
  getEntropy (num) {
    const bytes = new Uint8Array(num)
    return window.crypto.getRandomValues(bytes) // TODO: fallback for older browsers?
  }

  // get a random value and directly assign it to the game data store
  async generate () {
    // stop generator if custom value is set
    if (seedInput.value) {
      this.stop()
      return
    }
    this.lastEntropy = this.getEntropy(256)
    await gameData.setEntropy(this.lastEntropy)
  }
}

const generator = new EntropyGenerator(1000)
generator.generate() // generate initial entropy (on render)

function resumeGenerator () {
  console.log('resuming entropy generator')
  if (seedInput.value === null || seedInput.value === '') {
    generator.start()
  }
}

// User input
function inputFocused () {
  generator.stop()
  emit('inputFocused')
}

function inputBlurred () {
  emit('inputBlurred')
  resumeGenerator()
}

function submitSeed () {
  emit('submitSeed')
  generator.stop()
}

// Random generator
onMounted(() => {
  generator.start()
})

onUnmounted(() => {
  generator.stop()
})

</script>

<template lang="pug">
aside
  main
    //input(type="range", min="0", max="5000", value="1000" step="100", @change="generator.updateInterval($event.target.value)")
    p(v-if="gameData.$state.seedHash")
      span.bold(v-if='generator.generator')
        | Random Entropy
      span.italic(v-if='!generator.generator')
        | Custom Seed

    input(type="text" v-model="seedInput" @input="gameData.setEntropy(seedInput)"
      @focus="inputFocused" @blur="inputBlurred"
      @submit="submitSeed"
      placeholder="Enter a seed value"
      ref="inputElement"
      spellcheck="false"
  )
  footer(@click="inputElement.focus()")
    // draw a shaded pixel for each bit of entropy
    .entropy
    .hash {{ gameData.$state.seedHash }}

     // display the seed hash in the footer
    //.entropySettings(v-if="displayEntropySettings")
    //  | Click to generate new entropy
    //  button(
    //    @click="shuffleEntropy"
    //  )
    //    | Shuffle
</template>

<style lang="stylus" scoped>
@import '../styles/variables.styl'
@import '../styles/utils.styl'
main
  flex()
  flex-direction:row
  transition: all 0.5s ease-in-out
  p
    font-size: .8em
    color color1
    padding .3em
    transition: all 0.5s ease-in-out
  input
    transition: all 0.5s ease-in-out
    flex-grow: 1
    font-size: .8em;
    color color4
    border none
    &::placeholder {
      font-size: .75em;
      color color5
    }
    &:focus
      outline: none
      border 1px solid color3
.entropy
  display flex
  flex-direction row
  justify-content center
  align-items center
  flex-wrap wrap
  //width $entropy-width
  margin-right: 0.5em

//.entropy__bit
//  width: $bit-width
//  height: $bit-width
//  display: inline-block
//  transition: all 0.25s ease

aside
  font-size: 1.5em
  font-weight: bold
  text-align: center
  margin: 0 auto
  padding: 0.3em
  border-radius: 0.3em
  background-color: #fff
  cursor: cursor
  //display flex
  //flex-direction column
  footer
    //display flex
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
