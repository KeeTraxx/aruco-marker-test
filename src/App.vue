<template>
  <div id="app" ref="app">
    <div id="canvasLayer">
      <canvas ref="canvas"></canvas>
    </div>
    <div id="infoLayer">
      <div class="markers">
        <h2>Detected Markers</h2>
        <div class="marker" v-for="(marker, index) in markers" :key="index">
          <aruco-marker :arucoId="marker.id" :size="32" />
          <div>
            <ul v-for="(corner, index) in marker.corners" :key="index">
              <li>{{corner.x}} / {{corner.y}}</li>
            </ul>
            <ul>
              <li v-if="marker.pos">POS: {{marker.pos.bestTranslation}}</li>
              <li v-if="marker.rotation">ROT: {{marker.rotation}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WebcamFeed from './lib/WebcamFeed'
import AR from './lib/AR'
import POS from './lib/POS'
import ArucoMarker from './components/ArucoMarker'
import VideoDrawer from './lib/VideoDrawer'
import MarkerDrawer from './lib/MarkerDrawer'

let detector = new AR.Detector()
let videoDrawer
let markerDrawer
let poser

export default {
  name: 'App',
  components: {
    ArucoMarker
  },
  data () {
    return {
      markers: []
    }
  },
  mounted () {
    let feed = new WebcamFeed(this.$refs.app)
    feed.requestWebcamFeed().then(videoEl => {
      videoDrawer = new VideoDrawer(videoEl, this.$refs.canvas)
      markerDrawer = new MarkerDrawer(this.$refs.canvas)
      this.draw()
    })

    window.addEventListener('resize', () => this.onWindowResize())
    this.onWindowResize()
  },
  computed: {
    ctx () {
      return this.$refs.canvas.getContext('2d')
    }
  },
  methods: {
    onWindowResize () {
      poser = new POS.Posit(350, this.$refs.canvas.width)
    },
    draw () {
      // requests animation frame depending on browser
      requestAnimationFrame(() => this.draw())
      this.ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height)
      // Draws video from video feed to canvas
      videoDrawer.draw()

      this.markers = detector.detect(videoDrawer.getImageData())
      this.markers.forEach(m => {
        m.pos = poser.pose(m.corners)
        if (m.pos) {
          m.rotation = [
            -Math.asin(-m.pos.bestRotation[1][2]),
            -Math.atan2(m.pos.bestRotation[0][2], m.pos.bestRotation[2][2]),
            Math.atan2(m.pos.bestRotation[1][0], m.pos.bestRotation[1][1])
          ]
        }
      })

      markerDrawer.draw(this.markers, videoDrawer.offsetX, videoDrawer.offsetY)
    }
  }
}
</script>

<style scoped>
#app > div {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

#infoLayer {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.markers {
  flex: 0 0 300px;
}

.marker {
  display: flex;
  flex-direction: row;
}

.marker ul {
  margin: 0;
}
</style>

<style>
html,
body {
  padding: 0;
  margin: 0;
}
</style>
