<template>
  <img :width="size" :height="size" :src="'data:image/svg+xml;base64,' + svg" />
</template>

<script>
export default {
  name: 'ArucoMarker',
  props: {
    arucoId: {
      type: Number,
      required: true
    },
    size: {
      type: Number,
      default: 200
    }
  },
  computed: {
    svg () {
      let ids = [16, 23, 9, 14]
      let index, val, x, y
      let matrix = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]

      for (y = 0; y < 5; y++) {
        index = (this.id >> 2 * (4 - y)) & 3
        val = ids[index]
        for (x = 0; x < 5; x++) {
          if ((val >> (4 - x)) & 1) {
            matrix[x][y] = 1
          } else {
            matrix[x][y] = 0
          }
        }
      }

      let image = '<svg viewBox="0 0 7 7" version="1.1" xmlns="http://www.w3.org/2000/svg">\n<rect x="0" y="0" width="7" height="7" fill="black"/>\n'

      for (x = 0; x < 5; x++) {
        for (y = 0; y < 5; y++) {
          if (matrix[x][y] === 1) {
            image += '  <rect x="' + (x + 1) + '" y="' + (y + 1) + '" width="1" height="1" fill="white" ' +
              // Slight stroke to get around aliasing issues with adjacent rectangles
              'stroke="white" stroke-width="0.01" />'
          }
        }
      }

      image += '</svg>'

      return window.btoa(image)
    }
  }
}

</script>
