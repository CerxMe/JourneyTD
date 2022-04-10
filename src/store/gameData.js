import { defineStore } from 'pinia'
import HexGrid from '../game/objects/hexGrid'
import { ref } from 'vue'
import { SHA3 } from 'sha3'
import { Chacha20 } from 'ts-chacha20'
import * as THREE from 'three'
import * as buffer from 'buffer'
import Selection from '../game/objects/selection'
import { Vector3 } from 'three'

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
    player: null, // Hex object of the player's current tile position
    selectedObject: null // Hex object of the selected object
  }),
  actions: {
    startGame () {
      this.gameState = 'game'
      console.log('game started with seed:', this.seedHash)

      // TODO: Unlock player movement
      // this.player.position = new THREE.Vector3(0, 0, 0)
    },

    // Prepares starting tiles
    generateTiles () {
      const initialViewDistance = 1 // initial view distance
      const gridCenter = new THREE.Vector3(0, 0, 0)
      const grid = new HexGrid(gridCenter)
      grid.createMap(initialViewDistance)
      const hexMap = grid.populatedHexes
      const objects = []
      for (const hex of hexMap) {
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
    modifyObject (objectId, state) {
      const object = this.gameObjects.find(object => object.mesh.uuid === objectId)
      if (object) {
        object.toggleHover(state)// add a new object to the scene
        // this.gameObjects = this.gameObjects.map(existingObject => {
        //   if (existingObject.mesh.uuid === object.mesh.uuid) {
        //     return object
        //   }
        //   return existingObject
        // })
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
