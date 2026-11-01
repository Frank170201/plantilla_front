<template>
  <div
    class="app__header"
    :class="{ 'con-imagen-fondo': tieneBackgroundImage }"
    :style="pageMargins"
  >
    <div class="w-full d-flex justify-space-between align-center gap-8">
      <Logos
        v-if="display.mdAndUp.value"
        style="flex-basis: 548.52px"
        class="flex-shrink-1"
      />

      <div
        :class="`d-flex align-center flex-grow-1 justify-end ${
          display.width.value >= 1728 ? 'gap-8' : 'gap-1'
        }`"
      >
        <!-- <MenuDesktop
          v-if="display.width.value >= 1728"
          :menu-items="menuItems"
        />


        <MenuMobile v-if="display.width.value < 1728" :menu-items="menuItems" />
        -->
      </div>
    </div>
  </div>
</template>
<script setup>
import { usePageMargin } from "@/composables/usePageMargin";
import { useDisplay } from "vuetify/lib/framework.mjs"
import { onMounted, ref, computed } from "vue";
import MenuDesktop from "./MenuDesktop.vue";
import MenuMobile from "./MenuMobile.vue";
import LoginButton from "./LoginButton.vue";
import Logos from "./Logos.vue";

const { tieneBackgroundImage } = defineProps({
  tieneBackgroundImage: Boolean,
});

const pageMargins = usePageMargin();
const display = useDisplay();

// Estado
const comercios = ref([]);

// Opciones del menú
const menuItems = computed(() => {
  return [
    { title: "Inicio", to: { name: "inicio" } },
    { title: "Conoce más", to: { name: "publicaciones-publicas-comercio" } },
    // { title: "Anuncios", to: { name: "anuncios-publicos-comercio" } },
    {
      title: "Sobre nosotros",
      children: [
        // { title: 'Plan Estratégico Institucional (PEI)', to: 'pei' },
        { title: "Acerca de la institución", to: "about_us_public" },
        { title: "Contáctanos", to: "contacto_public" },
        { title: "Preguntas frecuentes", to: "preguntas_frecuentes_public" },
      ],
    },
  ];
});


onMounted(() => {
});
</script>
<style scoped>
.app__header.con-imagen-fondo {
  /* background-image: url("../../assets/img/background.jpg"); */
  background-color: #003734;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  z-index: 20;
}
</style>
