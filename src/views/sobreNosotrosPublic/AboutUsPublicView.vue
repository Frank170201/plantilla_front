<template>
  <div :style="pageMargins" style="background-color: #fbfbfb">
    <AppEmptyState
      v-if="!publicationData"
      titulo="No hay publicaciones disponibles"
      descripcion="No hay contenido disponible para mostrar. Intenta nuevamente más tarde."
      icono="mdi-newspaper"
      class="mt-4"
      borde
    />
    <PublicationViewer
      v-else
      :publication-data="publicationData"
      @image-error="handleImageError"
      @data-processed="handleDataProcessed"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { usePageMargin } from "@/composables/usePageMargin";
import publicacionesServices from "@/services/publicaciones.services";
import PublicationViewer from "@/components/PublicationViewerComponent.vue";
import AppEmptyState from "@/components/AppEmptyState.vue";

const publicationData = ref(null);

const pageMargins = usePageMargin();

const loadPublication = async () => {
  try {
    const { data } = await publicacionesServices.cargarPublicacion();
    publicationData.value = data;
  } catch (error) {
    console.error("Error al cargar publicación:", error);
  }
};

const handleImageError = (event) => {
  console.error("Error en imagen:", event);
};

const handleDataProcessed = (data) => {
  console.log("Datos procesados:", data);
};

onMounted(() => {
  loadPublication();
});
</script>
