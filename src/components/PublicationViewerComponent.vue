<template>
  <div>
    <!-- SKELETON LOADER -->
    <div v-if="loading" class="skeleton-container">
      <div
        :style="`height: 100%; ${pageMargins}`"
        class="flex-grow-1 fondo-nieve d-flex flex-column"
      >
        <div class="text-wrap-container">
          <div class="skeleton-img floating-img"></div>
          <div class="skeleton-text">
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line short"></div>
          </div>
        </div>
      </div>

      <div class="legend-section">
        <v-container class="text-center">
          <div class="skeleton-commitment">
            <div class="skeleton-line"></div>
            <div class="skeleton-line short"></div>
          </div>
        </v-container>
      </div>

      <div class="fondo-nieve flex-grow-1 d-flex flex-column">
        <v-container class="py-8 mt-4 mb-8 position-relative">
          <div class="skeleton-carousel"></div>
        </v-container>
      </div>
    </div>

    <div v-else>
      <!-- SECCIÓN SIAM -->
      <div
        :style="`height: 100%; ${pageMargins}`"
        class="flex-grow-1 fondo-nieve d-flex flex-column"
      >
        <div class="text-wrap-container">
          <img
            :src="processedData.imagen_optimizada"
            class="floating-img"
            draggable="false"
            alt="Imagen de publicación"
          />
          <!-- <div v-html="processedData.cuerpo"></div> -->
          <TraductorHtml
            v-for="(estructura, index) in processedData.cuerpo"
            :key="index"
            :estructura="estructura"
          />
        </div>
      </div>
      <!-- SECCIÓN COMPROMISO -->
      <div
        v-if="processedData.compromiso.children?.length > 0"
        class="legend-section text-h6 text-md-h4 text-lg-h4 text-xl-h4 text-xxl-h3"
      >
        <div class="text-center">
          <TraductorHtml
            v-for="(estructura, index) in processedData.compromiso"
            :key="index"
            :estructura="estructura"
          />
        </div>
      </div>

      <!-- SECCIÓN CAROUSEL -->
      <div class="fondo-nieve flex-grow-1 d-flex flex-column">
        <v-container class="py-8 mt-4 mb-8 position-relative">
          <v-carousel
            :show-arrows="visibleArrows"
            @mouseenter="toggleCarouselArrows"
            @mouseleave="toggleCarouselArrows"
            cycle
            interval="4500"
            hide-delimiter-background
            color="#D9D9D9"
          >
            <v-carousel-item
              v-for="(imagen, index) in processedCarouselImages"
              :key="index"
              :src="imagen"
              cover
            />
          </v-carousel>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePageMargin } from "@/composables/usePageMargin";
import anunciosServices from "@/services/anuncios.services";
import { ref, reactive, computed, watch, onUnmounted } from "vue";
import TraductorHtml from "./utils/contenidoTextual/tipos/TraductorHtml.vue";

