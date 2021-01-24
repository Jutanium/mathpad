<template>
  <FunctionInput v-model="latex"></FunctionInput>
  <div class="w-1/3 border-2">
    <Graph :functions="functions"></Graph>
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
    }
  },
  computed: {
    functions () {
      return [
        {
          name: "f",
          variable: "x",
          latex: this.latex
        }
      ]
    }
  }
}
</script>

<style>
</style>
