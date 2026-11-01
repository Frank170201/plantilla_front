<template>
  <v-menu transition="slide-y-transition" @update:modelValue="manejarCambioVisibilidad">
    <template v-slot:activator="{ props: propiedades }">
      <v-btn :color="props.color" v-bind="propiedades" class="btn-acciones">
        <v-icon :icon="props?.icono" class="mr-1" /> {{ props.titulo }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(btn, index) in props.items_btn" :key="index">
        <v-list-item-title>
          <v-btn
            variant="text"
            class="mr-1 w-100"
            @click="btn.callback ? ejecutarCallBack(btn.callback) : null"
            :disabled="btn?.disabled"
          >
            <v-icon
              :icon="btn.icono.icon"
              :class="btn.icono.class"
              :size="btn.icono.size"
            />
            {{ btn.boton.texto }}
          </v-btn>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
const emits = defineEmits(['on-menu-show']);

const props = defineProps({
  items_btn: {
    type: Array,
    required: true,
    default: () => [],
  },
  item: {
    type: Object,
    required: false,
    default: () => {},
  },
  icono: {
    type: String,
    required: false,
    default: "mdi-dots-vertical",
  },
  titulo: {
    type: String,
    required: false,
    default: "Seleccionar acción",
  },
  color: {
    type: String,
    required: false,
    default: "blueDinac",
  },
});

const ejecutarCallBack = (callback) => {
  callback(props.item);
};

const manejarCambioVisibilidad = (visible) => {
  if (visible) {
    emits('on-menu-show');
  }
}
</script>
<style scoped>
.btn-acciones {
  border-radius: 8px;
  font-weight: 700;
  font-family: Inter;
  text-transform: none;
}
</style>
