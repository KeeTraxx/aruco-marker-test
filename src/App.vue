<template>
  <div id="app">
    <video ref="video" style="display:none"></video>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import WebcamFeed from './lib/WebcamFeed'
import AR from './lib/AR'
import POS from './lib/POS'
import ArucoMarker from './components/ArucoMarker'

let detector = new AR.Detector()
let poser
export default {
  name: 'App',
  components: {
    ArucoMarker
  },
  mounted () {
    let feed = new WebcamFeed()
    feed.requestWebcamFeed().then(stream => {
      console.log(stream)
      this.$refs.video.srcObject = stream
    }).then(() => {
      return new Promise(resolve => {
        this.$refs.video.onloadedmetadata = resolve
      })
    }).then(() => {
      this.ratio = this.$refs.video.videoWidth / this.$refs.video.videoHeight
      console.log(this.$refs.video.videoWidth, this.$refs.video.videoHeight, this.ratio)
      this.resizeCanvas()
    }).then(() => {
      this.$refs.video.play()
      this.draw()
    })

    window.addEventListener('resize', () => this.resizeCanvas())
  },
  data () {
    return {
      scale: undefined,
      offsetX: undefined,
      offsetY: undefined
    }
  },
  methods: {
    resizeCanvas () {
      this.$refs.canvas.width = window.innerWidth
      this.$refs.canvas.height = window.innerHeight
      this.scale = Math.min(this.$refs.canvas.width / this.$refs.video.videoWidth, this.$refs.canvas.height / this.$refs.video.videoHeight)

      this.offsetX = (this.$refs.canvas.width - this.$refs.video.videoWidth * this.scale) / 2
      this.offsetY = (this.$refs.canvas.height - this.$refs.video.videoHeight * this.scale) / 2
      poser = new POS.Posit(350, this.$refs.canvas.width)
    },
    draw () {
      requestAnimationFrame(() => this.draw())
      let context = this.$refs.canvas.getContext('2d')
      context.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height)
      this.$refs.canvas.getContext('2d').drawImage(this.$refs.video, this.offsetX, this.offsetY, this.$refs.video.videoWidth * this.scale, this.$refs.video.videoHeight * this.scale)
      let image = context.getImageData(this.offsetX, this.offsetY, this.$refs.canvas.width, this.$refs.canvas.height)
      let markers = detector.detect(image)
      if (markers && markers.length > 0) {
        markers.forEach(m => {
          context.beginPath()
          context.lineWidth = 10
          context.moveTo(this.offsetX + m.corners[0].x, this.offsetY + m.corners[0].y)
          for (let i = 1; i < 4; i++) {
            context.lineTo(this.offsetX + m.corners[i].x, this.offsetY + m.corners[i].y)
          }
          context.closePath()
          context.strokeStyle = 'red'
          context.stroke()

          let pos = poser.pose(m.corners)

          context.font = '30px Consolas'
          context.fillStyle = 'blue'
          let rotation = [-Math.asin(-pos.bestRotation[1][2]), -Math.atan2(pos.bestRotation[0][2], pos.bestRotation[2][2]), Math.atan2(pos.bestRotation[1][0], pos.bestRotation[1][1])]
          context.fillText('Position: ' + pos.bestTranslation.map(n => n.toFixed(2)), 10, 50)
          context.fillText('Rotation: ' + rotation.map(n => n.toFixed(2)), 10, 70)
        })
      } else {
        context.font = '30px Consolas'
        context.fillStyle = 'blue'
        context.fillText('No markers detected', 10, 50)
      }
    }
  }
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
}

canvas {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.marker {
  width: 300px;
  height: 300px;
}
</style>
