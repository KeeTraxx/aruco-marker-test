<template>
  <video ref="video" autoplay="1">
  </video>
</template>
<script>

export default {
  name: 'WebcamFeed',
  mounted () {
    console.log('WebcamFeed')

    navigator.mediaDevices.getUserMedia({
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
