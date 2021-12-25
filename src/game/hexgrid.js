import * as THREE from 'three'

// Hexagons have 6 sides and 6 corners. Each side is shared by 2 hexagons. Each corner is shared by 3 hexagons.
class HexGrid {
  // Now let's assemble hexagons into a grid.
  // With square grids, there's one obvious way to do it. With hexagons, there are multiple approaches.
  // I like cube coordinates for algorithms and axial or doubled for storage.

  constructor (mapSize, hexSize) {
    this.mapSize = mapSize
    this.hexSize = hexSize
    this.map = []
    this.createMap()
  }

  // The cube coordinates are the simplest. They're the coordinates of the center of the hexagon.
  createMap () {
    // create a 2d map of hexagons
    for (let x = 0; x < this.mapSize; x++) {
      for (let y = 0; y < this.mapSize; y++) {
        for (let z = 0; z < this.mapSize; z++) {
          const cube = new THREE.Vector3(x, y, z)
          const axial = this.cubeToAxial(cube)
          const hex = new Hex(cube, axial, this.hexSize)
          this.map.push(hex)
        }
      }
    }
  }

  getHex (cube) {
    // get the hexagon at the given cube coordinates
    const axial = this.cubeToAxial(cube)
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

  getHexes () {
    return this.map
  }
}

class Hex {
  constructor (cube, axial, size) {
    this.cube = cube
    this.axial = axial
    this.size = size
  }

  getCenter () {
    const center = new THREE.Vector3(this.cube.x * this.size, this.cube.y * this.size, this.cube.z * this.size)
    return center
  }

  getSize () {
    return this.size
  }

  getCorners () {
    const corners = []
    for (let i = 0; i < 6; i++) {
      const angle = i * Math.PI / 3
      const x = this.cube.x + Math.cos(angle) * this.size
      const y = this.cube.y + Math.sin(angle) * this.size
      const z = this.cube.z
      const corner = new THREE.Vector3(x, y, z)
      corners.push(corner)
    }
    return corners
  }

  getSides () {
    const sides = []
    for (let i = 0; i < 6; i++) {
      const angle = i * Math.PI / 3
      const x = this.cube.x + Math.cos(angle) * this.size
      const y = this.cube.y + Math.sin(angle) * this.size
      const z = this.cube.z
      const side = new THREE.Vector3(x, y, z)
      sides.push(side)
    }
    return sides
  }

  draw (position, size, color, offset, scene) {
    const { height, width } = size
    const { x, y, z } = position
    const hex = new THREE.Shape()
    // make the hexagon's center at the point
    hex.moveTo(0, 0)
    // draw the hexagon sides
    for (let i = 0; i < 7; i++) {
      const radius = size
      const angle = i * Math.PI / 3
      if (i === 0) {
        hex.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
      } else {
        hex.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
      }
    }
    // create a geometry from the hexagon shape
    // extrude the shape into a 3D hexagonal cylinder
    const extrudeSettings = {
      steps: 1,
      depth: size,
      bevelEnabled: false
    }
    const geometry = new THREE.ExtrudeGeometry(hex, extrudeSettings)
    // create a mesh from the geometry
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color }))
    // set the mesh's position
    mesh.position.copy(position)
    if (offset) {
      mesh.position.z += offset
    }
    // add the mesh to the scene
    scene.add(mesh)
  }
}
