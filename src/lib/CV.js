let CV = {}

CV.Image = function (width, height, data) {
  this.width = width || 0
  this.height = height || 0
  this.data = data || []
}

CV.grayscale = function (imageSrc, imageDst) {
  let src = imageSrc.data
  let dst = imageDst.data
  let len = src.length
  let i = 0
  let j = 0

  for (; i < len; i += 4) {
    dst[j++] =
      (src[i] * 0.299 + src[i + 1] * 0.587 + src[i + 2] * 0.114 + 0.5) & 0xff
  }

  imageDst.width = imageSrc.width
  imageDst.height = imageSrc.height

  return imageDst
}

CV.threshold = function (imageSrc, imageDst, threshold) {
  let src = imageSrc.data
  let dst = imageDst.data
  let len = src.length
  let tab = []
  let i

  for (i = 0; i < 256; ++i) {
    tab[i] = i <= threshold ? 0 : 255
  }

  for (i = 0; i < len; ++i) {
    dst[i] = tab[src[i]]
  }

  imageDst.width = imageSrc.width
  imageDst.height = imageSrc.height

  return imageDst
}

CV.adaptiveThreshold = function (imageSrc, imageDst, kernelSize, threshold) {
  let src = imageSrc.data
  let dst = imageDst.data
  let len = src.length
  let tab = []
  let i

  CV.stackBoxBlur(imageSrc, imageDst, kernelSize)

  for (i = 0; i < 768; ++i) {
    tab[i] = (i - 255 <= -threshold) ? 255 : 0
  }

  for (i = 0; i < len; ++i) {
    dst[i] = tab[src[i] - dst[i] + 255]
  }

  imageDst.width = imageSrc.width
  imageDst.height = imageSrc.height

  return imageDst
}

CV.otsu = function (imageSrc) {
  let src = imageSrc.data
  let len = src.length
  let hist = []
  let threshold = 0
  let sum = 0
  let sumB = 0
  let wB = 0
  let wF = 0
  let max = 0
  let mu
  let between
  let i

  for (i = 0; i < 256; ++i) {
    hist[i] = 0
  }

  for (i = 0; i < len; ++i) {
    hist[src[i]]++
  }

  for (i = 0; i < 256; ++i) {
    sum += hist[i] * i
  }

  for (i = 0; i < 256; ++i) {
    wB += hist[i]
    if (wB !== 0) {
      wF = len - wB
      if (wF === 0) {
        break
      }

      sumB += hist[i] * i

      mu = (sumB / wB) - ((sum - sumB) / wF)

      between = wB * wF * mu * mu

      if (between > max) {
        max = between
        threshold = i
      }
    }
  }

  return threshold
}

CV.stackBoxBlurMult =
  [1, 171, 205, 293, 57, 373, 79, 137, 241, 27, 391, 357, 41, 19, 283, 265]

CV.stackBoxBlurShift =
  [0, 9, 10, 11, 9, 12, 10, 11, 12, 9, 13, 13, 10, 9, 13, 13]

CV.BlurStack = function () {
  this.color = 0
  this.next = null
}

