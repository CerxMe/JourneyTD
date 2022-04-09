export default function hover (hex) {
  this.hex = hex
  this.animation = this.animation.bind(this)
  this.animation()
}
