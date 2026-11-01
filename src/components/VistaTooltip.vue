<template>
  <div>
    <p>Local: #{{ props.info_local.codigo }}</p>
    <br/>
    <div>
      <p> Servicios Disponibles</p>
      <ul class="pl-6">
        <li v-for="servicio in props.info_local.servicios" :key="servicio.id">
          {{ servicio?.nombre ?? 'Sin nombre' }}
        </li>
      </ul>
    </div>
    <br>
    <p> Clasificación de local </p>
    <p class="pl-2 mt-2" style="font-size: 12px;"> {{ props.info_local.tipo_local }}</p>
    <br>
    <p>Área: {{ props.info_local.ancho * props.info_local.largo }} m2 </p>
    <p>Ancho: {{ props.info_local.ancho  }} m2 </p>
    <p>largo: {{ props.info_local.largo  }} m2 </p>
  </div>
</template>
<script setup>
const props = defineProps({
  info_local: Object,
});
</script>
<style scoped>

.custom-tooltip h2,
.custom-tooltip p {
  margin: 1rem;
  text-align: justify;
}
</style>
