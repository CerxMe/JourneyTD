import Hex from './objects/hex'
import HexGrid from './objects/hexGrid'
// import Map from './objects/map'
// import Player from './objects/player'

// the game renders two layers of hexes, one for the background and one for the foreground
// the background layer is rendered first - it is an infinite grid of hexes with an origin at 0, 0 and excludes all the hexes from the foreground layer
// the foreground layer is rendered second, it is an overlay of hexes on the background layer which the player has explored / are visible( have data populated )

// the player starts at map center 0, 0 and the foreground layer's origin is calculated on that position.
// the player may move to any adjacent hexes that allow for an exit (one of the six sides has not been entered yet.)
// tiles that have been explored are marked with a red background and a boolean explored property is set to true
// tiles that have not been explored are marked with a blue background and a boolean explored property is set to false

// the camera is anchored in a configurable position in the Z axis above the player's position
// the camera is moved to the player's position and the foreground layer's origin is recalculated
// before rendering both layers, the camera's frustum is checked to see if the objects within the camera's frustum are visible.
// if the object is not visible, it is not rendered.
export class Game {
  // initiates with the canvas element and the renderers the scene
  constructor (canvas) {
    this.canvas = canvas
    this.defaultZoom = 'small'
    this.player = {
      x: 0,
      y: 0,
      z: 0,
      canMove: true
    }
    this.objects = [] // array of objects to be rendered in the scene
    this.init()
  }

  getObjects () {
    return this.objects
  }

  update () {
    // TODO: update the game state
  }

  init () {
    console.log('game zoom level set to default:', this.defaultZoom)
    this.setZoomLevel(this.defaultZoom)

    // calculate reqired size for the hexagon grid to fit the canvas with enough hexagonsPerScreen
    const canvasSize = { width: this.canvas.width, height: this.canvas.height }
    const biggerSide = Math.max(canvasSize.width, canvasSize.height)
    const hexagonSize = biggerSide / this.hexagonsPerScreen
    const hexagonRadius = hexagonSize / 2

    // const hexagonHeight = Math.sqrt(3) * hexagonRadius
    // const hexagonWidth = 2 * hexagonRadius

    // const initialViewDistance = 4
    // const gameMap = new HexGrid(initialViewDistance, 1) // create a new hex grid with the initial view distance
    // // populate hexes with data
    // gameMap.populateMap()
    //
    // this.gameMap = gameMap

    // renders backround hexagon grid
    console.log('hex grid background')
    const initialViewDistance = 4
    const gameMap = new HexGrid(initialViewDistance, 1)
    console.log('hex grid ok')
    const hexes = gameMap.getHexes()
    const hexMap = gameMap.map
    const backgroundHexagons = hexMap.forEach(hex => {
      console.log('hex', hex) // hex
      const position = hex.center
      //  draw (position, size, color, offset)
      const dimensions = { width: 0.88, height: 0.22 }
      const mesh = hex.draw(position, dimensions) // get the mesh and add it to the scene
      this.objects.push(mesh)
    })
  }

  highlightSelectedObjects (hex) {
    // takes the hex position and returns the highlighted object at that position
    // the highligted object encopasses adjacent hexes and colors them differently when the selection is unavailable.

  }

  getCanvasSize () {
    return {
      width: this.canvas.width,
      height: this.canvas.height
    }
  }

  setZoomLevel (setting) {
    const hexagonsPerScreen = { small: 3, medium: 24, large: 64 }
    if (Object.keys(hexagonsPerScreen).includes(setting)) {
      this.hexagonsPerScreen = hexagonsPerScreen[setting]
      // this.update()
    }
  }
}
