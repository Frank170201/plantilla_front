<template>
  <v-tooltip location="top" max-width="600px">
    <template v-slot:activator="{ props: tooltipProps }">
      <dfn 
        v-bind="tooltipProps" 
        class="termino font-weight-medium"
        style="font-style: normal; color: #3d7ec9;"
      >
        {{ props.termino.children }}
      </dfn>
    </template>
    <template v-slot>
      <template v-if="props.termino.estructura_html">
        <TraductorHtml
          v-for="(estructura, index) in props.termino.estructura_html"
          :key="index"
          :estructura="estructura"
        />
      </template>
      <template v-else>{{ props.termino.definicion }}</template>
    </template>
  </v-tooltip>
</template>
<script setup>
import TraductorHtml from './TraductorHtml.vue';

const props = defineProps({
  termino: {
    type: Object,
  },
});
</script>

<script>
export default {
  name: 'TerminoDefinicion'
}
</script>
<style scoped>
  .termino:hover {
    text-decoration: underline;
  }
</style>