const props = defineProps({
  publicationData: {
    type: Object,
    default: () => ({}),
  },
  showCompromiso: {
    type: Boolean,
    default: true,
  },
  showCarousel: {
    type: Boolean,
    default: true,
  },
  carouselInterval: {
    type: [Number, String],
    default: 4500,
  },
  emptyTitle: {
    type: String,
    default: "No hay contenido disponible",
  },

  emptyDescription: {
    type: String,
    default: "No hay contenido para mostrar en este momento.",
  },
  emptyIcon: {
    type: String,
    default: "mdi-newspaper",
  },
  previewMode: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["imageError", "dataProcessed"]);

const pageMargins = usePageMargin();

const visibleArrows = ref(false);
const processedData = reactive({
  cuerpo: "",
  compromiso: "",
  imagen_optimizada: "",
});
const processedCarouselImages = ref([]);

const createdUrls = ref([]);

const hasContent = computed(() => {
  return (
    processedData.cuerpo ||
    processedData.compromiso ||
    processedData.imagen_optimizada
  );
});

const loading = ref(true);

const toggleCarouselArrows = () => {
  visibleArrows.value = !visibleArrows.value;
};

const createImageUrl = async (imagePath) => {
  if (!imagePath) return null;

  if (props.previewMode) {
    return imagePath;
  }

  try {
    const response = await anunciosServices.obtenerAdjunto(imagePath);
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const url = URL.createObjectURL(blob);

    createdUrls.value.push(url);

    return url;
  } catch (error) {
    console.error("Error al cargar imagen:", error);
    return null;
  }
};

const processCarouselImages = async (imagenes) => {
  if (!imagenes?.length) return [];

  try {
    const imagePromises = imagenes.map(async (imagen) => {
      const imagePath =
        imagen.imagen_optimizada || imagen.imagen_original || imagen;
      return await createImageUrl(imagePath);
    });

    const urls = await Promise.all(imagePromises);
    return urls.filter(Boolean);
  } catch (error) {
    console.error("Error al procesar imágenes del carrusel:", error);
    return [];
  }
};

const processPublicationData = async () => {
  loading.value = true;

  try {
    const data = props.publicationData;

    processedData.cuerpo = data.cuerpo || "";
    processedData.compromiso = data.compromiso || "";

    if (data.imagen_optimizada) {
      processedData.imagen_optimizada = await createImageUrl(
        data.imagen_optimizada
      );
    }

    if (props.showCarousel && data.imagenes) {
      processedCarouselImages.value = await processCarouselImages(
        data.imagenes
      );
    }

    emit("dataProcessed", {
      hasContent: hasContent.value,
      processedData: processedData,
      carouselImages: processedCarouselImages.value,
    });
  } catch (error) {
    console.error("Error al procesar datos de publicación:", error);
  } finally {
    loading.value = false;
  }
};

const cleanupUrls = () => {
  createdUrls.value.forEach((url) => {
    try {
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al limpiar URL:", error);
    }
  });
  createdUrls.value = [];
};

const resetProcessedData = () => {
  processedData.cuerpo = "";
  processedData.compromiso = "";
  processedData.imagen_optimizada = "";
  processedCarouselImages.value = [];
  cleanupUrls();
};

watch(
  () => props.publicationData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      processPublicationData();
    } else {
      resetProcessedData();
    }
  },
  { deep: true, immediate: true }
);

onUnmounted(() => {
  cleanupUrls();
});

defineExpose({
  resetProcessedData,
  processPublicationData,
});
</script>

<style scoped>
.legend-section {
  background: #f5f5f5;
  width: 100%;
  height: auto;
  padding: 3rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primario-1);
  font-weight: 800;
  text-align: center;
  line-height: 1.5;
}

.floating-img {
  float: left;
  width: 50%;
  height: 50%;
  object-fit: cover;
  margin-right: 16px;
  clear: both;
  display: block;
}

.text-wrap-container::after {
  content: "";
  display: table;
  clear: both;
}

.empty-state {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Skeleton Styles */
.skeleton-container {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

.skeleton-img {
  background: #e0e0e0;
  border-radius: 8px;
  width: 50%;
  height: 200px;
  margin-right: 16px;
}

.skeleton-text {
  flex: 1;
  padding: 16px 0;
}

.skeleton-line {
  background: #e0e0e0;
  height: 16px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.skeleton-line.short {
  width: 60%;
}

.skeleton-commitment {
  max-width: 600px;
  margin: 0 auto;
}

.skeleton-commitment .skeleton-line {
  height: 24px;
  margin-bottom: 16px;
}

.skeleton-carousel {
  background: #e0e0e0;
  border-radius: 8px;
  height: 300px;
  box-shadow: 0px 4px 4px 0px #00000040;
}

/* Vuetify overrides */
:deep(.v-window) {
  box-shadow: 0px 4px 4px 0px #00000040 !important;
  border-radius: 8px !important;
  position: static;
}

:deep(.v-carousel__controls) {
  bottom: -4% !important;
}
</style>
