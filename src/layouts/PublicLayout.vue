<template>
  <v-container
    class="landing-page"
    style="
      margin: 0 !important;
      padding: 0 !important;
      max-width: unset !important;
      height: 100vh;
    "
  >
    <v-layout style="width: 100%; height: 100%">
      <v-app-bar
        class="landing-page__header"
        color="transparent"
        elevation="0"
        v-if="route.name === 'estadisticas_public'"
      >
        <div ref="app_header" style="width: 100%">
          <HeaderPublico tiene-background-image />
        </div>
      </v-app-bar>

      <v-main
        :style="`width: 100%; max-width: 100%; margin-top: ${header_height}px; z-index: 20`"
        class="pt-0 flex-grow-1 d-flex flex-column"
      >
        <div class="flex-grow-1">
          <router-view />
        </div>
        <!-- <AppFooter class="flex-grow-0" /> -->
      </v-main>
    </v-layout>
  </v-container>
</template>
<script setup>
import HeaderPublico from "./components/HeaderPublico.vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import AppFooter from "@/components/AppFooter.vue";
import { useRoute } from "vue-router";

const app_header = ref(null);
const header_height = ref(0);
const observer = ref(null);
const route = useRoute();

onMounted(() => {
  observer.value = new ResizeObserver((entries) => {
    Array.from(entries).forEach((entry) => {
      const height = entry.contentRect.height;
      header_height.value = height;
    });
  });

  observer.value.observe(app_header.value);
});

onBeforeUnmount(() => {
  observer.value?.unobserve(app_header.value);
});
</script>
<style scoped>
.landing-page {
  position: relative;
}

.landing-page::after {
  content: "";
  position: fixed;
  z-index: 10;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  /* background-image: url('../assets/img/background.jpg'); */
  /* background-color: #003734;*/
  background-repeat: repeat;
  background-size: 100%;
  background-position: 0 0;
}

.landing-page__header :deep(.v-toolbar__content) {
  height: auto !important;
}
</style>
