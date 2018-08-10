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
    try {
      videoElement.srcObject = stream
    } catch (error) {
      // Fallback to video.src
      console.log('<video>.srcOject not supported, falling back to <video>.src')
      video.src = URL.createObjectURL(stream);
    }
    return onLoadedMetaData(videoElement)
  }).then(metadata => {
    return videoElement
  }).catch(err => {
    console.error('Error getting video stream', err)
  })
}

export default WebcamFeed
