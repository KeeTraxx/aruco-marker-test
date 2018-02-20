<template>
  <video ref="video" autoplay="1">
  </video>
</template>
<script>

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

export default {
  name: 'WebcamFeed',
  mounted () {
    console.log('WebcamFeed')

    navigator.getUserMedia({
      video: {
        facingMode: { exact: "environment" }
      }
    }, stream => {
      this.$refs.video.src = window.URL.createObjectURL(stream)
    }, function (err) {
      throw err
    })
  }
}
</script>
<style scoped>
video {
  width: 100%;
  height: 100%;
}
</style>
