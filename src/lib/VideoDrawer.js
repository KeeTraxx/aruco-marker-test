function VideoDrawer (videoEl, canvas) {
  this.videoEl = videoEl
  this.canvas = canvas
  this.ctx = canvas.getContext('2d')
  window.addEventListener('resize', () => this.onWindowResize())
  this.onWindowResize()
}

VideoDrawer.prototype.draw = function () {
  this.ctx.drawImage(this.videoEl, this.offsetX, this.offsetY, this.videoEl.videoWidth * this.scale, this.videoEl.videoHeight * this.scale)
}

VideoDrawer.prototype.onWindowResize = function () {
  this.canvas.width = window.innerWidth
  this.canvas.height = window.innerHeight
  this.scale = Math.min(this.canvas.width / this.videoEl.videoWidth, this.canvas.height / this.videoEl.videoHeight)

  this.offsetX = (this.canvas.width - this.videoEl.videoWidth * this.scale) / 2
  this.offsetY = (this.canvas.height - this.videoEl.videoHeight * this.scale) / 2
}

VideoDrawer.prototype.getImageData = function () {
  return this.ctx.getImageData(this.offsetX, this.offsetY, this.videoEl.videoWidth * this.scale, this.videoEl.videoHeight * this.scale)
}

export default VideoDrawer
