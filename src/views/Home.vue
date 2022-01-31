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
// UI Colors
// https://lospec.com/palette-list/blessing
color1 = #74569b
color2 = #96fbc7
color3 = #f7ffae
color4 = #ffb3cb
color5 = #d8bfd8

// mixin for default flex behaviour
flex()
  display flex
  flex-direction column
  align-items center
  justify-content center

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
