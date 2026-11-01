<template>
    <template v-if="props.estructura.tipo === 'HTML'">
        <component 
            v-if="props.estructura.variante" 
            :is="props.estructura.variante" 
            v-bind="props.estructura.propiedades"
        >
            <template v-if="props.estructura.variante === 'p' && !props.estructura.children">
                <br>
            </template>
            <template v-else-if="Array.isArray(props.estructura.children)">
                <TraductorHtml 
                    v-for="(sub_estructura, index) in props.estructura.children"  
                    :key="index"
                    :estructura="sub_estructura"
                />
            </template>
            <template v-else>
                <span v-html="props.estructura.children"></span>
            </template>
        </component>
        <template v-else>
            <span v-html="props.estructura.children"></span>
        </template>
    </template>
    <template v-if="props.estructura.tipo === 'TERMINO'">
        <Termino :termino="props.estructura" />
    </template>
</template>

<script setup>
import Termino from './Termino.vue';

const props = defineProps({
  estructura: { type: Object },
});
</script>

<script>
export default {
  name: "TraductorHtml",
};
</script>

<style scoped>
p {
  margin: 16px 0;
  white-space: pre-wrap; /* Respeta los espacios en blanco */
}

span {
  white-space: pre-wrap; /* Permite conservar los espacios en blanco y saltos de línea */
}

ol {
  margin-top: 8px;
  list-style-type: decimal;
  padding-left: 32px;
}

ul {
  margin-top: 8px;
  list-style-type: disc;
  padding-left: 32px;
}
</style>
