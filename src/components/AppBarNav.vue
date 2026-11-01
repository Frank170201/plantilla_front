<template>
  <v-app-bar
    app
    dark
    elevation="0"
    class="custom-app-bar"
    ref="app_nav_bar"
  >
    <v-app-bar-title>
      <div class="d-flex align-center">
        <v-btn
          v-if="display.smAndDown.value"
          icon="mdi-menu"
          @click="emit('on-show', true)"
        ></v-btn>
      </div>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <template #append>
      <app-bar-menu-component />
    </template>
  </v-app-bar>
</template>

<script setup>
import AppBarMenuComponent from "@/components/AppBarMenuComponent.vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useDashboardStore } from "@/store/dashboard";
import { useDisplay } from "vuetify";

const emit = defineEmits(["on-show"]);

const { setMenuHeight } = useDashboardStore();
const display = useDisplay();
const app_nav_bar = ref(null);
const observer = ref(null);

onMounted(() => {
  observer.value = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const height = entry.contentRect.height;
      setMenuHeight(height);
    }
  });

  if (app_nav_bar.value?.$el) {
    observer.value.observe(app_nav_bar.value.$el);
  }
});

onBeforeUnmount(() => {
  if (app_nav_bar.value?.$el && observer.value) {
    observer.value.unobserve(app_nav_bar.value.$el);
  }
});
</script>

<style scoped>
.custom-app-bar {
  position: relative;
  padding-left: 5%;
  padding-right: 5% !important;
}

.custom-app-bar::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 95%;
  height: 1px;
  background-color: #C8CBD9;
}
</style>
