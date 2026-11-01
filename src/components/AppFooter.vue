<template>
  <v-footer
    v-if="mostrarFooter"
    class="app-footer"
    color="neutro-1"
    :app="false"
    :style="margenesFooter"
  >
    <div style="width: 100%">
      <v-row style="width: 100%" class="color-primario-1">
        <v-col
          cols="12"
          lg="3"
          xl="2"
          class="text-left text-md-center text-lg-left mb-md-4 mb-lg-0"
        >
          <AppBrand compact />
        </v-col>

        <v-col cols="12" md="4" lg="3" xl="2" class="mt-4 mt-md-0">
          <ul
            style="list-style: none"
            class="d-flex flex-column gap-2 text-left"
          >
            <li :style="`font-size: ${fontSize}; line-height: 100%;`">
              <router-link
                to="/"
                style="color: inherit"
                class="font-weight-bold d-block text-decoration-none"
              >
                Inicio
              </router-link>
            </li>
            <li
              class="mt-3"
              :style="`font-size: ${fontSize}; line-height: 100%;`"
            >
              <router-link
                to="/comercio/publicaciones"
                style="color: inherit"
                class="d-block text-decoration-none"
              >
                Anuncios
              </router-link>
            </li>
          </ul>
        </v-col>


        <v-col cols="12" md="4" lg="3" xl="2" class="mt-4 mt-md-0">
          <ul
            style="list-style: none"
            class="d-flex flex-column gap-2 text-left"
          >
            <li
              class="font-weight-bold"
              :style="`font-size: ${fontSize}; line-height: 100%;`"
            >
              Conoce más
            </li>

            <!-- <li class="mt-3" :style="`font-size: ${fontSize}; line-height: 100%;`">
                <router-link to="/pei" style="color: inherit;" class="d-block text-decoration-none">
                  Plan Estratégico Institucional (PEI)
                </router-link>
              </li> -->

            <li
              class="mt-3"
              :style="`font-size: ${fontSize}; line-height: 100%;`"
            >
              <router-link
                to="/sobre-nosotros"
                style="color: inherit"
                class="d-block text-decoration-none"
              >
                Acerca de la institución
              </router-link>
            </li>

            <li
              class="mt-3"
              :style="`font-size: ${fontSize}; line-height: 100%;`"
            >
              <router-link
                to="/contacto"
                style="color: inherit"
                class="d-block text-decoration-none"
              >
                Contacto
              </router-link>
            </li>

            <li
              class="mt-3"
              :style="`font-size: ${fontSize}; line-height: 100%;`"
            >
              <router-link
                to="/preguntas-frecuentes"
                style="color: inherit"
                class="d-block text-decoration-none"
              >
                Preguntas frecuentes
              </router-link>
            </li>
          </ul>
        </v-col>
      </v-row>
      <div class="my-8 fondo-nieve" style="height: 2px" />
      <v-row>
        <v-col cols="12" md="4" class="d-flex flex-column gap-4">
          <!-- Teléfono -->
          <div class="d-flex align-center">
            <v-icon size="24" color="black" class="mr-3"
              >mdi-phone-outline</v-icon
            >
            <a
              href="tel:+50322222222"
              class="text-black text-body-1"
              style="text-decoration: none"
            >
              2233-6000
            </a>
          </div>

          <!-- Correo -->
          <div class="d-flex align-center">
            <v-icon size="24" color="black" class="mr-3">
              mdi-email-outline
            </v-icon>
            <a
              href="mailto:consultas@mercadosnacionales.gob.sv"
              class="text-black text-body-1"
              style="text-decoration: none"
            >
              consultas@mercadosnacionales.gob.sv
            </a>
          </div>
        </v-col>
        <v-col cols="12" md="4" class="text-center">
          <span style="font-size: 16px; line-height: 20px">
            ©2025 DIRECCIÓN DE MERCADOS NACIONALES
          </span>
        </v-col>
        <!-- <v-col cols="12">
          <div class="d-flex align-center justify-center gap-4 mt-4">
            <v-btn icon variant="text">
              <v-icon color="primario-1">mdi-facebook</v-icon>
            </v-btn>
            <v-btn icon variant="text">
              <v-img
                src="@/assets/img/icons8-x-50.svg"
                alt="Cerrar"
                width="28"
                height="28"
                class="rounded"
                cover
              />
            </v-btn>
            <v-btn icon variant="text">
              <v-icon color="primario-1">mdi-instagram</v-icon>
            </v-btn>
            <v-btn icon variant="text">
              <v-icon color="primario-1">mdi-linkedin</v-icon>
            </v-btn>
          </div>
        </v-col> -->
      </v-row>
    </div>
  </v-footer>
</template>
<script setup>
import { computed } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";
import { useRoute } from "vue-router";
import AppBrand from "./AppBrand.vue";

const display = useDisplay();
const route = useRoute();

const mostrarFooter = computed(() => !route.query.origin_app);

const margenesFooter = computed(() => {
  if (display.mdAndDown.value) {
    return "padding: 16px;";
  }

  return "padding: 37.5px 7.87%;";
});

const fontSize = computed(() => {
  if (display.width.value > 2000) {
    return "18px;";
  }

  return "15px;";
});
</script>
<style scoped>
.app-footer {
  z-index: 20;
}
</style>
