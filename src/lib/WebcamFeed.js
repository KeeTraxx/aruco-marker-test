function WebcamFeed (domEl, facingMode = 'environment') {
  this.facingMode = facingMode
  this.domEl = domEl
}

function onLoadedMetaData (videoElement) {
  return new Promise((resolve, reject) => {
    videoElement.onloadedmetadata = metadata => {
      resolve(metadata)
    }
  })
}

WebcamFeed.prototype.requestWebcamFeed = function () {
  const videoElement = document.createElement('video')
  // this.domEl.appendChild(videoElement)
  videoElement.autoplay = true
  return navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: this.facingMode
    }
  }).then(stream => {
    console.log('Got stream', stream)
    videoElement.srcObject = stream
    return onLoadedMetaData(videoElement)
  }).then(metadata => {
    return videoElement
  })
}

export default WebcamFeed
