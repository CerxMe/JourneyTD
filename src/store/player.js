import { defineStore } from 'pinia'

export const usePlayerStore = defineStore({
  id: 'gameData',
  state: () => ({
    position: null, // Hex object of the player's current tile position
    unlocked: [], // Array of hex objects of the player's unlocked tiles
    inventory: [], // Array of hex objects of the player's inventory
    health: 100, // Player's current health
    maxHealth: 100 // Player's maximum health
  }),
  actions: {
    // startGame() {
    //     this.gameState = 'game'
    //     console.log('game started with seed:', this.seedHash)
    // },
  }
})
