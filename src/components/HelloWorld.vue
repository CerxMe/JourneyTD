<template>
  <canvas id="container" ref="scene"></canvas>
</template>
<script>
import Scene from '../game/scene.js'
export default {
  name: 'ThreeTest',
  data () {
    return {
      scene: null
    }
  },
  methods: {
    init: function () {
      this.scene = new Scene(this.$refs.scene)
    }
  },
  mounted () {
    this.init()
  }
}
</script>
