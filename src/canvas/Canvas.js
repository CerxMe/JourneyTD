
import React, { useState } from 'react'
import drawScene from './drawScene'
import resize from './resize'
import InputHandler from './inputHandler'

class Canvas extends React.Component {
  constructor (props) {
    super(props)
    this.canvasRef = React.createRef()
    this.state = {
      game: {},
      inputData: {}
    }
  }

  // draw scene
  renderGame (canvasRef, game) {
    resize(canvasRef, game)
    drawScene(canvasRef.current, game)
  }

  componentDidMount () {
    // listen for user input
    const game = this.state
    const inputHandler = new InputHandler((inputData, game) => this.setState({ inputData }))
    // handle resizing window
    const canvas = this.canvasRef.current
    window.addEventListener('resize', () => {
      this.renderGame(this.canvasRef, this.state.inputData)
    })

    // draw scene
    this.renderGame(this.canvasRef, this.state.inputData)
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    this.renderGame(this.canvasRef, this.state.inputData)
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
