import * as THREE from 'three'

// Hexagons have 6 sides and 6 corners. Each side is shared by 2 hexagons. Each corner is shared by 3 hexagons.
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
    console.log(pts)
    this.pts = pts

    for (const point of pts) {
      const hex = new Hex(point, this.cubeToAxial(point), this.hexSize)
      console.log(' map point saved')
      this.map.push(hex)
    }
    console.log(this.map)
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

class Hex {
  constructor (cube, axial, size) {
    this.cube = cube
    this.color = new THREE.Color(0xffffff)
    this.axial = axial
    this.size = size
    this.sides = this.getSides()
    this.center = this.getCenter()
    console.log('hex created')
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
    for (let i = 0; i <= 6; i++) {
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
    for (let i = 0; i <= 6; i++) {
      const angle = i * Math.PI / 3
      const x = this.cube.x + Math.cos(angle) * this.size
      const y = this.cube.y + Math.sin(angle) * this.size
      const z = this.cube.z
      const side = new THREE.Vector3(x, y, z)
      sides.push(side)
    }
    return sides
  }

  getCenterOfSide (side) {
    const angle = side * Math.PI / 3
    const x = this.cube.x + Math.cos(angle) * this.size
    const y = this.cube.y + Math.sin(angle) * this.size
    const z = this.cube.z
    const center = new THREE.Vector3(x, y, z)
    return center
  }

  draw (position, dimensions) {
    const { height, width } = dimensions
    // const { x, y, z } = position
    const hex = new THREE.Shape()
    // make the hexagon's center at the point
    hex.moveTo(0, 0)
    // draw the hexagon sides
    for (let i = 0; i < 7; i++) {
      const radius = width
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
      depth: height,
      bevelEnabled: false
    }
    const geometry = new THREE.ExtrudeGeometry(hex, extrudeSettings)
    const material = new THREE.MeshBasicMaterial({
      color: this.color,
      wireframe: false
    })
    // create a mesh from the geometry
    const mesh = new THREE.Mesh(geometry, material)
    // set the mesh's position
    mesh.position.copy(position)
    // if (offset) {
    //   mesh.position.z += offset
    // }

    // glow shape
    const glowExtrudeSettings = {
      steps: 1,
      depth: height,
      bevelEnabled: true,
      bevelSize: 0.005
    }

    const glowgeometry = new THREE.ExtrudeGeometry(hex, glowExtrudeSettings)
    // random color (red, green, blue)
    const glowColor = [
      new THREE.Color(0x0000ff),
      new THREE.Color(0x00ff00),
      new THREE.Color(0xff0000)
    ]
    const glow = new THREE.Mesh(glowgeometry, new THREE.MeshBasicMaterial({
      color: glowColor[Math.floor(Math.random() * glowColor.length)],
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    }))
    glow.position.copy(position)

    // unions the hexagon and the glow
    const hexagon = new THREE.Object3D()
    hexagon.add(mesh)
    hexagon.add(glow)

    return hexagon
  }

  setColor (color) {
    this.color = color
  }
}
