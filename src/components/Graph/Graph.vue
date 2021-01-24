<template>
  <svg class="w-full h-full" :viewBox="viewBox">

    <g ref="x-axis" :style="xAxisStyles"></g>
    <g ref="y-axis" :style="yAxisStyles"></g>
  </svg>
</template>

<script>
import useAxes from "./axes";
import {ref, toRefs, computed, watchEffect, onMounted} from "vue";

const viewWidth = 800;
const viewHeight = 800;
//https://observablehq.com/@d3/margin-convention (we're using percentages of viewBox width/height instead)
const marginPercentages = {
  left: 0.04,
  right: 0.08,
  top: 0.04,
  bottom: 0.04
}
export default {
  props: {
    xRange: {
     type: Array,
     default: () => [0, 100]
    },
    yRange: {
      type: Array,
      default: () => [0, 100]
    },
  },
  setup (props) {
    const viewBox = `0 0 ${viewWidth} ${viewHeight}`
    const { xRange, yRange } = toRefs(props);
    const xAxisEl = ref(null);
    const yAxisEl = ref(null);

    const { xAxisStyles, yAxisStyles } = useAxes(
      {xRange, yRange, xAxisEl, yAxisEl},
      marginPercentages, viewWidth, viewHeight);

    return {
      viewBox,
      xAxisStyles,
      yAxisStyles,
      "x-axis": xAxisEl,
      "y-axis": yAxisEl
    }
  },
}
</script>
