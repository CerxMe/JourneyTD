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

    // outer hexes
    for (let i = 0; i <= initialRadius; i++) {
      pts.push(...this.ring(center, i))
    }

    // convert points to hexes
    for (const point of pts) {
      this.addHex(point)
    }

    // console.log(`got ${this.populatedHexes.length} hexagons`)
  }

  addHex (point) {
    const hex = new Hex(point)
    this.populatedHexes.push(hex)
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
          // offset from center
          .add(center)

        // round values to 3 decimal places
        pos.x = Math.round(pos.x * 1000) / 1000
        pos.y = Math.round(pos.y * 1000) / 1000
        pos.z = Math.round(pos.z * 1000) / 1000
        pts.push(pos)
        // pts.push(pos)
      }
    }
    return pts
  }
}