CV.stackBoxBlur = function (imageSrc, imageDst, kernelSize) {
  let src = imageSrc.data
  let dst = imageDst.data
  let height = imageSrc.height
  let width = imageSrc.width
  let heightMinus1 = height - 1
  let widthMinus1 = width - 1
  let size = kernelSize + kernelSize + 1
  let radius = kernelSize + 1
  let mult = CV.stackBoxBlurMult[kernelSize]
  let shift = CV.stackBoxBlurShift[kernelSize]
  let stack
  let stackStart
  let color
  let sum
  let pos
  let start
  let p
  let x
  let y
  let i

  stack = stackStart = new CV.BlurStack()
  for (i = 1; i < size; ++i) {
    stack = stack.next = new CV.BlurStack()
  }
  stack.next = stackStart

  pos = 0

  for (y = 0; y < height; ++y) {
    start = pos

    color = src[pos]
    sum = radius * color

    stack = stackStart
    for (i = 0; i < radius; ++i) {
      stack.color = color
      stack = stack.next
    }
    for (i = 1; i < radius; ++i) {
      stack.color = src[pos + i]
      sum += stack.color
      stack = stack.next
    }

    stack = stackStart
    for (x = 0; x < width; ++x) {
      dst[pos++] = (sum * mult) >>> shift

      p = x + radius
      p = start + (p < widthMinus1 ? p : widthMinus1)
      sum -= stack.color - src[p]

      stack.color = src[p]
      stack = stack.next
    }
  }

  for (x = 0; x < width; ++x) {
    pos = x
    start = pos + width

    color = dst[pos]
    sum = radius * color

    stack = stackStart
    for (i = 0; i < radius; ++i) {
      stack.color = color
      stack = stack.next
    }
    for (i = 1; i < radius; ++i) {
      stack.color = dst[start]
      sum += stack.color
      stack = stack.next

      start += width
    }

    stack = stackStart
    for (y = 0; y < height; ++y) {
      dst[pos] = (sum * mult) >>> shift

      p = y + radius
      p = x + ((p < heightMinus1 ? p : heightMinus1) * width)
      sum -= stack.color - dst[p]

      stack.color = dst[p]
      stack = stack.next

      pos += width
    }
  }

  return imageDst
}

CV.gaussianBlur = function (imageSrc, imageDst, imageMean, kernelSize) {
  let kernel = CV.gaussianKernel(kernelSize)

  imageDst.width = imageSrc.width
  imageDst.height = imageSrc.height

  imageMean.width = imageSrc.width
  imageMean.height = imageSrc.height

  CV.gaussianBlurFilter(imageSrc, imageMean, kernel, true)
  CV.gaussianBlurFilter(imageMean, imageDst, kernel, false)

  return imageDst
}

CV.gaussianBlurFilter = function (imageSrc, imageDst, kernel, horizontal) {
  let src = imageSrc.data
  let dst = imageDst.data
  let height = imageSrc.height
  let width = imageSrc.width
  let pos = 0
  let limit = kernel.length >> 1
  let cur
  let value
  let i
  let j
  let k

  for (i = 0; i < height; ++i) {
    for (j = 0; j < width; ++j) {
      value = 0.0

      for (k = -limit; k <= limit; ++k) {
        if (horizontal) {
          cur = pos + k
          if (j + k < 0) {
            cur = pos
          } else if (j + k >= width) {
            cur = pos
          }
        } else {
          cur = pos + (k * width)
          if (i + k < 0) {
            cur = pos
          } else if (i + k >= height) {
            cur = pos
          }
        }

        value += kernel[limit + k] * src[cur]
      }

      dst[pos++] = horizontal ? value : (value + 0.5) & 0xff
    }
  }

  return imageDst
}

CV.gaussianKernel = function (kernelSize) {
  let tab = [[1], [0.25, 0.5, 0.25], [0.0625, 0.25, 0.375, 0.25, 0.0625], [0.03125, 0.109375, 0.21875, 0.28125, 0.21875, 0.109375, 0.03125]]
  let kernel = []
  let center
  let sigma
  let scale2X
  let sum
  let x
  let i

  if ((kernelSize <= 7) && (kernelSize % 2 === 1)) {
    kernel = tab[kernelSize >> 1]
  } else {
    center = (kernelSize - 1.0) * 0.5
    sigma = 0.8 + (0.3 * (center - 1.0))
    scale2X = -0.5 / (sigma * sigma)
    sum = 0.0
    for (i = 0; i < kernelSize; ++i) {
      x = i - center
      sum += kernel[i] = Math.exp(scale2X * x * x)
    }
    sum = 1 / sum
    for (i = 0; i < kernelSize; ++i) {
      kernel[i] *= sum
    }
  }

  return kernel
}

