<template>
   <v-img :src="src" :max-width="max_width" />
</template>
<script setup>
// import logoBlanco from '@/assets/img/logo-dinac-fondo-blanco.png'
import logoBlanco from '@/assets/img/SIAM-LOGO-TRANSPARENTE.svg'

defineProps({
  src: {
    default: logoBlanco
  },
  max_width: {
    default: ''
  }
})

</script>
