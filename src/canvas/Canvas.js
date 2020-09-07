
import React, {} from 'react'
import drawScene from './drawScene'
import resize from './resize'

class Canvas extends React.Component {
  constructor (props) {
    super(props)
    this.canvasRef = React.createRef()
  }

  componentDidMount () {
    // handle resizing window
    const canvas = this.canvasRef.current
    window.addEventListener('resize', () => {
      resize(this.canvasRef)
      drawScene(canvas, {})
    })

    async function runGame (canvasRef) {
      const game = {}
      await resize(canvasRef, game)
      await drawScene(canvas, game)
    }
    runGame(this.canvasRef)
  }

  componentWillUnmount () {
    // Make sure to remove the DOM listener when the component is unmounted.
    window.removeEventListener('resize', () => {
      resize(this.canvasRef)
    })
  }

  render () {
    return <canvas className='gameWindow' tabIndex='1' ref={this.canvasRef} {...this.props} />
  }
}

export default Canvas
