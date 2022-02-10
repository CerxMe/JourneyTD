import * as THREE from 'three'
import { toRaw } from '@vue/reactivity'

export default class Scene {
  // initiates with the canvas element and the renderers the scene
  constructor (canvas, gameData) {
    this.canvas = canvas
    this.gameData = gameData
    this.raycaster = new THREE.Raycaster()
    this.scale = 9
    this.pointer = { x: -9999, y: -9999 } // set to -9999 to prevent registering pointer before mousemove
    this.highlightSprite = new THREE.TextureLoader().load('../../assets/hex_highlight.svg')

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
        const mesh = toRaw(gameObject.mesh)
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
    // console.log('update')
    this.renderGameObjects(this.gameData.getObjects)

    // find intersections
    if (this.gameData.gameState === 'game') {
      this.raycaster.setFromCamera(this.pointer, this.camera)

      const hexTiles = this.scene.children.filter(child => child.name === 'hex')
      const intersects = this.gameData.scene.scale < 10 ? this.raycaster.intersectObjects(hexTiles) : []

      if (intersects.length > 0) {
      // console.log(intersects)
        this.gameData.setSelectedObject(intersects[0].object.uuid)
      } else if (this.gameData.selectedObject) {
        this.gameData.setSelectedObject(null)
      }

      if ((this.lastSelectedObject && this.gameData.selectedObject !== this.lastSelectedObject) || !this.gameData.selectedObject) {
      // remove highlight
        const highlight = this.scene.getObjectByProperty('name', 'highlight')
        if (highlight) {
          this.scene.remove(highlight)
        }
      }
      if (this.gameData.selectedObject) {
        const selectedObject = this.scene.getObjectByProperty('uuid', this.gameData.selectedObject)
        if (selectedObject && selectedObject.uuid !== this.lastSelectedObject) {
          const highlight = new THREE.PointsMaterial({
          // color: 0xff00ff,
            color: 0x000000,
            alphaMap: this.highlightSprite,
            alphaTest: 0.5,
            transparent: true,
            // size: 6.66
            size: 16
          })
          // highlight.color.setHSL(1.0, 0.3, 0.7)

          const sphere = new THREE.Points(selectedObject.geometry, highlight)
          sphere.position.copy(selectedObject.position)
          sphere.name = 'highlight'
          this.scene.add(sphere)
        }
        this.lastSelectedObject = this.gameData.selectedObject
      }
    }
    // TODO: avoid updating this every frame
    this.updateCamera()
  }

  destroy () {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }
    this.renderer.dispose()
  }

  gameLoop () {
    // update the game
    this.update()
    // render the scene
    this.renderer.render(this.scene, this.camera)
    // request the next frame
    this.animationFrame = requestAnimationFrame(() => {
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
    this.camera = camera
  }

  updateCamera () {
    const scale = this.gameData.scene.scale
    console.log(scale)
    const browserWidth = window.innerWidth
    const browserHeight = window.innerHeight
    const aspect = browserWidth / browserHeight
    const cameraData = this.gameData.scene.camera
    this.camera.lookAt(cameraData.lookAt)
    this.camera.position.copy(cameraData.position)
    this.camera.left = -scale * aspect
    this.camera.right = scale * aspect
    this.camera.top = scale
    this.camera.bottom = -scale
    this.camera.updateProjectionMatrix()
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
