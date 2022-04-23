import { defineStore } from 'pinia'
import HexGrid from '../game/objects/hexGrid'
import { ref } from 'vue'
import { SHA3 } from 'sha3'
import { Chacha20 } from 'ts-chacha20'
import * as THREE from 'three'
import * as buffer from 'buffer'
import Selection from '../game/objects/selection'
import { Vector3 } from 'three'
import { usePlayerStore } from './player'
import Hex from '../game/objects/hex'
const hash = new SHA3(512)

export const useGameDataStore = defineStore({
  id: 'gameData',
  state: () => ({
    scene: {
      camera: {
        position: new THREE.Vector3(0, 0, 16),
        lookAt: new THREE.Vector3(0, 0, 0)
      },
      scale: 1.5
    },
    seed: null,
    seedHash: null,
    rng: null,
    tiles: null,
    gameState: 'startScreen',
    gameObjects: null, // THREE.Object3D array of all objects in the scene
    player: usePlayerStore(),
    selectedObject: null, // Hex object of the selected object
    neighbors: null,
    hexGrid: null // HexGrid object
  }),
  actions: {
    startGame () {
      // Unlocks user input
      this.gameState = 'game'
      this.player.startGame()
      console.log('game started with seed:', this.seedHash)
    },

    // Prepares starting tiles
    generateTiles () {
      const initialViewDistance = 1 // initial view distance
      const gridCenter = new THREE.Vector3(0, 0, 0)
      this.hexGrid = new HexGrid(gridCenter)
      this.hexGrid.createMap(initialViewDistance)
      const grid = this.hexGrid.populatedHexes
      const objects = []
      for (const hex of grid) {
        this.generateHex(hex)
        objects.push(hex)
      }
      this.gameObjects = objects
    },

    // Generates a hex tile from rng
    generateHex (hex) {
      hex.dimensions = { width: 1, height: 0.35 }
      hex.slopeRatio = 0.75

      // TODO: support multiple random properties from seed
      const colors = [
        '#53437f',
        '#a89fcc',
        '#ffd9e8',
        '#ff9bb6',
        '#9968e2',
        '#be9bff',
        '#7fceff',
        '#6d81ff',
        '#2c6f99',
        '#00bcaa',
        '#c48f9e',
        '#8e586f',
        '#ff5470',
        '#ff9b71',
        '#ffd9ae'
      ]
      const rng = this.getRng()
      // console.log(rng)
      const color = colors[Math.floor(rng * colors.length)]
      // console.log('color', color)
      if (color) {
        hex.color = color
      }

      // sets the hex with updated values
      hex.updateHexObject()
      return hex
    },

    // The entropy is a string of random parameters generated from user's inputs
    setEntropy (entropy) {
      // should be somewhat cryptographically secure PRNG, but I did not bother to verify this implementation

      // hashes the input with SHA3
      hash.update(entropy.toString() || '')
      this.seedHash = hash.digest('hex')

      // seeds the rng with the hash
      this.seed = hash.digest() // gets the hash as binary
      const key = this.seed.slice(0, 32)
      const nonce = this.seed.slice(0, 12)

      // a counter-based PRNG works by hashing the same message and incrementing a counter
      this.rng = new Chacha20(key, nonce) // should handle the incrementing by itself

      hash.reset() // reset the block cypher

      // regenerate initial view area
      this.generateTiles()
    },

    getRng () {
      if (this.rng && this.seed) {
        const random = this.rng.encrypt(this.seed)
        const number = buffer.Buffer.from(random).readUInt32LE(0)
        // convert the number to a float between 0 and 1
        // note: 4294967295 is the max value of a 32-bit unsigned integer
        return number / 4294967295
      }
    },

    setSelectedObject (object) {
      if (this.selectedObject !== object) {
        this.modifyObject(this.selectedObject, false)
        if (object) {
          this.selectedObject = object
          this.modifyObject(object, true)
        } else {
          this.selectedObject = null
        }
      }
    },

    /* Modifying the object. */
    modifyObject (objectId, state) {
      const object = this.gameObjects.find(object => object.mesh.uuid === objectId)
      if (object) {
        object.toggleHover(state) // apply hover state
        // get the object's grid position
        const gridPosition = object.position

        // // sort the objects by distance from the selected object
        // const objectsByDistance = this.gameObjects.sort((a, b) => {
        //   const aDistance = Math.abs(a.position.x - gridPosition.x) + Math.abs(a.position.y - gridPosition.y)
        //   const bDistance = Math.abs(b.position.x - gridPosition.x) + Math.abs(b.position.y - gridPosition.y)
        //   return aDistance - bDistance
        // })
        // // get the 6 closest objects - ignore the selected object
        // const closestObjects = objectsByDistance.slice(1, 7)

        // limit selection to the ring of neighbors
        const range = this.hexGrid.ring({ x: gridPosition.x, y: gridPosition.y, z: gridPosition.z }, 1)
        // get the objects in range
        this.neighbors = this.gameObjects.filter(neighbor => {
          const pos = neighbor.position
          return !!range.some(hex => {
            return hex.x === pos.x && hex.y === pos.y // && hex.z === pos.z
          })
        })
        //
        // for (const neighbor of this.neighbors) {
        //   // find neighbor in the game objects
        //   if (neighbor.mesh) {
        //     const neighborObject = this.gameObjects.find(object => object.mesh.uuid === neighbor.mesh.uuid)
        //     if (neighborObject) {
        //       neighborObject.toggleHover(state)
        //     }
        //   }
        // }
      }
    },

    claimTile (tile) {
      // check if the player can claim the tile
      // player may only claim tiles surrounding their position

      if (!tile?.position) { return }

      // get the selection around the player
      const range = this.hexGrid.ring(this.player.currentTile, 1)
      const neighbors = this.gameObjects.filter(neighbor => {
        const pos = neighbor.position
        return !!range.some(hex => {
          return hex.x === pos.x && hex.y === pos.y // && hex.z === pos.z
        })
      }).filter(neighbor => neighbor.mesh)

      // check if the tile is in the selection
      const selectable = neighbors.find(neighbor => neighbor.position.x === tile.position.x && neighbor.position.y === tile.position.y)
      if (selectable) { // claim
        // move camera to the tile
        console.log(`Claiming tile ${tile.position.x}, ${tile.position.y}`)
        this.scene.camera.position = new THREE.Vector3(tile.position.x, tile.position.y, 16)
        this.scene.camera.lookAt = new THREE.Vector3(tile.position.x, tile.position.y, 0)
        this.updateCamera(this.scene)

        // update the player
        this.player.currentTile = tile.position
        this.player.ownedTiles.push(tile)

        // update the tile
        tile.dimensions.height = 1
        tile.color = '#ff0000'
        tile.updateHexObject()

        // if the tile has less than 6 neighbors, generate more

        const newrange = this.hexGrid.ring(tile.position, 1)

        // find game objects in range
        const newneighbors = this.gameObjects.filter(neighbor => {
          const pos = neighbor.position
          return !!newrange.some(hex => {
            return hex.x === pos.x && hex.y === pos.y // && hex.z === pos.z
          })
        }).filter(neighbor => neighbor.mesh)

        console.log(tile.position, newneighbors.length)
        if (newneighbors.length < newrange.length) {
          console.log(`generating ${newrange.length - newneighbors.length} new tiles`)
          // get the positions for the new tiles
          // by checking the neighbors of the current tile for missing tiles
          const missingTiles = newrange.filter(r => {
            return !newneighbors.some(n => n.position.x === r.x && n.position.y === r.y)
          })
          for (const point of missingTiles) {
            console.log('generating tile at', point)
            this.gameObjects.push(this.generateHex(new Hex(point)))
          }
        }
      }
    },

    updateCamera (scene) {
      this.scene = scene
    }
  },
  getters: {
    getHash () {
      console.log(this.seed)
      return this.seedHash
    },
    getObjects () {
      return this.gameObjects
    },
    getSelectedObject () {
      const object = this.gameObjects.find(object => object.mesh.uuid === this.selectedObject)
      if (object) {
        return object
      }
    },
    getMovementOptions () {
    // find the object's coordinates
      if (this.selectedObject) {
        const object = this.gameObjects.find(object => object.mesh.uuid === this.selectedObject)
        const objectCoordinates = object.position
        const movementOptions = []
        const grid = new HexGrid(new THREE.Vector3(0, 0, 0))
        const hexMap = grid.populatedHexes
        for (const hex of hexMap) {
          if (hex.coordinates.distanceTo(objectCoordinates) <= 1) {
            movementOptions.push(hex)
          }
        }
        return movementOptions
      }
    }
  }
})
