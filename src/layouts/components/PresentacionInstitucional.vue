<template>
    <div  v-if="loading || (!loading && landings.length > 0)" class="presentacion__institucional flex-column flex-lg-row text-white d-flex" :style="`gap: ${display.lgAndUp.value ? '78px' : '16px'};`">
        <div :style="`${display.lgAndUp.value ? 'flex-basis: 538px;' : ''}`">
            <template v-if="loading">
              <p class="paragraph-carousel"></p>
              <p class="paragraph-carousel mt-4"></p>
              <p class="paragraph-carousel mt-4"></p>
              <p class="paragraph-carousel mt-4"></p>
              <p class="button-carousel mt-12"></p>
            </template>
            <template v-else>
              <div v-if="panelActivo && panelActivo.texto_enriquecido" class="texto-enriquecido d-flex flex-column gap-4">
                <span v-for="(fragmento, index) in panelActivo.texto_enriquecido" :key="index" v-html="fragmento" />
              </div>

              <!-- <v-btn
                  v-if="panelActivo && panelActivo.mostrar_boton_solicitud_registro"
                  class="mt-8"
                  color="primario-2"
                  variant="elevated"
                  size="large"
                  rounded="large"
                  :to="{ name: 'registro-comerciante' }"
              >
                  <span style="font-size: 20px; line-height: 23px; letter-spacing: 1px; text-transform: none;" class="font-weight-bold">
                      Solicitar registro
                  </span>
                  <v-icon class="ml-2" style="transform: translateY(1px); font-size: 24px;">
                      mdi-arrow-right
                  </v-icon>
              </v-btn> -->
            </template>
        </div>
        <div class="flex-grow-1">
            <div v-if="loading" class="skeleton-container">
                <div class="skeleton-carousel"></div>
            </div>

            <div v-else>
                <v-carousel
                  v-if="landings.length > 0"
                  v-model="indexPanelActivo"
                  :show-arrows="visibleArrows"
                  @mouseenter="toggleCarouselArrows"
                  @mouseleave="toggleCarouselArrows"
                  cycle
                  interval="4500"
                  hide-delimiter-background
                  hide-delimiters
                  color="#D9D9D9"
                >
                <v-carousel-item
                  v-for="(imagen, index) in landings"
                  :key="index"
                  :src="imagen.imagen_optimizada"
                  cover
                />
              </v-carousel>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { onMounted, ref } from 'vue';
import anunciosServices from '@/services/anuncios.services';
import { computed } from 'vue';

const landings = ref([]);
const loading = ref(true);
const visibleArrows = ref(false);
const indexPanelActivo = ref(0);

const display = useDisplay();

const cargarLand = async () => {
    try {
        const { data } = await anunciosServices.obtenerLanding();

        const imagePromises = data.map(async (item) => {
            const imageUrl = await createImageUrl(item.optimizada || item.original);
            return {
                ...item,
                texto_enriquecido: item.texto_enriquecido ? JSON.parse(item.texto_enriquecido) : null,
                imagen_optimizada: imageUrl,
            };
        });

        const processedImages = await Promise.all(imagePromises);

        landings.value = processedImages.filter(item => item.imagen_optimizada !== null);

    } catch (error) {
        console.error("Error al cargar landing:", error);
    } finally {
        loading.value = false;
    }
};

const createImageUrl = async (imagePath) => {
  if (!imagePath) return null;

  try {
    const response = await anunciosServices.obtenerAdjunto(imagePath);
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const url = URL.createObjectURL(blob);

    return url;
  } catch (error) {
    console.error("Error al cargar imagen:", error);
    return null;
  }
};

const toggleCarouselArrows = () => {
  visibleArrows.value = !visibleArrows.value;
};

const panelActivo = computed(() => landings.value[indexPanelActivo.value]);

onMounted(() => {
  cargarLand();
});
</script>

<style scoped>
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

.skeleton-carousel {
  background: #e0e0e0;
  border-radius: 8px;
  height: 300px;
  box-shadow: 0px 4px 4px 0px #00000040;
}

.paragraph-carousel {
  background: #e0e0e0;
  border-radius: 8px;
  height: 24px;
  box-shadow: 0px 4px 4px 0px #00000040;
}

.button-carousel {
  background: #e0e0e0;
  border-radius: 8px;
  height: 50px;
  width: 250px;
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

.texto-enriquecido :deep(h1, h2, h3, h4, h5, h6) {
  font-size: 50px;
  line-height: 119%;
  font-weight: bold;
}

.texto-enriquecido :deep(p) {
  text-align: justify;
  font-size: 24px;
  line-height: 30px;
  letter-spacing: -2%;
}
</style>
