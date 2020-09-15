// translate virtual coordinates into what gets drawn onscreen
export class Camera {
  constructor (screenSize) {
    this.screenSize = screenSize
    this.viewOffset = {
      x: 0,
      y: 0
    }
  }

  getViewOffset () {
    return this.viewOffset
  }

  setViewOffset (offset) {
    this.viewOffset = offset
  }

  isInView (coords) {
    // calculates whenever given coordinates are within camera view
    const { x, y } = coords

    // cameraView
    const { width, height } = this.screenSize

    const cameraRange = {
      left: width / 2 - this.viewOffset.x,
      right: width / 2 + this.viewOffset.x,
      top: height / 2 - this.viewOffset.y,
      bottom: height / 2 + this.viewOffsety
    }

    const horizontalCheck = (x <= cameraRange.left && x >= cameraRange.right)
    const verticalCheck = (y <= cameraRange.top && y >= cameraRange.bottom)

    // gives true/false
    return horizontalCheck && verticalCheck
  }

  centerView () {
    this.viewOffset = {
      x: this.screenSize.width / 2,
      y: this.screenSize.height / 2
    }
  }
}