CV.findContours = function (imageSrc, binary) {
  let width = imageSrc.width
  let height = imageSrc.height
  let contours = []
  let src
  let deltas
  let pos
  let pix
  let nbd
  let outer
  let hole
  let i
  let j

  src = CV.binaryBorder(imageSrc, binary)

  deltas = CV.neighborhoodDeltas(width + 2)

  pos = width + 3
  nbd = 1

  for (i = 0; i < height; ++i, pos += 2) {
    for (j = 0; j < width; ++j, ++pos) {
      pix = src[pos]

      if (pix !== 0) {
        outer = hole = false

        if (pix === 1 && src[pos - 1] === 0) {
          outer = true
        } else if (pix >= 1 && src[pos + 1] === 0) {
          hole = true
        }

        if (outer || hole) {
          ++nbd

          contours.push(CV.borderFollowing(src, pos, nbd, { x: j, y: i }, hole, deltas))
        }
      }
    }
  }

  return contours
}

CV.borderFollowing = function (src, pos, nbd, point, hole, deltas) {
  let contour = []
  let pos1
  let pos3
  let pos4
  let s
  let sEnd
  // let sPrev

  contour.hole = hole

  s = sEnd = hole ? 0 : 4
  do {
    s = (s - 1) & 7
    pos1 = pos + deltas[s]
    if (src[pos1] !== 0) {
      break
    }
  } while (s !== sEnd)

  if (s === sEnd) {
    src[pos] = -nbd
    contour.push({ x: point.x, y: point.y })
  } else {
    pos3 = pos
    // sPrev = s ^ 4

    while (true) {
      sEnd = s

      do {
        pos4 = pos3 + deltas[++s]
      } while (src[pos4] === 0)

      s &= 7

      if (((s - 1) >>> 0) < (sEnd >>> 0)) {
        src[pos3] = -nbd
      } else if (src[pos3] === 1) {
        src[pos3] = nbd
      }

      contour.push({ x: point.x, y: point.y })

      // sPrev = s

      point.x += CV.neighborhood[s][0]
      point.y += CV.neighborhood[s][1]

      if ((pos4 === pos) && (pos3 === pos1)) {
        break
      }

      pos3 = pos4
      s = (s + 4) & 7
    }
  }

  return contour
}

CV.neighborhood =
  [[1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1]]

CV.neighborhoodDeltas = function (width) {
  let deltas = []
  let len = CV.neighborhood.length
  let i = 0

  for (; i < len; ++i) {
    deltas[i] = CV.neighborhood[i][0] + (CV.neighborhood[i][1] * width)
  }

  return deltas.concat(deltas)
}

