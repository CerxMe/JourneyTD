export default class InputHandler {
  constructor (setState, game) {
    // get mouse coordinates
    const moveMouseHandler =
      ({ clientX, clientY }) => {
        setState({ clientX, clientY })
      }

    window.addEventListener('mousemove', moveMouseHandler)

    // set zoom level on scroll
    const scrollZoomHandler =
        (event) => {
          event.preventDefault()
          // true (increment) / false (decrease)
          const direction = event.deltaY <= 0
          const zoomRange = {
            min: -10,
            max: 10
          }
          const defaultZoom = 0
          // todo: fix this

          const currentZoom = game?.inputData?.zoom || defaultZoom
          console.log(currentZoom)

          const newZoom = currentZoom >= zoomRange.min && direction ? currentZoom + 1 // increment
            : currentZoom <= zoomRange.max && !direction ? currentZoom - 1 // decrease
              : currentZoom // don't change
          setState({ zoom: newZoom })
        }

    window.addEventListener('mousewheel', scrollZoomHandler)
  }
}
