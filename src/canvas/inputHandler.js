export default class InputHandler {
  constructor (setState) {
    const moveMouseHandler =
      ({ clientX, clientY }) => {
        setState({ clientX, clientY })
      }

    window.addEventListener('mousemove', moveMouseHandler)
  }
}
