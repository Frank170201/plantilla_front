<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import { useAuthStore } from "@/store/auth";
const logoSimple = "/brand/logo.svg";
import LogoComponent from "@/components/LogoComponent.vue";
import router from "@/router";
const useAuth = useAuthStore();

const loading = ref(false);
const message = ref("Validando la cuenta del usuario");
const verify = ref(null);
const route = useRoute();
const { name: breakpoint } = useDisplay();

const checkVerify = async () => {
  try {
    loading.value = true;
    const token = route.query.token;
    await useAuth.validarUsuario(token);
    verify.value = true;
    message.value = "Se ha verificado la cuenta del usuario";
    setTimeout(() => {
      router.push({ name: "login" });
    }, 2000);
  } catch(error) {
    verify.value = false;
    message.value = "No se pudo verificar la cuenta del usuario";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  checkVerify();
});
</script>

<template>
  <v-app>
    <v-main class="about">
      <v-container fluid fill-height>
        <v-row class="text-center">
          <v-col cols="12" class="d-flex justify-center">
            <LogoComponent :src="logoSimple" max_width="600px"/>
          </v-col>
          <v-col cols="12">
            <p
              :class="{
                'text-h6': breakpoint === 'xs' || breakpoint === 'sm',
                'text-h4': breakpoint === 'md',
                'text-h3': ['lg', 'lx', '2xl'].includes(breakpoint),
                'red--text': !verify,
              }"
            >
              {{ message }}
            </p>
            <v-progress-circular
              v-if="loading"
              indeterminate
              color="blueMinsal"
              class="d-flex mx-auto"
            ></v-progress-circular>
            <v-btn
            v-if="!loading"
              color="blueMinsal"
              class="mt-8"
              rounded
              :to="{ name: 'login' }"
              text
              id="botomAction"
              style="text-transform: none"
              large
            >
              Regresar al login
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
