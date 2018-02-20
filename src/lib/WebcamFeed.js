function WebcamFeed () {
}

WebcamFeed.prototype.requestWebcamFeed = function () {
  return navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: {
        exact: 'environment'
      }
    }
  }).then(stream => {
    return stream
  })
}

export default WebcamFeed
