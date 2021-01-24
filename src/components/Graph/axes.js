import {computed, onMounted, watchEffect} from "vue";
import * as d3 from "d3";

export default function useAxes({xRange, yRange, xAxisEl, yAxisEl}, marginPercentages, viewWidth, viewHeight) {
  const margin = {
    left: marginPercentages.left * viewWidth,
    right: marginPercentages.right * viewWidth,
    top: marginPercentages.top * viewHeight,
    bottom: marginPercentages.bottom * viewHeight
  }

  const xScale = computed(() =>
    d3.scaleLinear()
      .domain(xRange.value)
      .range([margin.left, viewWidth - margin.right])
  );
  const yScale = computed(() =>
    d3.scaleLinear()
      .domain(yRange.value)
      .range([viewHeight - margin.bottom, margin.top])
  )
  const xAxis = computed(() => {
    return d3.axisBottom(xScale.value);
  })
  const yAxis = computed(() => {
    return d3.axisLeft(yScale.value);
  })
  const xAxisStyles = {
    transform: `translateY(${100 * (1 - marginPercentages.bottom)}%)`
  }
  const yAxisStyles = {
    transform: `translateX(${marginPercentages.left * 100}%)`,
  }
  onMounted(() => {
    watchEffect(() => {
      xAxis.value(d3.select(xAxisEl.value));
      yAxis.value(d3.select(yAxisEl.value));
    })
  })

  return { xScale, yScale, xAxisStyles, yAxisStyles };
}