<template>
<div>
  <svg xmlns="http://www.w3.org/2000/svg" ref="svg" viewBox="0 0 7 7" preserveAspectRatio="meet xMidYMid" @click="id++">
    <rect x="0" y="0" width="7" height="7"/>
    <g transform="translate(1,1)">
      <rect v-for="(pos, index) in matrix" v-if="pos === 1" :key="index" :x="index % 5" :y="~~(index / 5)" width="1" height="1" />
    </g>
  </svg>
  <img alt="bla" title="bla" v-if="this.$refs.svg" width="100" height="100" :src="'data:image/svg+xml;base64,' + btoa(this.$refs.svg.outerHTML)" />
</div>
</template>
<script>
export default {
  name: 'ArucoMarker',
  props: {
    id: {
      default: 1,
      type: Number
    }
  },
  computed: {
    matrix () {
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
      return matrix.reduce((prev, curr) => prev.concat(curr), [])
    }
  },
  methods: {
    btoa (input) {
      return window.btoa(input)
    }
  }
}
</script>
<style scoped>
g rect {
  fill: white;
}
</style>