CV.approxPolyDP = function (contour, epsilon) {
  let slice = { start_index: 0, end_index: 0 }
  let rightSlice = { start_index: 0, end_index: 0 }
  let poly = []
  let stack = []
  let len = contour.length
  let pt
  let startPt
  let endPt
  let dist
  let maxDist
  let leEps
  let dx
  let dy
  let i
  let j
  let k

  epsilon *= epsilon

  k = 0

  for (i = 0; i < 3; ++i) {
    maxDist = 0

    k = (k + rightSlice.start_index) % len
    startPt = contour[k]
    if (++k === len) { k = 0 }

    for (j = 1; j < len; ++j) {
      pt = contour[k]
      if (++k === len) { k = 0 }

      dx = pt.x - startPt.x
      dy = pt.y - startPt.y
      dist = dx * dx + dy * dy

      if (dist > maxDist) {
        maxDist = dist
        rightSlice.start_index = j
      }
    }
  }

  if (maxDist <= epsilon) {
    poly.push({ x: startPt.x, y: startPt.y })
  } else {
    slice.start_index = k
    slice.end_index = (rightSlice.start_index += slice.start_index)

    rightSlice.start_index -= rightSlice.start_index >= len ? len : 0
    rightSlice.end_index = slice.start_index
    if (rightSlice.end_index < rightSlice.start_index) {
      rightSlice.end_index += len
    }

    stack.push({ start_index: rightSlice.start_index, end_index: rightSlice.end_index })
    stack.push({ start_index: slice.start_index, end_index: slice.end_index })
  }

  while (stack.length !== 0) {
    slice = stack.pop()

    endPt = contour[slice.end_index % len]
    startPt = contour[k = slice.start_index % len]
    if (++k === len) { k = 0 }

    if (slice.end_index <= slice.start_index + 1) {
      leEps = true
    } else {
      maxDist = 0

      dx = endPt.x - startPt.x
      dy = endPt.y - startPt.y

      for (i = slice.start_index + 1; i < slice.end_index; ++i) {
        pt = contour[k]
        if (++k === len) { k = 0 }

        dist = Math.abs((pt.y - startPt.y) * dx - (pt.x - startPt.x) * dy)

        if (dist > maxDist) {
          maxDist = dist
          rightSlice.start_index = i
        }
      }

      leEps = maxDist * maxDist <= epsilon * (dx * dx + dy * dy)
    }

    if (leEps) {
      poly.push({ x: startPt.x, y: startPt.y })
    } else {
      rightSlice.end_index = slice.end_index
      slice.end_index = rightSlice.start_index

      stack.push({ start_index: rightSlice.start_index, end_index: rightSlice.end_index })
      stack.push({ start_index: slice.start_index, end_index: slice.end_index })
    }
  }

  return poly
}

CV.warp = function (imageSrc, imageDst, contour, warpSize) {
  let src = imageSrc.data
  let dst = imageDst.data
  let width = imageSrc.width
  let height = imageSrc.height
  let pos = 0
  let sx1
  let sx2
  let dx1
  let dx2
  let sy1
  let sy2
  let dy1
  let dy2
  let p1
  let p2
  let p3
  let p4
  let m
  let r
  let s
  let t
  let u
  let v
  let w
  let x
  let y
  let i
  let j

  m = CV.getPerspectiveTransform(contour, warpSize - 1)

  r = m[8]
  s = m[2]
  t = m[5]

  for (i = 0; i < warpSize; ++i) {
    r += m[7]
    s += m[1]
    t += m[4]

    u = r
    v = s
    w = t

    for (j = 0; j < warpSize; ++j) {
      u += m[6]
      v += m[0]
      w += m[3]

      x = v / u
      y = w / u

      sx1 = x >>> 0
      sx2 = (sx1 === width - 1) ? sx1 : sx1 + 1
      dx1 = x - sx1
      dx2 = 1.0 - dx1

      sy1 = y >>> 0
      sy2 = (sy1 === height - 1) ? sy1 : sy1 + 1
      dy1 = y - sy1
      dy2 = 1.0 - dy1

      p1 = p2 = sy1 * width
      p3 = p4 = sy2 * width

      dst[pos++] =
        (dy2 * (dx2 * src[p1 + sx1] + dx1 * src[p2 + sx2]) +
          dy1 * (dx2 * src[p3 + sx1] + dx1 * src[p4 + sx2])) & 0xff
    }
  }

  imageDst.width = warpSize
  imageDst.height = warpSize

  return imageDst
}

CV.getPerspectiveTransform = function (src, size) {
  let rq = CV.square2quad(src)

  rq[0] /= size
  rq[1] /= size
  rq[3] /= size
  rq[4] /= size
  rq[6] /= size
  rq[7] /= size

  return rq
}

