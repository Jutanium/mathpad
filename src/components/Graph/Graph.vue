<template>
  <svg class="w-full h-full" :viewBox="viewBox">

    <path v-for="path in paths" :d="path">

    </path>
    <g ref="x-axis" :style="xAxisStyles"></g>
    <g ref="y-axis" :style="yAxisStyles"></g>
  </svg>
</template>

<script>
import useAxes from "./axes";
import {ref, toRefs, computed, watchEffect, onMounted, unref} from "vue";
import {parse, texToMath, wrapVariables} from "../../latex-util";
import {evaluate} from "mathjs"
import * as d3 from "d3"

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
    functions: {
      type: Array,
      default: () => [
        {
          name: 'f',
          variable: 'x',
          latex: 'x^{2} + 3'
        }
      ]
    },
    numPoints: {
      type: Number,
      default: 100
    }
  },
  setup (props) {
    const viewBox = `0 0 ${viewWidth} ${viewHeight}`
    const { xRange, yRange, functions, numPoints } = toRefs(props);
    const xAxisEl = ref(null);
    const yAxisEl = ref(null);

    const { xScale, yScale, xAxisStyles, yAxisStyles } = useAxes(
      {xRange, yRange, xAxisEl, yAxisEl},
      marginPercentages, viewWidth, viewHeight);

    const line = computed( () => (
      d3.line()
        .defined(d => !isNaN(d.output))
        .x(d => xScale.value(d.input))
        .y(d => yScale.value(d.output))
    ))

    const paths = computed(() => {
      const v_xRange = unref(xRange);
      return functions.value.map( ({name, variable, latex}) => {
        const wrapped = wrapVariables(variable, latex);
        const data = Array.from({length: numPoints.value }, (val, i) => {
          const range = v_xRange[1] - v_xRange[0];
          const input = v_xRange[0] + (range / numPoints.value) * i;
          const replaceVariable = parse(wrapped, {[variable]: input}, 4);
          const output = evaluate(texToMath(replaceVariable));
          return {input, output}
        })
        return line.value(data);
      })

    })
    return {
      paths,
      viewBox,
      xAxisStyles,
      yAxisStyles,
      "x-axis": xAxisEl,
      "y-axis": yAxisEl
    }
  },
}
</script>
<style>
  path {
    fill: none;
    stroke: steelblue;
    stroke-width: 1.5
  }
</style>
