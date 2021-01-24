<template>
  <FunctionInput v-model="latex"></FunctionInput>
  <div class="w-1/2 border-2">
    <Graph :x-range="[1,num]"></Graph>
  </div>
</template>

<script>
import FunctionInput from "./components/FunctionInput.vue";
import Graph from "./components/Graph/Graph.vue";
import "./App.css"
export default {
  components: {Graph, FunctionInput},
  data () {
    return {
      latex: "2^{3}",
      num: 100
    }
  }
}
</script>

<style>
</style>
