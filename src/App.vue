<script setup>
// HELLO
</script>

<template lang="pug">
router-view
</template>

<style lang="stylus">
// Do basic CSS reset
*
  margin: 0
*, *::before, *::after
  box-sizing: border-box
html, body
  height: 100%
input, button, textarea, select
  font: inherit
p, h1, h2, h3, h4, h5, h6
  overflow-wrap: break-word
button
  border none

// Global styles
#app
  font-family: 'Inter var', 'Helvetica', sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #2c3e50
  background-color #ecf0f1
#app, #scene
  height 100vh
  width 100vw
</style>
