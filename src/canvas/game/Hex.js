// All things hex
export class Hex {
  cornerPosition (center, size, side) {
    const angleDeg = 60 * side - 30
    const angleRad = Math.PI / 180 * angleDeg
    return {
      x: center.x + size * Math.cos(angleRad),
      y: center.y + size * Math.sin(angleRad)
    }
  }

  // takes hex origin and size and generates sides
  generatePolygon (center, size) {
    // get corner points
    const corners = []
    for (let side = 0; side <= 6; side++) {
      corners.push(this.cornerPosition(center, size, side))
    }

    // pair corners to get sides
    const sides = corners.map(
      (corner, cornerIndex, corners) => {
        const side = []
        if (cornerIndex + 1 <= corners.length) { // connect corner with next corner
          side.push(corner, corners[cornerIndex + 1])
        } else { // connect last corner with the first one
          side.push(corner, corners[0])
        }
        return side
      }
    )

    return {
      origin: center,
      corners,
      sides
    }
  }
}
