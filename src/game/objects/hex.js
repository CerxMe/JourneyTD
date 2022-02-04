import * as THREE from 'three'
// import OrbitControls
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js'
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js'
import { VertexTangentsHelper } from 'three/examples/jsm/helpers/VertexTangentsHelper.js'

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
    this.claimed = false
    this.sides = this.getSides()
    this.center = this.getCenter()
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
  getHexCorners (radius, zplane) {
    const corners = []

    const hex = new THREE.Shape()
    // make the hexagon's center at the point
    hex.moveTo(0, 0)
    // draw shape
    for (let i = 0; i < 7; i++) {
      const angle = i * Math.PI / 3
      if (i === 0) {
        hex.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
      } else {
        hex.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
      }
    }

    const vertices = hex.getPoints().map(point => (
      new THREE.Vector3(point.x, point.y, zplane)
    ))

    return vertices
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
    const bottomFaceVertices = this.getHexCorners(width, 0)

    // top of the hexagon with a smaller radius
    const topFaceVertices = this.getHexCorners(width * slopeRatio * -1, height)

    // combine bottom and top faces into one shape to create the hexagon generated shape
    const points = [
      ...topFaceVertices,
      ...bottomFaceVertices
    ]

    // convert points to hull
    const geometry = new ConvexGeometry(points)

    // const material =
    //   // new THREE.MeshNormalMaterial({
    //   //   // flatShading: true,
    //   //   side: THREE.FrontSide
    //   //   // vertexColors: true
    //   // })
    //   new THREE.MeshNormalMaterial({
    //     // flatShading: true,
    //     side: THREE.FrontSide,
    //     vertexColors: true
    //   })

    /* COLOR FACES */
    geometry.computeVertexNormals()

    const count = geometry.attributes.position.count
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
    const color = new THREE.Color()
    const colors = geometry.attributes.color

    const z = geometry.attributes.position.getZ(0)
    let min = z; let max = z
    for (let i = 0; i < count; i++) {
      const z = geometry.attributes.position.getZ(i)
      if (z < min) {
        min = z
      }
      if (z > max) {
        max = z
      }
    }

    const steepness = 0.75
    const range = Math.abs(max - min) + steepness
    for (let i = 0; i < count; i++) {
      const pos = geometry.attributes.position.getZ(i)
      const val = (pos + steepness) / range

      if (pos / range >= max) {
        colors.setXYZ(i, 1, 1, 1)
      } else {
        colors.setXYZ(i, val, val, val)
      }
    }

    /* FINAL OBJECT */

    // const material = new THREE.MeshPhongMaterial({
    //   color: this.color,
    //   emissive: 0x000000,
    //   specular: 0xffffff,
    //   vertexColors: true,
    //   flatShading: true,
    //   shininess: 5.55
    // })

    const claimedMaterial = new THREE.MeshPhongMaterial({
      color: this.color,
      specular: 0x000000,
      vertexColors: true,
      flatShading: true,
      side: THREE.FrontSide,
      shininess: 5.55
    })

    const unclaimedMaterial = new THREE.MeshBasicMaterial({
      // flatShading: true,
      color: this.color,
      side: THREE.FrontSide,
      vertexColors: true
    })

    const material = this.claimed ? unclaimedMaterial : claimedMaterial

    // const material =
    //   // new THREE.MeshNormalMaterial({
    //   //   // flatShading: true,
    //   //   side: THREE.FrontSide
    //   //   // vertexColors: true
    //   // })
    // new THREE.MeshNormalMaterial({
    //   // flatShading: true,
    //   side: THREE.FrontSide,
    //   vertexColors: true
    // })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(position.x, position.y, position.z)

    const hexagon = new THREE.Object3D()
    hexagon.name = 'hex'
    hexagon.add(mesh)
    this.object = hexagon
  }

  // Creates a new 3D Object to draw on the scene with the given parameters
  draw (position, dimensions) {
    this.updateHexObject(position, dimensions)
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
