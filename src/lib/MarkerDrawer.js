function MarkerDrawer (canvas) {
  this.canvas = canvas
  this.ctx = canvas.getContext('2d')
}

MarkerDrawer.prototype.draw = function (markers, offsetX = 0, offsetY = 0) {
  markers.forEach(m => {
    this.ctx.beginPath()
    this.ctx.lineWidth = 10
    this.ctx.moveTo(offsetX + m.corners[0].x, offsetY + m.corners[0].y)
    for (let i = 1; i < 4; i++) {
      this.ctx.lineTo(offsetX + m.corners[i].x, offsetY + m.corners[i].y)
    }
    this.ctx.closePath()
    this.ctx.strokeStyle = 'red'
    this.ctx.stroke()
    this.ctx.font = '24px Consolas'
    this.ctx.fillStyle = 'red'
    this.ctx.textAlign = 'center'
    let center = centroid(m.corners)
    this.ctx.fillText(m.id, offsetX + center.x, offsetY + center.y)
  })
}

// Calculates center of a polygon
// https://en.wikipedia.org/wiki/Centroid#Centroid_of_a_polygon
function centroid (corners) {
  let x = 0.0
  let y = 0.0
  let signedArea = 0.0

  for (let i = 0; i < corners.length; i++) {
    let a = corners[i].x * corners[(i + 1) % corners.length].y - corners[(i + 1) % corners.length].x * corners[i].y
    signedArea += a
    x += (corners[i].x + corners[(i + 1) % corners.length].x) * a
    y += (corners[i].y + corners[(i + 1) % corners.length].y) * a
  }

  signedArea *= 0.5

  x /= 6.0 * signedArea
  y /= 6.0 * signedArea

  return { x, y }
}

export default MarkerDrawer
