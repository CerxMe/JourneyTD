<script setup>
// import { useGameDataStore } from '../store/gameData'
// import { ref, onMounted, onUnmounted } from 'vue'
//
// const gameData = useGameDataStore()

</script>

<template lang="pug">
.gameStartScreen.hex
  header
    h1 Journey TD
    RouterLink(to="/game")
      span.startGame
        | Start Game
</template>

<style lang="stylus" scoped>
@import '../styles/variables.styl'
@import '../styles/utils.styl'

// component styles
.gameStartScreen
  flex()
  width 100%
  height 100%
  background color1
  color: color3
  header
    flex()
    padding 1em
    border-radius .3em
    border solid 1px color5
a
  color: color2
  text-decoration: none
  &:hover
    color: #fff
.startGame
  font-weight: bold
  margin-top: 1em
  cursor: pointer

.hex:before {
  content: " ";

  width: 0;
  border-bottom: 30px solid color4;
  border-left: 52px solid transparent;
  border-right: 52px solid transparent;
}

.hex:after {
  content: "";

  width: 0;
  border-top: 30px solid color4;
  border-left: 52px solid transparent;
  border-right: 52px solid transparent;
}

</style>
