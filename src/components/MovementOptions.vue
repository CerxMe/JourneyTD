// displays the movement options for the current player
<template lang="pug">
.options
  .option(v-if="gameData.selectedObject")
    // hex coordinates
    header
      | selection: {{gameData.selectedObject}}
      .hex(:style="{'background-color': gameData.getSelectedObject.color}")
      span.hexCoords
        | q: {{ Math.floor(gameData.getSelectedObject.position.x) }}
        | r: {{ Math.floor(gameData.getSelectedObject.position.y) }}
    // information about the move
    //main
    //  | {{ gameData.getMovementOptions }}
</template>

<script setup>
import { useGameDataStore } from '../store/gameData'

const gameData = useGameDataStore()
// const hex = gameData.getMovementOptions()
// console.log(hex)
</script>

<style lang="stylus" scoped>
@import '../styles/variables.styl'
@import '../styles/utils.styl'
.options
  flex()
  .option
    flex()
    width 266px
    background color3
    border-radius: 5px
    padding: 5px
    font-size .7em
    margin: 5px
    cursor: pointer
    color: color1

.hex
  display inline-flex
  width 10px
  height 10px
  margin auto 10px
</style>
