<template>
  <FunctionInput v-model="latex"></FunctionInput>
  {{latex}}
</template>

<script>
import FunctionInput from "./components/FunctionInput.vue";
import "./App.css"
export default {
  components: {FunctionInput},
  data () {
    return {
      latex: "2^{3}"
    }
  }
}
</script>

<style>
</style>
