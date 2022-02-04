import * as THREE from 'three'
import { toRaw } from '@vue/reactivity'
export default class Scene {
  // initiates with the canvas element and the renderers the scene
  constructor (canvas, gameData) {
    this.canvas = canvas
    this.gameData = gameData
    this.raycaster = new THREE.Raycaster()
    this.scale = 9
    this.pointer = { x: 0, y: 0 }
    this.setup()
  }

  // setup the scene
  setup () {
    // make things draw
    console.log('draw scene')
    this.createScene()
    this.createCamera()
    this.createRenderer()
    this.gameLoop()
  }

  renderGameObjects (gameObjects) {
    // render the game objects
    if (!!gameObjects && gameObjects.length > 0) {
      const scene = this.scene
      const sceneObjects = scene.children.filter(child => child.name === 'hex')

      // compile objects to render
      const objectsToRender = []
      for (const gameObject of gameObjects) {
        const mesh = toRaw(gameObject.object)
        if (mesh.name === 'hex') {
          objectsToRender.push(mesh)
        }
      }

      // remove obselote objects from the scene
      for (const sceneObject of sceneObjects) {
        const exists = objectsToRender.find(object => object.uuid === sceneObject.uuid)
        if (!exists) {
          scene.remove(sceneObject)
        } else { // update the object
          objectsToRender.splice(objectsToRender.indexOf(sceneObject), 1)
        }
      }

      // add new objects to the scene
      for (const object of objectsToRender) {
        scene.add(object)
      }
      this.scene = scene
    }
  }

  onPointerMove (event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
  }

  onWindowResize () {
    console.log('resize')
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.createCamera()
  }

  update () {
    // find intersections
    this.raycaster.setFromCamera(this.pointer, this.camera)

    const hexTiles = this.scene.children.filter(child => child.name === 'hex')
    const intersects = this.raycaster.intersectObjects(hexTiles)

    if (intersects.length > 0) {
      // console.log(intersects)
      // console.log(intersects[0].object.name)
      this.gameData.setSelectedObject(intersects)
    } else {
      this.gameData.setSelectedObject(null)
    }

    this.renderGameObjects(this.gameData.getObjects)
  }

  gameLoop () {
    // update the game
    this.update()
    // render the scene
    this.renderer.render(this.scene, this.camera)
    // request the next frame
    requestAnimationFrame(() => {
      this.gameLoop()
    })
  }

  // limit rendering to visible area
  mapChunks () {
    // get the camera position
    // const cameraPos = this.camera.position.clone()
    // // get the camera direction
    // const cameraDir = this.camera.getWorldDirection()
    // get the camera frustum
    const frustum = new THREE.Frustum()
    frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse))
    // get the camera frustum planes
    const frustumPlanes = frustum.planes
    console.log(frustumPlanes)
    // TODO: get the camera frustum points and check if they are intersecting with the hexagon grid
  }

  createMap () {
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
    const circleCount = 1
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
    this.map = pts
  }

  // drawHexes () {
  //   // set color
  //   const color = new THREE.Color('#ffffff')
  //   const color2 = new THREE.Color('#ff00ff')
  //   // render a hexagon in center each grid cell
  //   for (const point of this.map) {
  //     this.drawHex(point, 1, color, -0.1)
  //     // const randomsize = Math.random() * 0.3 + 0.5 // 0.7 - 0.8
  //     this.drawHex(point, 0.95, color2)
  //   }
  // }
  //
  // drawHex (position, size, color, offset) {
  //   const hex = new THREE.Shape()
  //   // make the hexagon's center at the point
  //   hex.moveTo(0, 0)
  //   // draw the hexagon
  //   for (let i = 0; i < 7; i++) {
  //     const radius = size
  //     const angle = i * Math.PI / 3
  //     if (i === 0) {
  //       hex.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
  //     } else {
  //       hex.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
  //     }
  //   }
  //   // create a geometry from the hexagon shape
  //   // extrude the shape into a 3D object
  //   const extrudeSettings = {
  //     steps: 1,
  //     depth: size,
  //     bevelEnabled: false
  //   }
  //   const geometry = new THREE.ExtrudeGeometry(hex, extrudeSettings)
  //   // create a mesh from the geometry
  //   const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color }))
  //   // set the mesh's position
  //   mesh.position.copy(position)
  //   if (offset) {
  //     mesh.position.z += offset
  //   }
  //   // add the mesh to the scene
  //   this.scene.add(mesh)
  // }

  createScene () {
    const scene = new THREE.Scene()

    // const grid = new THREE.GridHelper(2048, 1024)
    // grid.rotation.x = Math.PI / 2
    // scene.add(grid)

    const light = new THREE.DirectionalLight(0xffffff)
    light.position.set(0, 0, 10)
    scene.add(light)

    this.scene = scene
  }

  createCamera () {
    // const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 1000)
    // camera.position.set(10, 5, 5)

    // convert perspective camera to orthographic
    const scale = this.scale

    const browserWidth = window.innerWidth
    const browserHeight = window.innerHeight
    const aspect = browserWidth / browserHeight

    const camera = new THREE.OrthographicCamera(
      -scale * aspect,
      scale * aspect,
      scale,
      -scale,
      1,
      1000
    )
    camera.position.set(0, 0, 10)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    camera.updateProjectionMatrix()

    // draw a box at the camera's position
    // set the camera's position to the center of the box
    // this.scene.add(box)
    // set the camera's position to the center of the box
    this.camera = camera
  }

  createRenderer () {
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    })
    renderer.setAnimationLoop(() => {
      renderer.render(this.scene, this.camera)
    })

    this.updateRenderer(renderer) // set the size of the renderer
  }

  updateRenderer (renderer) {
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer = renderer
  }
}
