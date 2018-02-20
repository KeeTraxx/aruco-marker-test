
import CV from './CV'

let AR = {}

AR.Marker = function (id, corners) {
  this.id = id
  this.corners = corners
}

AR.Detector = function () {
  this.grey = new CV.Image()
  this.thres = new CV.Image()
  this.homography = new CV.Image()
  this.binary = []
  this.contours = []
  this.polys = []
  this.candidates = []
}

AR.Detector.prototype.detect = function (image) {
  CV.grayscale(image, this.grey)
  CV.adaptiveThreshold(this.grey, this.thres, 2, 7)

  this.contours = CV.findContours(this.thres, this.binary)

  this.candidates = this.findCandidates(this.contours, image.width * 0.20, 0.05, 10)
  this.candidates = this.clockwiseCorners(this.candidates)
  this.candidates = this.notTooNear(this.candidates, 10)

  return this.findMarkers(this.grey, this.candidates, 49)
}

AR.Detector.prototype.findCandidates = function (contours, minSize, epsilon, minLength) {
  let candidates = []
  let len = contours.length
  let contour
  let poly
  let i

  this.polys = []

  for (i = 0; i < len; ++i) {
    contour = contours[i]

    if (contour.length >= minSize) {
      poly = CV.approxPolyDP(contour, contour.length * epsilon)

      this.polys.push(poly)

      if ((poly.length === 4) && (CV.isContourConvex(poly))) {
        if (CV.minEdgeLength(poly) >= minLength) {
          candidates.push(poly)
        }
      }
    }
  }

  return candidates
}

AR.Detector.prototype.clockwiseCorners = function (candidates) {
  let len = candidates.length
  let dx1
  let dx2
  let dy1
  let dy2
  let swap
  let i

  for (i = 0; i < len; ++i) {
    dx1 = candidates[i][1].x - candidates[i][0].x
    dy1 = candidates[i][1].y - candidates[i][0].y
    dx2 = candidates[i][2].x - candidates[i][0].x
    dy2 = candidates[i][2].y - candidates[i][0].y

    if ((dx1 * dy2 - dy1 * dx2) < 0) {
      swap = candidates[i][1]
      candidates[i][1] = candidates[i][3]
      candidates[i][3] = swap
    }
  }

  return candidates
}

AR.Detector.prototype.notTooNear = function (candidates, minDist) {
  let notTooNear = []
  let len = candidates.length
  let dist
  let dx
  let dy
  let i
  let j
  let k

  for (i = 0; i < len; ++i) {
    for (j = i + 1; j < len; ++j) {
      dist = 0

      for (k = 0; k < 4; ++k) {
        dx = candidates[i][k].x - candidates[j][k].x
        dy = candidates[i][k].y - candidates[j][k].y

        dist += dx * dx + dy * dy
      }

      if ((dist / 4) < (minDist * minDist)) {
        if (CV.perimeter(candidates[i]) < CV.perimeter(candidates[j])) {
          candidates[i].tooNear = true
        } else {
          candidates[j].tooNear = true
        }
      }
    }
  }

  for (i = 0; i < len; ++i) {
    if (!candidates[i].tooNear) {
      notTooNear.push(candidates[i])
    }
  }

  return notTooNear
}

AR.Detector.prototype.findMarkers = function (imageSrc, candidates, warpSize) {
  let markers = []
  let len = candidates.length
  let candidate
  let marker
  let i

  for (i = 0; i < len; ++i) {
    candidate = candidates[i]

    CV.warp(imageSrc, this.homography, candidate, warpSize)

    CV.threshold(this.homography, this.homography, CV.otsu(this.homography))

    marker = this.getMarker(this.homography, candidate)
    if (marker) {
      markers.push(marker)
    }
  }

  return markers
}

AR.Detector.prototype.getMarker = function (imageSrc, candidate) {
  let width = (imageSrc.width / 7) >>> 0
  let minZero = (width * width) >> 1
  let bits = []
  let rotations = []
  let distances = []
  let square
  let pair
  let inc
  let i
  let j

  for (i = 0; i < 7; ++i) {
    inc = (i === 0 || i === 6) ? 1 : 6

    for (j = 0; j < 7; j += inc) {
      square = { x: j * width, y: i * width, width: width, height: width }
      if (CV.countNonZero(imageSrc, square) > minZero) {
        return null
      }
    }
  }

  for (i = 0; i < 5; ++i) {
    bits[i] = []

    for (j = 0; j < 5; ++j) {
      square = { x: (j + 1) * width, y: (i + 1) * width, width: width, height: width }

      bits[i][j] = CV.countNonZero(imageSrc, square) > minZero ? 1 : 0
    }
  }

  rotations[0] = bits
  distances[0] = this.hammingDistance(rotations[0])

  pair = { first: distances[0], second: 0 }

  for (i = 1; i < 4; ++i) {
    rotations[i] = this.rotate(rotations[i - 1])
    distances[i] = this.hammingDistance(rotations[i])

    if (distances[i] < pair.first) {
      pair.first = distances[i]
      pair.second = i
    }
  }

  if (pair.first !== 0) {
    return null
  }

  return new AR.Marker(
    this.mat2id(rotations[pair.second]),
    this.rotate2(candidate, 4 - pair.second))
}

AR.Detector.prototype.hammingDistance = function (bits) {
  let ids = [[1, 0, 0, 0, 0], [1, 0, 1, 1, 1], [0, 1, 0, 0, 1], [0, 1, 1, 1, 0]]
  let dist = 0
  let sum
  let minSum
  let i
  let j
  let k

  for (i = 0; i < 5; ++i) {
    minSum = Infinity

    for (j = 0; j < 4; ++j) {
      sum = 0

      for (k = 0; k < 5; ++k) {
        sum += bits[i][k] === ids[j][k] ? 0 : 1
      }

      if (sum < minSum) {
        minSum = sum
      }
    }

    dist += minSum
  }

  return dist
}

AR.Detector.prototype.mat2id = function (bits) {
  let id = 0
  let i

  for (i = 0; i < 5; ++i) {
    id <<= 1
    id |= bits[i][1]
    id <<= 1
    id |= bits[i][3]
  }

  return id
}

AR.Detector.prototype.rotate = function (src) {
  let dst = []
  let len = src.length
  let i
  let j

  for (i = 0; i < len; ++i) {
    dst[i] = []
    for (j = 0; j < src[i].length; ++j) {
      dst[i][j] = src[src[i].length - j - 1][i]
    }
  }

  return dst
}

AR.Detector.prototype.rotate2 = function (src, rotation) {
  let dst = []
  let len = src.length
  let i

  for (i = 0; i < len; ++i) {
    dst[i] = src[(rotation + i) % len]
  }

  return dst
}

export default AR
