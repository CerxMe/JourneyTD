import * as THREE from 'three'
// import OrbitControls
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js'

// Represents a single hexagon object in the game
export default class Hex {
  // Create a new hexagon with the given coordinates
  // The size of the hexagon is determined by the given scale parameter
  constructor (cube, axial, size) {
    // Hexagons have 6 sides and 6 corners. Each side is shared by 2 hexagons. Each corner is shared by 3 hexagons.
    this.cube = cube
    this.color = new THREE.Color(0x00100b)
    // this.color = new THREE.Color(0x14BDEB)
    this.slopeRatio = 0
    this.axial = axial
    this.size = size
    this.sides = this.getSides()
    this.center = this.getCenter()
    console.log('hex created')
    this.object = null
    // Hex's properties for the game
    this.properties = {
      // Types of hexagons:
      // 0 = Starting hexagon
      // 1 = Starting hexagon after first move
      // 2 = Starting hexagon after reaching maximum capacity ( It has been entered into from all available sides )
      // Triggers special actions for completing combos
      // 3 = Normal hexagon
      // 4 = Normal hexagon with a resource
      // 13 = Wormhole hexagon ( Not yet implemented )
      // a - allows the player to enter into any previously entered hexagon that has one or more sides available to exit to
      // b - any enemy stepping into the haxagon will be transported towards the marked hexagon, and has a chance to become confused and continue it's path by looping back towards the wormhole
      // hexagon again instead of continuing its path chasing the player.
      type: 'Hex',
      actions: ['discover, explore, move, attack, defend, heal, special']
    }
  }

  // Calculate the center position of the hexagon
  getCenter () {
    const center = new THREE.Vector3(this.cube.x * this.size, this.cube.y * this.size, this.cube.z * this.size)
    return center
  }

  getSize () {
    return this.size
  }

  // Returns and array of the 6 points of the hexagon in clockwise order starting from the top left corner
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

  // Returns an array of the 6 sides of the hexagon in clockwise order starting from the top left corner
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

  // Returns the center position of a side of the hexagon given the side parameter
  // TODO: fix this function
  getCenterOfSide (side) {
    const angle = side * Math.PI / 3
    const x = this.cube.x + Math.cos(angle) * this.size
    const y = this.cube.y + Math.sin(angle) * this.size
    const z = this.cube.z
    const center = new THREE.Vector3(x, y, z)
    return center
  }

  updateHexObject (position, dimensions) {
    const { height, width } = dimensions
    // const { x, y, z } = position
    const slopeRatio = this.slopeRatio
    // bottom face shape
    const hex = new THREE.Shape()
    // make the hexagon's center at the point
    hex.moveTo(0, 0)
    // draw shape
    for (let i = 0; i < 7; i++) {
      const radius = width
      const angle = i * Math.PI / 3
      if (i === 0) {
        hex.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
      } else {
        hex.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
      }
    }

    // top face shape
    const hex2 = new THREE.Shape()
    // top of the hexagon with a smaller radius
    hex2.moveTo(0, height)
    for (let i = 0; i < 7; i++) {
      // expects the ratio to be a number between 0 and 1
      const radius = width * slopeRatio * -1
      const angle = i * Math.PI / 3
      if (i === 0) {
        hex2.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
      } else {
        hex2.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
      }
    }

    // get hex vertices
    const vertices = hex.getPoints().map(point => (
      new THREE.Vector3(point.x, point.y, 0)
    ))
    const vertices2 = hex2.getPoints().map(point => (
      new THREE.Vector3(point.x, point.y, height)
    ))

    // combine bottom and top faces into one shape to create the hexagon generated shape
    const points = [
      ...vertices,
      ...vertices2
    ]

    const geometry = new ConvexGeometry(points)

    // use vertex colors to set the color of the top and bottom faces

    // const colors = []
    //
    // const material = new THREE.MeshBasicMaterial({ vertexColors: true })
    // const primaryColor = new THREE.Color(0xffffff)
    // const secondaryColor = this.color
    //
    // for (let i = 0; i < hex2.getPoints(); i++) {
    //   colors.push(primaryColor)
    // }
    //
    // geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    const material = new THREE.MeshBasicMaterial({
      color: this.color,
      wireframe: true
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(position.x, position.y, position.z)
    // // ?connect the hexagon's top sides to the bottom
    // const hexagon = new THREE.Object3D()
    // hexagon.add(mesh)

    this.object = mesh
  }

  // Creates a new 3D Object to draw on the scene with the given parameters
  draw (position, dimensions) {
    this.updateHexObject(position, dimensions)
    return this.object
  }

  // outdated code
  // // create a geometry from the hexagon shape
  // // extrude the shape into a 3D hexagonal cylinder
  // const extrudeSettings = {
  //   steps: 1,
  //   depth: height,
  //   bevelEnabled: false
  // }
  // const geometry = new THREE.ExtrudeGeometry(hex, extrudeSettings)
  // const material = new THREE.MeshBasicMaterial({
  //   color: this.color,
  //   wireframe: false
  // })
  // // create a mesh from the geometry
  // const mesh = new THREE.Mesh(geometry, material)
  // // set the mesh's position
  // mesh.position.copy(position)
  // // if (offset) {
  // //   mesh.position.z += offset
  // // }
  //
  // // glow shape
  // // shrink height and extrude the sides
  // const glowExtrudeSettings = {
  //   steps: 1,
  //   depth: height / 2,
  //   bevelEnabled: false
  // }
  // const glowGeometry = new THREE.ExtrudeGeometry(hex, glowExtrudeSettings)
  //
  // const glowMaterial = new THREE.MeshBasicMaterial({
  //   color: new THREE.Color(color),
  //   // wireframe: true,
  //   transparent: true,
  //   opacity: 1
  // })
  // const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial)
  // glowMesh.position.copy(position)
  // // glowMesh.position.z += height / 2
  // glowMesh.scale.multiplyScalar(1.1)
  // // glowMesh.rotation.x = Math.PI / 2
  // // glowMesh.rotation.y = Math.PI / 2
  // // glowMesh.rotation.z = Math.PI / 2
  //
  // // const glowgeometry = new THREE.ExtrudeGeometry(hex, glowExtrudeSettings)
  // // // random color (red, green, blue)
  // // const glowColor = [
  // //   new THREE.Color(0x0000ff),
  // //   new THREE.Color(0x00ff00),
  // //   new THREE.Color(0xff0000)
  // // ]
  // // const glow = new THREE.Mesh(glowgeometry, new THREE.MeshBasicMaterial({
  // //   color: glowColor[Math.floor(Math.random() * glowColor.length)],
  // //   transparent: true,
  // //   opacity: 0.5
  // // }))
  // // glow.position.copy(position)
  //
  // // unions the hexagon and the glow
  // const hexagon = new THREE.Object3D()
  // hexagon.add(mesh)
  // hexagon.add(glowMesh)
  //
  // return hexagon

  setColor (color) {
    this.color = color
  }
}
