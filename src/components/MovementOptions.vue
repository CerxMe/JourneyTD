// displays the movement options for the current player
<template lang="pug">
.options
  .option(v-if="gameData.selectedObject")
    // hex coordinates
    header
      | selection: {{gameData.selectedObject}}
      .hex(:style="{'background-color': gameData.getSelectedObject.color}")
      span.hexCoords
        | q: {{ gameData.getSelectedObject.position.x }}
        | r: {{ gameData.getSelectedObject.position.y }}
    // information about the move
    //main
    //  | {{ gameData.getMovementOptions }}
    main neighbors:
      section(v-for="neighbor of gameData.neighbors" :key="neighbor")
        .hex(:style="{'background-color': neighbor?.color}")
        span.hexCoords
        | q: {{ neighbor.position.x }}
        | r: {{ neighbor.position.y }}
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
