<template>
    <div :style="`height: 100%; ${pageMargins}`" class="flex-grow-1 fondo-nieve d-flex flex-column">
        <v-container class="py-8 mt-4 mb-8 position-relative" fluid>
            <h1 class="text-h3 color-primario-1 font-weight-black" style="line-height: 119%; margin-bottom: 2%;">Preguntas Frecuentes</h1>
            <v-expansion-panels multiple>
                <v-expansion-panel v-for="(faq, index) in faqs" :key="index" class="mt-8 pa-3" expand-icon="mdi-arrow-down-circle-outline" collapse-icon="mdi-arrow-up-circle-outline">
                    <v-expansion-panel-title class="font-weight-bold text-h5" style="color: #9CA4AE;">
                        {{ faq.pregunta }}
                    </v-expansion-panel-title>
                    <v-expansion-panel-text style="color: #191B1C;">
                        <TraductorHtml
                            v-for="(estructura, index) in faq.respuesta"
                            :key="index"
                            :estructura="estructura"
                        />
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-container>
    </div>
</template>
<script setup>
import { usePageMargin } from '@/composables/usePageMargin';
import { onMounted, ref } from 'vue';
import faqServices from '@/services/faq.services';
import TraductorHtml from "@/components/utils/contenidoTextual/tipos/TraductorHtml.vue";

const pageMargins = usePageMargin();

const faqs = ref([]);

const listarFAQ = async () => {
    const { data } = await faqServices.listarFAQPublicas({ onlyActivos: true });
    faqs.value = data;
}

onMounted(() => {
    listarFAQ();
});
</script>
<style scoped>
:deep(.v-expansion-panel) {
    background: #F5F5F5;
    position: relative;
}

:deep(.v-expansion-panel-title__icon) {
    transition: all 0.3s ease;
}

:deep(.v-expansion-panel-title--active .v-expansion-panel-title__icon) {
    position: absolute;
    right: 1rem;
    top: 50%;
}

</style>