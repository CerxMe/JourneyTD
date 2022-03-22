import * as THREE from 'three'
import HexGrid from './hexGrid'
export default class Selection {
  constructor (position) {
    this.selection = null
    this.radius = 1
    this.grid
  }

  selection (key) {
    const directions = {
      q: 'top left',
      w: 'top',
      e: 'top right',
      a: 'bottom left',
      s: 'bottom',
      d: 'bottom right'
    }
    this.selection = directions[key]
  }

  adjacentHexes (hex) {
    const adjacentHexes = []
    const directions = ['top left', 'top', 'top right', 'bottom left', 'bottom', 'bottom right']

    // make a new grid at the current hex
    const grid = new HexGrid(hex.position)

    // loop through the grid
    let i = 0
    const neighbors = []
    // get the 6 adjacent hexes
    for (const neighbour of grid.ring(hex.position, 1)) {
      i++
      // assigns directions to the hexes
      neighbour.direction = directions[i]
      neighbors.push(neighbour)
    }
    return neighbors
  }
}
