<template>
    <v-tooltip location="top center">
        <template v-slot:activator="{ props }">
            <v-btn 
                v-bind="props" 
                variant="tonal" 
                :color="accion.color" 
                size="small" 
                class="text-none"
                @click="accion.click"
            >
                <v-icon 
                    v-if="!notificacion.leido" 
                    :icon="accion.icono" 
                    :color="accion.color" 
                    class="mr-1"
                />
                {{ accion.texto }}
            </v-btn>
        </template>
        <span>{{ accion.descripcion }}</span>
    </v-tooltip>
</template>
<script setup>
import { useNotificacionesStore } from '@/store/notificaciones';
import { EventosObservable } from '@/utils/EventosObservable';
import { Observable } from '@/utils/Observable';
import { computed } from 'vue';

const emits = defineEmits(['on-cerrar-dialogo-notificaciones']);

const { notificacion } = defineProps({
    notificacion: Object,
});

const notificacionesStore = useNotificacionesStore();

const accion = computed(() => {
  const idTipoNotificacion = notificacion.tipo_notificacion.id;

  switch(idTipoNotificacion) {
    case 4: return ({
        icono: 'mdi-cog',
        color: '#FFA500',
        descripcion: 'Actualizar información de facturación',
        texto: 'Actualizar información',
        click: abrirDialogoInformacionFacturacion,
    });
    default: return ({
      icono: 'mdi-check-circle-outline',
      color: 'blue',
      descripcion: 'Marcar como leído',
      texto: 'Marcar como leído',
      click: () => marcarNotificacionComoLeida(notificacion),
    });
  }
});

const abrirDialogoInformacionFacturacion = () => {
  Observable.emit(EventosObservable.ACTUALIZAR_FACTURACION_ELECTRONICA);
  emits('on-cerrar-dialogo-notificaciones');
}

const marcarNotificacionComoLeida = (notificacion) => {
  notificacionesStore.marcarNotificacionesLeidas(notificacion.id);
};
</script>