CV.square2quad = function (src) {
  let sq = []
  let px
  let py
  let dx1
  let dx2
  let dy1
  let dy2
  let den

  px = src[0].x - src[1].x + src[2].x - src[3].x
  py = src[0].y - src[1].y + src[2].y - src[3].y

  if (px === 0 && py === 0) {
    sq[0] = src[1].x - src[0].x
    sq[1] = src[2].x - src[1].x
    sq[2] = src[0].x
    sq[3] = src[1].y - src[0].y
    sq[4] = src[2].y - src[1].y
    sq[5] = src[0].y
    sq[6] = 0
    sq[7] = 0
    sq[8] = 1
  } else {
    dx1 = src[1].x - src[2].x
    dx2 = src[3].x - src[2].x
    dy1 = src[1].y - src[2].y
    dy2 = src[3].y - src[2].y
    den = dx1 * dy2 - dx2 * dy1

    sq[6] = (px * dy2 - dx2 * py) / den
    sq[7] = (dx1 * py - px * dy1) / den
    sq[8] = 1
    sq[0] = src[1].x - src[0].x + sq[6] * src[1].x
    sq[1] = src[3].x - src[0].x + sq[7] * src[3].x
    sq[2] = src[0].x
    sq[3] = src[1].y - src[0].y + sq[6] * src[1].y
    sq[4] = src[3].y - src[0].y + sq[7] * src[3].y
    sq[5] = src[0].y
  }

  return sq
}

CV.isContourConvex = function (contour) {
  let orientation = 0
  let convex = true
  let len = contour.length
  let i = 0
  let j = 0
  let curPt
  let prevPt
  let dxdy0
  let dydx0
  let dx0
  let dy0
  let dx
  let dy

  prevPt = contour[len - 1]
  curPt = contour[0]

  dx0 = curPt.x - prevPt.x
  dy0 = curPt.y - prevPt.y

  for (; i < len; ++i) {
    if (++j === len) { j = 0 }

    prevPt = curPt
    curPt = contour[j]

    dx = curPt.x - prevPt.x
    dy = curPt.y - prevPt.y
    dxdy0 = dx * dy0
    dydx0 = dy * dx0

    orientation |= dydx0 > dxdy0 ? 1 : (dydx0 < dxdy0 ? 2 : 3)

    if (orientation === 3) {
      convex = false
      break
    }

    dx0 = dx
    dy0 = dy
  }

  return convex
}

CV.perimeter = function (poly) {
  let len = poly.length
  let i = 0
  let j = len - 1
  let p = 0.0
  let dx
  let dy

  for (; i < len; j = i++) {
    dx = poly[i].x - poly[j].x
    dy = poly[i].y - poly[j].y

    p += Math.sqrt(dx * dx + dy * dy)
  }

  return p
}

CV.minEdgeLength = function (poly) {
  let len = poly.length
  let i = 0
  let j = len - 1
  let min = Infinity
  let d
  let dx
  let dy

  for (; i < len; j = i++) {
    dx = poly[i].x - poly[j].x
    dy = poly[i].y - poly[j].y

    d = dx * dx + dy * dy

    if (d < min) {
      min = d
    }
  }

  return Math.sqrt(min)
}

CV.countNonZero = function (imageSrc, square) {
  let src = imageSrc.data
  let height = square.height
  let width = square.width
  let pos = square.x + (square.y * imageSrc.width)
  let span = imageSrc.width - width
  let nz = 0
  let i
  let j

  for (i = 0; i < height; ++i) {
    for (j = 0; j < width; ++j) {
      if (src[pos++] !== 0) {
        ++nz
      }
    }

    pos += span
  }

  return nz
}

CV.binaryBorder = function (imageSrc, dst) {
  let src = imageSrc.data
  let height = imageSrc.height
  let width = imageSrc.width
  let posSrc = 0
  let posDst = 0
  let i
  let j

  for (j = -2; j < width; ++j) {
    dst[posDst++] = 0
  }

  for (i = 0; i < height; ++i) {
    dst[posDst++] = 0

    for (j = 0; j < width; ++j) {
      dst[posDst++] = (src[posSrc++] === 0 ? 0 : 1)
    }

    dst[posDst++] = 0
  }

  for (j = -2; j < width; ++j) {
    dst[posDst++] = 0
  }

  return dst
}

export default CV
