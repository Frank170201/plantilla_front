<template>
   <v-img :src="src" :max-width="max_width" />
</template>
<script setup>
// import logoBlanco from '@/assets/img/logo-dinac-fondo-blanco.png'
const logoBlanco = '/brand/logo.svg'

defineProps({
  src: {
    default: logoBlanco
  },
  max_width: {
    default: ''
  }
})

</script>
