import { defineStore } from 'pinia'

export const usePlayerStore = defineStore({
  id: 'player',
  state: () => ({
    currentTile: null,
    ownedTiles: []
  }),
  actions: {
    startGame () {
      this.currentTile = {
        x: 0,
        y: 0
      }
    }
  },
  getters: {
    getCurrentTile () {
      return this.currentTile
    },
    getOwnedTiles () {
      return this.ownedTiles
    }
  }
})
