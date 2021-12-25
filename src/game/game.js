// class GameManager() {
//     constructor() {
//         this.game = new Game();
//         this.game.init();
//     }
//
//     update() {
//         this.game.update();
//     }
//
//     render() {
//         this.game.render();
//     }
// }

import HexGrid from './hexgrid'

// the game renders two layers of hexes, one for the background and one for the foreground
// the background layer is rendered first it is an infinite grid  of hexes with an origin at 0, 0 and excludes all the hexes from the foreground layer
// the foreground layer is rendered second, it is an overlay of hexes on the background layer which the player has explored and are visible

class Game {
  constructor () {
    // initialize the memory with an empty hex grid around the origion of the starting player position (0,0)
    const viewDistance = 3 // the number of hexes that can be seen from the starting player position
    this.hexGrid = new HexGrid(viewDistance, 1)

    // create a map from the hex grid to the game objects
    const hexes = this.hexGrid.getHexes()



    this.player = {
      x: 0,
      y: 0
    }
    this.player.x = this.hexGrid.hexes[0][0].x
    this.player.y = this.hexGrid.hexes[0][0].y
    this.player.direction = 'north'
    this.player.speed = 1
    this.player.movement = 0
    this.player.movementMax = 1
    this.player.movementRemaining = this.player.movementMax
    this.player.movementCost = 1
    this.player.movementCostRemaining = this.player.movementCost
  }
}
