<template>
  <v-card class="notificaciones-card full-height mt-6" max-width="400" min-width="350">
    <v-card-title style="font-weight: bold;" class="pa-4">Notificaciones</v-card-title>
    <v-divider></v-divider>
    <v-card-text class="custom-scroll">
      <template v-if="notificaciones.length">
        <v-alert 
          v-for="notificacion in notificaciones" 
          :key="notificacion.id"
          style="background-color: white;" 
          border="bottom" 
          elevation="2"
          class="my-4"
          :border-color="notificacion.tipo_notificacion.color" 
          :class="{ 'notificacion-leida': notificacion.leido }" 
        >
          <div class="d-flex flex-wrap align-center" style="gap: 2px;">
            <div class="flex-grow-1">
              <div class="d-flex align-center gap-2">
                <v-btn variant="tonal" icon size="x-small" readonly :color="notificacion.tipo_notificacion.color">
                  <v-icon size="18">
                    {{ notificacion.tipo_notificacion.icono }}
                  </v-icon>
                </v-btn>
                <span class="font-weight-black text-caption d-block">
                  {{ notificacion.tipo_notificacion.nombre }}
                  ({{ dayjs(notificacion.created_at).format('DD/MM/YYYY hh:mm a') }})
                </span>
              </div>
              <v-divider class="my-2" />
              <p class="mb-0">{{ notificacion.mensaje }}</p>
            </div>

            <div v-if="!notificacion.leido" class="w-full d-flex justify-end align-center gap-2 mt-4">
              <AccionNotificacion 
                :notificacion="notificacion"
                @on-cerrar-dialogo-notificaciones="emits('on-cerrar-dialogo-notificaciones')"
              />
            </div>
          </div>
        </v-alert>
      </template>
      <AppEmptyState 
        v-else
        icono="mdi-bell-ring" 
        titulo=""
        descripcion=""
      >
        <template #descripcion>
          <span class="font-weight-medium text-body-1">Actualmente no tiene notificaciones.</span>
        </template>
      </AppEmptyState>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useNotificacionesStore } from '@/store/notificaciones';
import { computed, onMounted } from 'vue';
import AccionNotificacion from './AccionNotificacion.vue';
import AppEmptyState from './AppEmptyState.vue';
import dayjs from "dayjs";

const emits = defineEmits(['on-cerrar-dialogo-notificaciones']);

const notificacionesStore = useNotificacionesStore();
const notificaciones = computed(() => notificacionesStore.notificaciones);

onMounted(async () => {
  notificacionesStore.fetchNotificaciones();
});
</script>
<style scoped>
.notificacion-leida {
  background-color: #e0e0e0 !important; /* Gris oscuro */
  opacity: 0.6;
}

.custom-scroll {
    overflow-y: auto;
}

/* Estilos para la barra de desplazamiento */
.custom-scroll::-webkit-scrollbar {
    width: 10px;
}

.custom-scroll::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.custom-scroll::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>
