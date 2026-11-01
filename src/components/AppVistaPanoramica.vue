<template>
  <div v-show="!is_loading" id="panorama-container" ref="viewer"
       :style=" !is_loading ? `width: 100%; height: 800px;`:''" class="rounded-lg" :key="forceUpdate"></div>
  <div v-show="is_loading">
    <v-alert
      text="Aqui se muestra la imagen 360"
      title="Información"
      type="info"
      variant="tonal"
    />
  </div>

</template>

<script setup>
import {createApp, nextTick, onMounted, ref} from 'vue';
import {Viewer} from '@photo-sphere-viewer/core';
import {VirtualTourPlugin} from '@photo-sphere-viewer/virtual-tour-plugin';
import cargandoImagen from '@/assets/img/cargando.jpg';
import {MarkersPlugin} from '@photo-sphere-viewer/markers-plugin';
// Importar las hojas de estilo necesarias
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';
import '@photo-sphere-viewer/gallery-plugin/index.css';
import '@photo-sphere-viewer/virtual-tour-plugin/index.css';
import foto360Services from "@/services/foto360.services";
import VistaTooltip from "@/components/VistaTooltip.vue";


const viewer = ref(null);
const baseUrl = 'https://photo-sphere-viewer-data.netlify.app/assets/';
const nodos = ref([])
const currentNode = ref(null);
const forceUpdate = ref(0);
const emit = defineEmits(['cargandoImagen', 'cambioNodo']);
const is_loading = ref(true);

const generarUrlImagen = async (id_foto) => {
  try {
    const {data, headers} = await foto360Services.descargarFoto360(id_foto);

    const blob = new Blob([data], {type: headers["content-type"] || 'image/jpeg'});

    return URL.createObjectURL(blob);
  } catch (error) {
    console.error(`Error al descargar la imagen para el nodo ${id_foto}:`, error);
    return null;
  }
};


const buscarNodos = async (id_foto_360) => {
  is_loading.value = true;
  emit("cargandoImagen", true);
  forceUpdate.value++;
  const response = await foto360Services.obtenerFoto(id_foto_360);
  const nodos_foto = await Promise.all(
    response.data.map(async (nodo, index) => {
      if (index === 0) {
        const customMarkers = [];
        nodo.info_local.forEach((info_local) => {
          const tempElement = document.createElement('div');
          const app = createApp(VistaTooltip, {info_local: info_local});
          app.mount(tempElement);
          const tooltipContent = tempElement.innerHTML;
          app.unmount();
          let marcador = {
            id: `tooltip-${info_local.codigo}`,
            image: baseUrl + "pictos/pin-red.png",
            tooltip: {
              content: tooltipContent,
              position: "top",
            },
            size: {width: 32, height: 32},
            anchor: "bottom center",
            gps: [info_local.centroide_x, info_local.centroide_y],
          };
          customMarkers.push(marcador);
        });

        let nuevo_nodo = {
          ...nodo,
          name: nodo.id,
          markers: customMarkers,
          panorama:
            localStorage.getItem(`imagen-${nodo.id}`) ||
            (await generarUrlImagen(nodo.id)),
        };
        const key = `imagen-${nodo.id}`;
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, nuevo_nodo.panorama);
        }
        return nuevo_nodo;
      } else {
        let nuevo_nodo = {
          ...nodo,
          name: nodo.id,
          panorama: cargandoImagen,
        };
        return nuevo_nodo;
      }
    })
  );
  nodos.value = nodos_foto;
  await nextTick();
  emit("cargandoImagen", false);

  is_loading.value = false;
  emit('cambioNodo', response.data[0]);
  renderizarVista(id_foto_360.toString());
  // is_loading.value = false;
};

const renderizarVista = async () => {

  let containers = document.getElementById('panorama-container');
  if (containers) {
    containers = new Viewer({
      container: containers,
      loadingImg: baseUrl + 'loader.gif',
      touchmoveTwoFingers: true,
      mousewheelCtrlKey: true,
      defaultYaw: '130deg',
      navbar: ['zoom', 'move'],
      plugins: [
        MarkersPlugin,
        [VirtualTourPlugin, {
          positionMode: 'gps',
          renderMode: '2d',
          nodes: nodos.value,
        }],
      ],
    });
  }

  const virtualTour = containers.getPlugin(VirtualTourPlugin);

  // Verificar si el método `addEventListener` está disponible
  if (virtualTour && typeof virtualTour.addEventListener === 'function') {
    // Obtener el nodo actual
    currentNode.value = virtualTour.getCurrentNode();

    // Escuchar el evento de cambio de nodo
    virtualTour.addEventListener('node-changed', async ({node, data}) => {
      if (data?.fromNode?.id) {
        buscarNodos(data.fromLink.nodeId);
      }
    });
  } else {
    console.error('El método `addEventListener` no está disponible en el objeto `virtualTour`');
  }
}

const limpiarImagenesLocalStorage = () => {
  const keysToRemove = [];

  // Recorrer todas las llaves del localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    // Verificar si la llave sigue el patrón 'imagen-'
    if (key.startsWith('imagen-')) {
      keysToRemove.push(key);
    }
  }

  // Eliminar las llaves que coinciden con el patrón y liberar los blobs
  keysToRemove.forEach((key) => {
    const blobUrl = localStorage.getItem(key);

    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
    }

    localStorage.removeItem(key);
  });
};



onMounted(() => {
  limpiarImagenesLocalStorage();
});

defineExpose({buscarNodos});
</script>

<style scoped>
</style>
