<template>
  <v-app class="registro-exitoso-page">
    <v-layout style="width: 100%;">
      <v-app-bar 
        class="login-page__header" 
        color="transparent"
        elevation="0"
      >
      <div ref="app_header" style="width: 100%;">
        <HeaderPublico  />
      </div>
      </v-app-bar>

      <v-main 
        :style="`width: 100%; max-width: 100%; margin-top: ${header_height}px;`" 
        class="pt-0 d-flex flex-column"
      >
        <div :style="`${pageMargins};`" class="flex-grow-1 d-flex align-center">
            <v-row justify="center">
                <v-col cols="12" md="8" xl="4">
                    <v-card 
                      :style="`padding: ${display.mdAndUp ? '32px 13.56%' : '32px 16px'}; border-width: 5px; border-style: solid;`" 
                      class="fondo-complementario-5 borde-nieve"
                      rounded="xl"
                    >
                        <h2 style="font-size: 32px; line-height: 100%;" class="text-center color-nieve">¡Registro completado con éxito!</h2>
                        <p class="mt-8 color-nieve" style="font-size: 16px; line-height: 18px;">
                            Hemos enviado un correo de confirmación {{ email ? ` a ${email}.` : '.' }}
                            Por favor, revisa tu bandeja de entrada (y la de spam, por si acaso) para continuar con el acceso al sistema.
                        </p>

                        <v-btn 
                            color="cyan" 
                            class="mt-8 d-block mx-auto color-nieve font-weight-bold"
                            style="text-transform: none; font-size: 14px; line-height: 11px; letter-spacing: 0.5px;"
                            size="large"
                            rounded="lg"
                            @click.stop="volver"
                        >
                            <v-icon class="mr-1" size="20px" style="transform: translateY(1px);">mdi-arrow-left</v-icon>
                            Volver al inicio
                        </v-btn>
                    </v-card>
                </v-col>
            </v-row>
        </div>
        <AppFooter class="flex-grow-0" />
      </v-main>
    </v-layout>
  </v-app>
</template>
<script setup>
import HeaderPublico from '@/layouts/components/HeaderPublico.vue';
import AppFooter from '@/components/AppFooter.vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { usePageMargin } from '@/composables/usePageMargin';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDisplay } from 'vuetify/lib/framework.mjs';

const display = useDisplay();
const route = useRoute();
const router = useRouter();
const pageMargins = usePageMargin();
const app_header = ref(null);
const header_height = ref(0);
const observer = ref(null);

const email = computed(() => {
  return route.query?.email; 
});

const volver = () => router.push("/");

onMounted(() => {
  observer.value = new ResizeObserver((entries) => {
    Array.from(entries).forEach((entry) => {
      const height = entry.contentRect.height
      header_height.value = height
    });
  });

  observer.value.observe(app_header.value)
});

onBeforeUnmount(() => {
 observer.value?.unobserve(app_header.value);
});
</script>
<style scoped>
.registro-exitoso-page {
    background-image: url('../assets/img/background.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 0 0;
}

.registro-exitoso-page  :deep(.v-toolbar__content) {
  height: auto !important;
}

</style>
