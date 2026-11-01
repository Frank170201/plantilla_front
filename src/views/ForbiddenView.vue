<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <Vue3Lottie
          :animationData="AguacateJSON"
          height="35%"
          width="35%"
          speed="1.2"
        />
        <v-row no-gutter>
          <v-col cols="12" class="text-center pa-0 ma-0">
            <p class="text-h4 text-uppercase font-weight-bold">
              No hemos podido encontrar lo que buscas
            </p>
          </v-col>
          <!-- <v-col cols="12" class="d-flex mt-8 justify-center flex-wrap" style="gap: 16px;">
            <v-btn
              variant="elevated"
              density="compact"
              color="blueDinac"
              class="flex-grow-1 flex-sm-grow-0"
              size="x-large"
              @click="irAlLogin">
              Regresar al login
            </v-btn>
            <v-btn 
              variant="outlined" 
              density="compact" 
              color="blueDinac" 
              class="flex-grow-1 flex-sm-grow-0" 
              size="x-large"
              @click="volver"
            >
              Regresar al {{ tieneSesionActiva ? 'dashboard' : 'inicio' }}
            </v-btn>
          </v-col> -->
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { LocalStorage } from "@/utils/LocalStorage";
import AguacateJSON from "../assets/aguacate.json";
import { useAuthStore } from "@/store/auth";
import { Vue3Lottie } from "vue3-lottie";
import { useRouter } from "vue-router";

const { logout } = useAuthStore();
const router = useRouter();

const tieneSesionActiva = LocalStorage.token;

const irAlLogin = async () => {
  if (tieneSesionActiva) {
    return logout();
  }

  router.push("/login");
};

const volver = () => {
  if (LocalStorage.token) {
    router.push({ name: "dashboard" });
    return;
  }

  router.push({ name: "inicio" });
};
</script>
