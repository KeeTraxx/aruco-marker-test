function WebcamFeed () {

}

WebcamFeed.prototype.requestWebcamFeed = function () {
  return navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(stream => {
    return stream
  })
}

export default WebcamFeed
