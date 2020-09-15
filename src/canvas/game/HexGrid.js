import { Hex } from './Hex'

export class HexGrid {
  constructor (screenSize) {
    this.screenSize = screenSize

    // size of hexagon
    const hexSize = 50
    // horizontal distance between hexagon centers
    const hexWidth = Math.sqrt(3) * hexSize
    // vertical distance between hexagon centers
    const hexHeight = 2 * hexSize

    this.params = {
      size: 50,
      originHex: { x: 0, y: 0 }
    }
    const hex = new Hex()
  }

  // generate a grid of hexagons with a center point
  getHexGrid () {
    // figure out how many hexagons can fit in current scene
  }
}
