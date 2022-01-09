import * as THREE from 'three'
// import OrbitControls
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Game } from './game'

export default class Scene {
  // initiates with the canvas element and the renderers the scene
  constructor (canvas) {
    this.canvas = canvas
    this.setup()
  }

  registerEvents () {
    // // pixel to hex
    // const mouse = new THREE.Vector2()
    // const raycaster = new THREE.Raycaster()
    // const mouseMove = (event) => {
    //   mouse.x = (event.clientX / innerWidth) * 2 - 1
    //   mouse.y = -(event.clientY / innerHeight) * 2 + 1
    //   raycaster.setFromCamera(mouse, this.camera)
    //   const intersects = raycaster.intersectObjects(this.scene.children)
    //   if (intersects.length > 0) {
    //     const intersect = intersects[0]
    //     const hex = intersect.point.clone()
    //     const hexPos = hex.applyMatrix4(this.camera.matrixWorldInverse)
    //     const hexGrid = hexPos.applyMatrix4(this.camera.projectionMatrix)
    //     // set the color of the hexagon to white
    //     intersect.object.material.color.set(0xffff00)
    //   }
    // }
    // this.canvas.addEventListener('mousemove', mouseMove)

    // on window resize
    window.addEventListener('resize', () => {
      // resize the canvas
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight

      // update the camera
      this.camera.aspect = window.innerWidth / window.innerWidth
      this.camera.updateProjectionMatrix()

      // update the renderer size
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    }, false)

    // on camera movement change
    this.controls.addEventListener('change', () => {
      this.renderer.render(this.scene, this.camera)
      this.cameraMovedHandler()
    })
  }

  // cameraMovedHandler () {
  //   console.log('camera moved')
  //   console.log(this.camera.position)
  //
  //   // limit the orbit to a maximum radius of 10 hexes from the center of the map
  //   const maxRadius = 10
  //   const center = this.hexGrid.center
  //   const distance = this.camera.position.distanceTo(center)
  //   if (distance > maxRadius) {
  //     const direction = this.camera.position.clone().sub(center).normalize()
  //     this.camera.position.copy(center).add(direction.multiplyScalar(maxRadius))
  //   }
  // }

  // // translates the camera position to the hexagon grid
  // updateMap (cameraPosition) {
  //   // generate a hexagon grid from the camera position and the grid size (hexagon size) and the grid offset (hexagon offset) and the grid height (hexagon height) and the grid width (hexagon width) and the grid depth (hexagon depth) and the grid height (hexagon height)
  //   const hexGrid = this.hexGrid.generate(cameraPosition, this.hexGridSize, this.hexGridOffset, this.hexGridHeight, this.hexGridWidth, this.hexGridDepth, this.hexGridHeight)
  // }

  // setup the scene
  setup () {
    // make things draw
    console.log('draw scene')
    this.createScene()
    this.createCamera()
    this.createRenderer()
    this.createControls()
    // register even listeners for controls
    console.log('register events')
    this.registerEvents()
    // start game
    this.game = new Game(this.canvas)
    console.log('game started')
    console.log(this.game)
    this.game.init()

    // render the game objects on the scene
    const gameObjects = this.game.getObjects()
    for (const gameObject of gameObjects) {
      this.scene.add(gameObject)
    }
    // start the game loop
    this.gameLoop()
  }

  update () {
    // console.log('update')
    // render the game objects on the scene
    const gameObjects = this.game.getObjects()
    for (const gameObject of gameObjects) {
      this.scene.add(gameObject)
    }
    // console.log('renderingObjects:', gameObjects)
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
    const circleCount = 9
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
    // scene.add(new THREE.GridHelper(50, 50))
    this.scene = scene
  }

  createCamera () {
    const size = this.getCanvasSize()
    const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 10, 1000)
    camera.position.set(0, 0, 16)
    // draw a box at the camera's position
    // set the camera's position to the center of the box
    // this.scene.add(box)
    // set the camera's position to the center of the box
    this.camera = camera
  }

  // get canvas size
  getCanvasSize () {
    const width = this.canvas.clientWidth
    const height = this.canvas.clientHeight
    return { width, height }
  }

  createRenderer () {
    const renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true })
    renderer.setAnimationLoop(() => {
      this.renderer.render(this.scene, this.camera)
    })
    renderer.setSize(this.getCanvasSize().width, this.getCanvasSize().height)
    this.renderer = renderer
  }

  createControls () {
    const controls = new OrbitControls(this.camera, this.canvas)
    // disable every action exept the camera pan
    // controls.enableDamping = true
    // controls.dampingFactor = 0.25
    // controls.enableZoom = false
    // controls.enablePan = true
    // controls.enableRotate = false
    // controls.enableKeys = false
    controls.update()
    this.controls = controls
  }
}
