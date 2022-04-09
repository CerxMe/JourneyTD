import { defineStore } from 'pinia'
import HexGrid from '../game/objects/hexGrid'
import * as Seedrandom from 'seedrandom'
import { ref } from 'vue'
import { SHA3 } from 'sha3'
import * as THREE from 'three'
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
      const initialViewDistance = 3 // initial view distance
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
      // hashes the entropy and sets the seed
      hash.update(entropy.toString() || '')
      this.seedHash = hash.digest('hex')
      hash.reset()
      this.rng = null
      this.rng = Seedrandom(this.seedHash)
      this.generateTiles()
    },

    getRng () {
      if (this.rng) {
        const random = this.rng()
        return random
      }
    },
    setSelectedObject (object) {
      this.selectedObject = object
    },

    updateCamera (scene) {
      this.scene = scene
    }
  },
  getters: {
    getObjects () {
      return this.gameObjects
    }
  }
})
