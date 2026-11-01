<template>
  <v-navigation-drawer
    :model-value="drawer"
    :rail="display.smAndUp.value"
    :rail-width="rail_with"
    :permanent="display.smAndUp.value"
    :temporary="display.smAndDown.value"
    @mouseenter="rail_with = 250"
    @mouseleave="rail_with = 55"
    color="#F5F5F5"
  >
    <v-list color="indigo-darken-4">
      <v-list-item class="d-flex justify-center">
        <h2
          v-if="display.smAndDown.value || rail_with > 100"
          class="text-h6 font-weight-bold text-center"
          style="color: #043432"
        >
          {{ BRAND.name }}
        </h2>
        <img v-else src="/brand/symbol.svg" :alt="BRAND.name" width="32" height="32" />
      </v-list-item>
    </v-list>

    <v-divider color="#C8CBD9"></v-divider>

    <v-list
      v-model:opened="open"
      color="#00D6BD"
      style="margin-top: 15%; padding-left: 5%; padding-right: 5%;"
    >
      <span v-for="(route, i) in menuFiltrado" :key="i">
        <v-tooltip
          v-if="route.childrens && route.childrens.length > 0 && route.childrens.filter(child => child.mostrar).length"
          :text="route.nombre"
          color="primary"
        >
          <template #activator="{ props }">
            <v-list-group v-bind="props" :key="route.id" :value="route.nombre" link color="#00D6BD">
              <template #activator="{ props: activatorProps }">
                <v-list-item
                  v-bind="activatorProps"
                  color="#00D6BD"
                  :prepend-icon="route.icono"
                  :title="route.nombre"
                  :exact="true"
                />
              </template>
              <v-list-item
                v-for="(child, j) in route.childrens.filter(c => existeEnRouter(c.nombre_uri))"
                :key="j"
                :title="child.nombre"
                :prepend-icon="child.icono"
                :to="{ name: child.nombre_uri }"
                :exact="true"
              />
            </v-list-group>
          </template>
        </v-tooltip>
        <v-tooltip v-else :text="route.nombre">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-if="route.mostrar"
              v-bind="props"
              :key="i"
              :prepend-icon="route.icono"
              :title="route.nombre"
              :to="{ name: route.nombre_uri }"
              :exact="true"
            />
          </template>
        </v-tooltip>
      </span>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { BRAND } from "@/config/brand";
import { useDisplay } from "vuetify";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useDashboardStore } from "@/store/dashboard";

const { menu } = useDashboardStore();
const router = useRouter();
const display = useDisplay();
const rail_with = ref(55);

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const open = ref(["Usuario"]);

const drawer = computed(() => {
  if (display.xs.value || display.sm.value) {
    return props.modelValue;
  }
  return true;
});

// Set con todos los names de rutas registradas en Vue Router
const rutasRouter = computed(() => {
  const nombres = router.getRoutes().map((r) => r.name).filter(Boolean);
  return new Set(nombres);
});

const existeEnRouter = (nombreUri) => rutasRouter.value.has(nombreUri);

// Solo renderizamos rutas que tengan vista en el front.
// Una ruta padre se muestra si existe ella misma o si tiene al menos un hijo válido.
const menuFiltrado = computed(() => {
  return menu.filter((route) => {
    const padreValido = existeEnRouter(route.nombre_uri);
    const tieneHijoValido = (route.childrens || []).some((c) => existeEnRouter(c.nombre_uri));
    return padreValido || tieneHijoValido;
  });
});

const closeAll = () => {
  open.value = [];
};

defineExpose({
  closeAll,
});
</script>

<style scoped>
:deep(.v-list-item) {
  font-size: 0.9rem !important;
}

:deep(.v-list-item--active) {
  border-radius: 5% !important;
}

:deep(.v-list-item__prepend) {
  color: #656565 !important;
}

:deep(.v-list-item-title) {
  color: #7E7E7E !important;
}

:deep(.v-list-item--active .v-list-item__prepend) {
  color: #06706B !important;
}

:deep(.v-list-item--active .v-list-item-title) {
  color: #06706B !important;
}

.v-tooltip :deep(.v-overlay__content) {
  background-color: #06706B !important;
  border-radius: 8px !important;
  box-shadow: none !important;
  padding: 8px 12px !important;
  font-weight: 600;
}
</style>
