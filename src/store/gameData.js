import { defineStore } from 'pinia'
import HexGrid from '../game/objects/hexGrid'
import * as Seedrandom from 'seedrandom'
import { ref } from 'vue'
import { SHA3 } from 'sha3'
const hash = new SHA3(512)

export const useGameDataStore = defineStore({
  id: 'gameData',
  state: () => ({
    seed: null,
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
      Storage: 6*(2*(max(|dx|,|dy|,|dz|)+1))
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
        const dimensions = { width: 0.88, height: 0.22 }
        const mesh = hex.draw(position, dimensions) // get the mesh and add it to the scene
        objects.push(mesh)
      }
      this.objects = objects
    },

    // The entropy is a string of random parameters generated from user's inputs
    setEntropy (entropy) {
      // hashes the entropy and sets the seed
      hash.update(entropy.toString() || '')
      this.seed = hash.digest('hex')
      this.rng = new Seedrandom(this.seed, { entropy: true })
      this.generateTiles()
      return this.seed
    }
  },
  getters: {
    getRng () {
      if (this.rng.value) {
        const random = this.rng()
        return random
      }
    },
    getObjects () {
      return this.objects
    }
  }
})
