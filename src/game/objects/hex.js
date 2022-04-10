import * as THREE from 'three'
// import OrbitControls
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js'
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js'
import { VertexTangentsHelper } from 'three/examples/jsm/helpers/VertexTangentsHelper.js'

// Represents a single hexagon object in the game
export default class Hex {
  // Create a new hexagon with the given coordinates
  // The size of the hexagon is determined by the given scale parameter
  constructor (position) {
    // Hexagons have 6 sides and 6 corners. Each side is shared by 2 hexagons. Each corner is shared by 3 hexagons.
    this.color = new THREE.Color(0x00100b)
    // this.color = new THREE.Color(0x14BDEB)
    this.slopeRatio = 0
    // The cube coordinates of the hexagon
    this.position = position // The position of the hexagon on the scene
    this.dimensions = {
      width: 0,
      height: 0
    }
    this.claimed = false
    this.object = null
    // Hex's properties for the game
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

  // // Returns an array of the 6 sides of the hexagon in clockwise order starting from the top left corner
  // getSides () {
  //   const sides = []
  //   for (let i = 0; i <= 6; i++) {
  //     const angle = i * Math.PI / 3
  //     const x = this.cube.x + Math.cos(angle) * this.size
  //     const y = this.cube.y + Math.sin(angle) * this.size
  //     const z = this.cube.z
  //     const side = new THREE.Vector3(x, y, z)
  //     sides.push(side)
  //   }
  //   return sides
  // }
  //
  // // Returns the center position of a side of the hexagon given the side parameter
  // getCenterOfSide (side) {
  //   const angle = side * Math.PI / 3
  //   const x = this.cube.x + Math.cos(angle) * this.size
  //   const y = this.cube.y + Math.sin(angle) * this.size
  //   const z = this.cube.z
  //   const center = new THREE.Vector3(x, y, z)
  //   return center
  // }

  updateMaterial () {
    /* COLOR FACES */
    this.geometry.computeVertexNormals()

    const count = this.geometry.attributes.position.count
    this.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
    const color = new THREE.Color()
    const colors = this.geometry.attributes.color

    const z = this.geometry.attributes.position.getZ(0)
    let min = z; let max = z
    for (let i = 0; i < count; i++) {
      const z = this.geometry.attributes.position.getZ(i)
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
      const pos = this.geometry.attributes.position.getZ(i)
      const val = (pos + steepness) / range

      if (pos / range >= max) {
        colors.setXYZ(i, 1, 1, 1)
      } else {
        colors.setXYZ(i, val, val, val)
      }
    }

    // TODO: Choose style from a list

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

    this.material = !this.claimed ? claimedMaterial : unclaimedMaterial
  }

  toggleHover (state) {
    if (state) {
      // this.color = new THREE.Color(0x00100b)
      this.slopeRatio = 0.85
      this.position.z = 1
    } else {
      this.slopeRatio = 0.75
      this.position.z = 0
    }
    this.updateHexObject()
  }

  updateGeometry () {
    // gets the 'Hexagonal frustum' shape (googled the proper geometry term)
    this.bottomFaceVertices = this.getHexCorners(this.dimensions.width, 0)
    this.topFaceVertices = this.getHexCorners(this.dimensions.width * this.slopeRatio * -1, this.dimensions.height)

    // combine bottom and top faces
    const points = [
      ...this.topFaceVertices,
      ...this.bottomFaceVertices
    ]

    // convert points to hull of the object
    this.geometry = new ConvexGeometry(points)
  }

  updateHexObject () {
    this.updateGeometry()
    this.updateMaterial()

    // combine all into a final mesh
    if (this.mesh) {
      this.mesh.position.set(this.position.x, this.position.y, this.position.z)
      this.mesh.geometry = this.geometry
      this.mesh.material = this.material
    } else {
      const mesh = new THREE.Mesh(this.geometry, this.material)
      mesh.position.set(this.position.x, this.position.y, this.position.z)
      mesh.name = 'hex'
      this.mesh = mesh
    }
  }

  setColor (color) {
    this.color = color
  }
}
