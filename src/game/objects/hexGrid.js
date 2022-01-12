import * as THREE from 'three'
import Hex from './hex'
// Represents a hexagonal grid that can is used to place objects on.
export default class HexGrid {
  // Now let's assemble hexagons into a grid.
  // With square grids, there's one obvious way to do it. With hexagons, there are multiple approaches.
  // I like cube coordinates for algorithms and axial or doubled for storage.

  constructor (mapSize, hexSize) {
    this.mapSize = mapSize
    this.hexSize = hexSize
    this.map = []
    this.pts = []
    this.createMap()
    // for each point create a new map hex
  }

  // Called on initialization, assigns hexes with starting properties
  populateMap () {
    // Assign random properties to all points
    for (const hex in this.map) {
      // give each hex a random color
      this.randomizeHex(hex)
    }
    // When called on initialization, assign the starting position a special value
    // get the center hexagon from the map
    const center = this.getCenterHex()
    center.setStart()
  }

  // Randomize Hex's properties
  randomizeHex (hex) {
    hex.randomizeHex()
    console.log(hex)
  }

  // The cube coordinates are the simplest. They're the coordinates of the center of the hexagon.
  createMap () {
    console.log('generating hex map')
    // create a 2d map of hexagons
    console.log('map size: ', this.mapSize)
    console.log('hex size: ', this.hexSize)

    // generate a hexagonal grid
    const pts = []
    // center hex
    pts.push(new THREE.Vector3())
    // outside rings
    const unit = Math.sqrt(3)
    const angle = Math.PI / 3
    const axis = new THREE.Vector3(0, 0, 1)
    const axisVector = new THREE.Vector3(0, -unit, 0)
    const sideVector = new THREE.Vector3(0, unit, 0).applyAxisAngle(axis, -angle)
    // number of rings from the center
    const circleCount = this.mapSize
    const tempV3 = new THREE.Vector3()
    for (let seg = 0; seg < 6; seg++) {
      for (let ax = 1; ax <= circleCount; ax++) {
        for (let sd = 0; sd < ax; sd++) {
          tempV3.copy(axisVector)
            .multiplyScalar(ax)
            .addScaledVector(sideVector, sd)
            .applyAxisAngle(axis, angle * seg)
          pts.push(new THREE.Vector3().copy(tempV3))
        }
      }
    }
    this.pts = pts

    for (const point of pts) {
      const hex = new Hex(point, this.cubeToAxial(point), this.hexSize)
      this.map.push(hex)
    }

    console.log(`got ${this.map.length} hexagons`)
  }

  getHex (axial) {
    // get the hexagon at the given coordinates
    return this.getHexByAxial(axial)
  }

  // The axial coordinates are the coordinates of the center of the hexagon. They're the coordinates of the center of the hexagon.
  cubeToAxial (cube) {
    // convert cube coordinates to axial coordinates
    const q = cube.x
    const r = cube.z
    return new THREE.Vector2(q, r)
  }

  getHexByAxial (axial) {
    // get the hexagon at the given axial coordinates
    const q = axial.x
    const r = axial.y
    const index = q + r * (this.mapSize + (this.mapSize - 1))
    return this.map[index]
  }

  addHex (hex) {
    // add a hexagon to the map
    this.map.push(hex)
  }

  getHexes () {
    return this.map
  }

  getAdjacentHexToHex (hex) {
    const cube = this.axialToCube(hex.axial)
    const adjacentHexes = []
    for (let i = 0; i < 6; i++) {
      const adjCube = this.getAdjacentCube(cube, i)
      const adjHex = this.getHex(adjCube)
      adjacentHexes.push(adjHex)
    }
    return adjacentHexes
  }

  getCenterHex () {
    const cube = new THREE.Vector3(this.mapSize / 2, this.mapSize / 2, this.mapSize / 2)
    return this.getHex(cube)
  }
}
