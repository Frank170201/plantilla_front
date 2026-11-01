<template>
  <div
    :style="`height: 100%; ${pageMargins}`"
    class="flex-grow-1 fondo-nieve d-flex flex-column"
  >
    <v-container class="py-8 mt-4 mb-8 position-relative" fluid>
      <h1
        class="text-h4 text-md-h3 color-primario-1 font-weight-black"
        style="line-height: 119%; margin-bottom: 1%"
      >
        Contáctanos
      </h1>
      <p
        class="text-subtitle-1 text-md-h6 font-weight-medium w-100 w-md-75 w-lg-50"
        style="margin-bottom: 3%"
      >
        Si deseas más información sobre los locales, programar una visita
        guiada, o información de nuestras actividades. Rellena el formulario.
      </p>
      <v-form class="w-100 w-md-75 w-lg-50 ml-0 ml-md-2">
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Nombre"
              variant="outlined"
              v-model="formData.nombre"
              required
              :error-messages="$vForm.nombre.$errors.map((e) => e.$message)"
              @blur="$vForm.nombre.$touch()"
              @input="$vForm.nombre.$touch()"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Correo electrónico"
              type="email"
              variant="outlined"
              v-model="formData.email"
              required
              :error-messages="$vForm.email.$errors.map((e) => e.$message)"
              @blur="$vForm.email.$touch()"
              @input="$vForm.email.$touch()"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Número de teléfono"
              type="tel"
              variant="outlined"
              v-model="formData.telefono"
              required
              :error-messages="$vForm.telefono.$errors.map((e) => e.$message)"
              @blur="$vForm.telefono.$touch()"
              @input="$vForm.telefono.$touch()"
              v-mask="'####-####'"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-autocomplete
              :items="tipoSolicitudes"
              item-title="nombre"
              item-value="id"
              label="Tipo de solicitud"
              placeholder="Elija el tipo de solicitud"
              variant="outlined"
              v-model="formData.id_tipo_solicitud_contacto"
              :error-messages="
                $vForm.id_tipo_solicitud_contacto.$errors.map((e) => e.$message)
              "
              @blur="$vForm.id_tipo_solicitud_contacto.$touch()"
              @input="$vForm.id_tipo_solicitud_contacto.$touch()"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="formData.descripcion"
              label="Descripción"
              variant="outlined"
              rows="4"
            ></v-textarea>
          </v-col>
          <v-col cols="12">
            <CaptchaGoogleComponent
              :key="captchaKey"
              @generar-token="cargarCaptcha"
              @token-expirado="formData.value.captcha = null"
              :style="{
                border: $vForm.captcha.$error
                  ? '1px solid rgb(var(--v-theme-error))'
                  : 'none',
                width: 'fit-content',
                borderRadius: '5px',
              }"
            />
            <div
              class="v-input__details"
              style="color: rgb(var(--v-theme-error))"
              v-if="$vForm.captcha.$error"
            >
              <div class="v-messages__message" role="alert" aria-live="polite">
                {{ $vForm.captcha.required.$message }}
              </div>
            </div>
          </v-col>
        </v-row>

        <v-btn
          color="primario-2"
          class="mt-4"
          elevation="0"
          size="large"
          style="border-radius: 10px; text-transform: none"
          @click="crearSolicitud()"
          >Enviar formulario</v-btn
        >
      </v-form>
    </v-container>
  </div>
</template>
<script setup>
import useNoti from "@/composables/useNoti";
import { usePageMargin } from "@/composables/usePageMargin";
import solicitudcontactoServices from "@/services/solicitudcontacto.services";
import CaptchaGoogleComponent from "@/components/CaptchaGoogleComponent.vue";
import useVuelidate from "@vuelidate/core";
import { email, helpers, required } from "@vuelidate/validators";
import { computed } from "vue";
import { onMounted, ref } from "vue";

const pageMargins = usePageMargin();
const { notify } = useNoti();

const captchaKey = ref(0);
const tipoSolicitudes = ref([]);
const formData = ref({
  nombre: "",
  email: "",
  telefono: "",
  id_tipo_solicitud_contacto: null,
  descripcion: null,
  captcha: null,
});

const cargarCaptcha = (token) => {
  formData.value.captcha = token;
};

const rules = computed(() => ({
  nombre: {
    required: helpers.withMessage("El nombre es requerido", required),
  },
  email: {
    required: helpers.withMessage(
      "El correo electrónico es requerido",
      required
    ),
    email: helpers.withMessage("El correo electrónico debe ser válido", email),
  },
  telefono: {
    required: helpers.withMessage(
      "El número de teléfono es requerido",
      required
    ),
    digits: helpers.withMessage(
      "El número debe ser un número de teléfono válido",
      (value) => /^\d{4}[-]\d{4}$/.test(value)
    ),
  },
  id_tipo_solicitud_contacto: {
    required: helpers.withMessage(
      "El tipo de solicitud es requerido",
      required
    ),
  },
  captcha: {
    required: helpers.withMessage("El captcha es requerido", required),
  },
}));

const $vForm = useVuelidate(rules, formData);

const limpiarFormulario = () => {
  formData.value = {
    nombre: "",
    email: "",
    telefono: "",
    id_tipo_solicitud_contacto: "",
    captcha: null,
  };

  $vForm.value.$reset();

  captchaKey.value++;
};

const obtenerTipos = async () => {
  const { data } = await solicitudcontactoServices.obtenerTipoSolicitud();
  tipoSolicitudes.value = data;
};

const crearSolicitud = async () => {
  $vForm.value.$touch();

  if ($vForm.value.$invalid) return;

  if ($vForm.value.$invalid) {
    notify("Por favor, complete los campos requeridos", "error");
    return;
  }

  const { status } = await solicitudcontactoServices.crearSolicitud(
    formData.value
  );
  if (status === 201) {
    notify("Solicitud enviada correctamente", "success");
  } else {
    notify("Error al enviar la solicitud", "error");
  }
  limpiarFormulario();
};

onMounted(() => {
  obtenerTipos();
});
</script>
