<template>
  <span ref="mathField">

  </span>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import MathQuill from "../mathquill/index.js"
export default {
  props: {
    modelValue: String
  },
  setup (props, { emit, slots }) {
    console.log("setup")
    const mathField = ref(null);
    let editableField;
    onMounted( async () => {
      const MQ = await MathQuill();
      editableField = MQ.MathField(mathField.value, {
        spaceBehavesLikeTab: true,
        handlers: {
          edit: function() {
            emit('update:modelValue', editableField.latex())
          }
        }
      });
      if (props.modelValue) {
        editableField.latex(props.modelValue);
      }
    });
    watch(() => props.modelValue, (value, oldValue) => {
      console.log("watching")
      if (!editableField || value == oldValue) return
      if (editableField.latex() != value) {
        editableField.latex(value)
      }
    });
    return {
      mathField,
    }
  }
}
</script>

<style scoped>

</style>