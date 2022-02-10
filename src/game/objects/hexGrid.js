import * as THREE from 'three'
import Hex from './hex'
// Represents a hexagonal grid that can is used to place objects on.
export default class HexGrid {
  constructor (center) {
    this.center = center
    this.populatedHexes = []
  }

  // The cube coordinates are the simplest. They're the coordinates of the center of the hexagon.
  createMap (initialRadius) {
    const pts = []
    // center hex
    const center = new THREE.Vector3(0, 0, 0)
    pts.push(center)

    for (let i = 0; i <= initialRadius; i++) {
      pts.push(...this.ring(center, i))
    }

    for (const point of pts) {
      const hex = new Hex(point)
      this.populatedHexes.push(hex)
    }

    console.log(`got ${this.populatedHexes.length} hexagons`)
  }

  ring (center, radius) {
    const pts = []
    // outside rings
    const unit = Math.sqrt(3)
    const angle = Math.PI / 3
    const axis = new THREE.Vector3(0, 0, 1)
    const axisVector = new THREE.Vector3(0, -unit, 0)
    const sideVector = new THREE.Vector3(0, unit, 0).applyAxisAngle(axis, -angle)
    // direction (0-6)
    // const seg = 0
    for (let seg = 0; seg < 6; seg++) {
      // distance from center
      const ax = radius
      // distance from side
      for (let sd = 0; sd < ax; sd++) { // points on the side
        const pos = new THREE.Vector3().copy(axisVector)
          .multiplyScalar(ax)
          .addScaledVector(sideVector, sd)
          .applyAxisAngle(axis, angle * seg)
          .add(center)
        pts.push(pos)
      }
    }
    return pts
  }

  axialToCube (axial) {
    // convert axial coordinates to cube coordinates
    const x = axial.x
    const z = axial.z
    const y = -x - z
    return new THREE.Vector3(x, y, z)
  }

  getHexByAxial (axial) {
    // get the hexagon at the given axial coordinates
    const q = axial.x
    const r = axial.y
    const index = q + r * (this.mapSize + (this.mapSize - 1))
    return this.map[index]
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
