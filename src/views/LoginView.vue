<template>
  <v-app class="login-page">
    <v-layout style="width: 100%">
      <v-app-bar class="login-page__header" color="transparent" elevation="0">
        <div ref="app_header" style="width: 100%">
          <HeaderPublico />
        </div>
      </v-app-bar>

      <v-main
        :style="`width: 100%; max-width: 100%; margin-top: ${header_height}px;`"
        class="pt-0 d-flex flex-column"
      >
        <div :style="`${pageMargins};`" class="flex-grow-1">
          <v-row justify="center">
            <v-col cols="12" md="8" xl="6">
              <v-card
                :style="`padding: ${
                  display.mdAndUp.value ? '13.56%' : '32px 16px'
                }; border-style: solid; border-width: 5px;`"
                class="fondo-complementario-5 borde-nieve color-nieve"
                rounded="xl"
              >
                <h2
                  style="font-size: 38px; line-height: 100%"
                  class="text-center text-lg-left"
                >
                  Iniciar sesión
                </h2>

                <v-form @submit.prevent="submit" class="mt-8">
                  <v-text-field
                    v-model="form.email"
                    :error-messages="
                      $vLogin.email.$errors.map((e) => e.$message)
                    "
                    :hide-details="$vLogin.email.$errors.length === 0"
                    @blur="$vLogin.email.$touch()"
                    append-inner-icon="mdi-account"
                    label="Usuario / Correo Electrónico *"
                    variant="filled"
                    rounded="lg"
                    bg-color="nieve"
                  />

                  <v-text-field
                    v-model="form.password"
                    :error-messages="
                      $vLogin.password.$errors.map((e) => e.$message)
                    "
                    :hide-details="$vLogin.password.$errors.length === 0"
                    :type="showPassword ? 'text' : 'password'"
                    :append-inner-icon="
                      showPassword ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    label="Contraseña *"
                    @click:append-inner="showPassword = !showPassword"
                    variant="filled"
                    rounded="lg"
                    :class="`mt-8 ${
                      $vLogin.password.$errors.length > 0 ? 'mb-8' : ''
                    }`"
                    bg-color="nieve"
                  />

                  <!-- <router-link
                    style="font-size: 12px; font-size: 400; line-height: 100%;"
                    class="d-inline-block mt-4 color-nieve text-decoration-none login-page__link"
                    :to="{ name: 'solicitud-restablecimiento-contrasena' }"
                  >
                    ¿Olvidaste tu contraseña?
                  </router-link> -->

                  <v-btn
                    type="submit"
                    color="primario-2"
                    size="large"
                    rounded="lg"
                    class="mt-8 font-weight-bold text-none"
                    style="
                      font-size: 20px;
                      line-height: 100%;
                      letter-spacing: 0%;
                    "
                    block
                  >
                    Iniciar sesión
                  </v-btn>
                  <!--
                  <p class="mt-8 text-center color-nieve" style="font-size: 14px; font-size: 400; line-height: 100%;">
                    ¿No tienes cuenta?
                    <router-link
                      :to="{ name: 'registro-comerciante' }"
                      class="color-nieve ml-2 font-weight-bold text-decoration-none login-page__link"
                    >
                      Registrate aquí
                    </router-link>
                  </p> -->
                </v-form>
              </v-card>
            </v-col>
          </v-row>
        </div>
        <AppFooter class="flex-grow-0" />
      </v-main>
    </v-layout>

    <TwoFactorAuthComponent
      v-model="useAuth.should_confirm_2fa"
      @sendCode="verifyCode"
    />
  </v-app>
</template>
<script setup>
import TwoFactorAuthComponent from "@/components/TwoFactorAuthComponent.vue";
import { useAuthStore } from "@/store/auth";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers, minLength } from "@vuelidate/validators";
import useNoti from "@/composables/useNoti";
import AppFooter from "@/components/AppFooter.vue";
import HeaderPublico from "@/layouts/components/HeaderPublico.vue";
import { usePageMargin } from "@/composables/usePageMargin";
import { useDisplay } from "vuetify/lib/framework.mjs";

const pageMargins = usePageMargin();
const useAuth = useAuthStore();
const display = useDisplay();

const app_header = ref(null);
const header_height = ref(0);
const observer = ref(null);

const form = ref({
  email: "",
  password: "",
});

const showPassword = ref(false);
const { notify } = useNoti();

const aplicacionOrigen = computed(() => {
  const params = new URLSearchParams(window.location.search);
  const origen = params.get('origin_app');

  return origen;
});

const rules = computed(() => {
  return {
    email: {
      minLength: helpers.withMessage("El email es requerido", minLength(4)),
      required: helpers.withMessage(
        "El nombre de usuario es requerido",
        required
      ),
    },
    password: {
      required: helpers.withMessage("La contraseña es requerida", required),
    },
  };
});

const $vLogin = useVuelidate(rules, form);
const submit = async () => {
  $vLogin.value.$validate();
  if ($vLogin.value.$invalid) {
    notify("Hay campos inválidos", "error");
    return;
  }

  await useAuth.login(form.value.email, form.value.password, aplicacionOrigen.value);

  $vLogin.value.$reset();
};

const verifyCode = async (code) => {
  await useAuth.verifyCode(form.value.email, code);

  $vLogin.value.$reset();
};

onMounted(() => {
  observer.value = new ResizeObserver((entries) => {
    Array.from(entries).forEach((entry) => {
      const height = entry.contentRect.height;
      header_height.value = height;
    });
  });

  observer.value.observe(app_header.value);
});

onBeforeUnmount(() => {
  observer.value?.unobserve(app_header.value);
});
</script>
<style scoped>
.login-page {
  background-image: url("../assets/img/background.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
}

.login-page__header :deep(.v-toolbar__content) {
  height: auto !important;
}

.login-page :deep(.v-messages) {
  color: var(--nieve) !important;
}

.login-page__link:active {
  text-decoration: underline !important;
  color: var(--primario-2) !important;
}
</style>
