import { defineStore } from 'pinia'
import HexGrid from '../game/objects/hexGrid'

export const useGameDataStore = defineStore('gameData', () => {
  // actions
  function generateTiles () {
    const mapsize = 3 // initial view distance
    const hexsize = 1
    const tiles = new HexGrid(mapsize, hexsize)
    console.log('STORE TILES GENERATED', tiles)
    return tiles
  }

  // initialize the game data
  const tiles = generateTiles()
  // set state
  const state = {
    player: {
      position: {
        x: 0,
        y: 0
      }
    },
    map: {
      center: {
        x: 0,
        y: 0
      },
      zoom: 1,
      storedTiles: tiles, // stores generated data in the map
      renderedTiles: [] // transforms stored data into a renderable format
    }
  }
  return { state, generateTiles }
  //
  //
  // },
  // // could also be defined as
  // // state: () => ({ count: 0 })
  // actions: {
  //   // movePlayer (position) {
  //   //   this.player.position = position
  //   //   this.updateRenderedTiles() // update the rendered tiles
  //   // },
  //   // updateRenderedTiles () {
  //   //   // update the rendered tiles
  //   //   this.map.renderedTiles = this.map.storedTiles.map(tile => {
  //   //     return {
  //   //       ...tile,
  //   //       position: {
  //   //         x: tile.position.x - this.map.center.x,
  //   //         y: tile.position.y - this.map.center.y
  //   //       }
  //   //     }
  //   //   })
  //   // },
  //
  // }
})
