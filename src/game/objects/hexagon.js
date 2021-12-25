// import * as THREE from "three";
//
// export default class hexagon {
//   constructor() {
//   }
//   drawHex (position, size, color, offset) {
//     const hex = new THREE.Shape()
//     // make the hexagon's center at the point
//     hex.moveTo(0, 0)
//     // draw the hexagon
//     for (let i = 0; i < 7; i++) {
//       const radius = size
//       const angle = i * Math.PI / 3
//       hex.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
//     }
//     // create a geometry from the hexagon shape
//     const extrudeSettings = {
//       steps: 2,
//       depth: size,
//       bevelEnabled: false
//     }
//     const geometry = new THREE.ExtrudeGeometry(hex, extrudeSettings)
//     // create a mesh from the geometry
//     const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color }))
//     // set the mesh's position
//     mesh.position.copy(position)
//     if (offset) {
//       mesh.position.z += offset
//     }
//     // add the mesh to the scene
//     this.scene.add(mesh)
//   }
// }
