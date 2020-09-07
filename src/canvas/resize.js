export default async (canvasRef, game) => {
  // set canvas size to browser size
  function resizeCanvas () {
    if (canvasRef) {
      const canvas = canvasRef.current
      console.log(canvas)
      if (canvas) {
        const { width, height } = canvas.getBoundingClientRect()
        if (canvas.width !== width || canvas.height !== height) {
          const { devicePixelRatio: ratio = 1 } = window
          const context = canvas.getContext('2d')
          canvas.width = width * ratio
          canvas.height = height * ratio
          context.scale(ratio, ratio)
          return true
        }
      }
    }
    return false
  }
  // set window size
  resizeCanvas()
}
