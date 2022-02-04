import { defineStore } from 'pinia'
import HexGrid from '../game/objects/hexGrid'
import * as Seedrandom from 'seedrandom'
import { ref } from 'vue'
import { SHA3 } from 'sha3'
const hash = new SHA3(512)

export const useGameDataStore = defineStore({
  id: 'gameData',
  state: () => ({
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
      // Start raycaster
    },
    generateTiles () {
      const initialViewDistance = 3 // initial view distance
      const hexSize = 1

      /*
      Generates a hashtable for cube projection of hex coordinates
      Horizontal lines have constant "y" coordinate. Diagonal lines have constant "x" and "z" coordinates. Neighboring cells differ by 1 in two coordinates.

      Distance: max(|dx|,|dy|,|dz|)
      Storage: wtf
      Neighbors: (1,0,-1); (-1,0,1); (0,1,-1); (0,-1,1); (1,-1,0); (-1,1,0)
      Straight lines: (x ± n, y, z ∓ n); (x ± n, y ∓ n, z); (x, y ± n, z ∓ n)
      Remarks: x+y+z = 0; x, y, z ∈ ℕ
      */

      // console.log('RNG')
      // for (let j = 0; j < mapsize; j++) {
      //   const random = getRng()
      //   console.log()
      // }

      // renders backround hexagon grid
      console.log('generating hexes')
      const gameMap = new HexGrid(initialViewDistance, hexSize)
      const hexMap = gameMap.map
      const objects = []
      let first = false
      for (const hex of hexMap) {
        const x = hex.x
        // console.log('hex', hex) // hex
        const position = hex.center
        //  draw (position, size, color, offset)
        const dimensions = { width: 0.99, height: 0.35 }
        const colors = ['#53437f',
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
          '#ffd9ae']
        const rng = this.getRng()
        // console.log(rng)
        const color = colors[Math.floor(rng * colors.length)]
        // console.log('color', color)
        if (color) {
          hex.color = color
        }
        hex.slopeRatio = 0.75

        if (!first) {
          first = true
          hex.claimed = true
          this.player = hex
          hex.color = '#ffffff'
          hex.slopeRatio = 0.88
        }

        // get the mesh and add it to the scene
        hex.draw(position, dimensions)
        objects.push(hex)
      }
      this.gameObjects = objects
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
    }
  },
  getters: {
    getObjects () {
      return this.gameObjects
    }
  }
})
