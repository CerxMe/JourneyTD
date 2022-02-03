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
    objects: null
  }),
  actions: {
    startGame () {
      this.gameState = 'game'
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
      for (const hex of hexMap) {
        // console.log('hex', hex) // hex
        const position = hex.center
        //  draw (position, size, color, offset)
        const dimensions = { width: 0.95, height: 0.2 }
        const colors = ['#53437f',
          '#a89fcc',
          '#ffffff',
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
        hex.color = color
        hex.slopeRatio = 0.88
        // get the mesh and add it to the scene
        const mesh = hex.draw(position, dimensions)
        if (mesh) {
          objects.push(mesh)
        }
      }
      this.objects = objects
    },

    // The entropy is a string of random parameters generated from user's inputs
    setEntropy (entropy) {
      console.log('entropy', entropy)
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
    }
  },
  getters: {
    getObjects () {
      return this.objects
    }
  }
})
