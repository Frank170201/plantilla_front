<template>
  <AppDialogComponent
    v-model="showDialog"
    title="Configurar Emisión de DTEs"
    icon="mdi-file-document-edit-outline"
    :showSaveButton="step === 2"
    @save="enviarFormulario"
    @update:modelValue="closeDialog"
  >
    <v-stepper
      v-model="step"
      :items="items"
      next-text="Siguiente"
      prev-text="Anterior"
      show-actions
      @update:model-value="validarCambioStep"
    >
      <!-- PASO 1: Información General -->
      <template v-slot:[`item.1`]>
        <h3 class="mb-2">Tipos de DTE a emitir</h3>
        <p class="text-caption text-medium-emphasis mb-4">
          Selecciona los tipos de Documentos Tributarios Electrónicos (DTEs) que
          actualmente emites.
        </p>

        <v-autocomplete
          v-model="form.tiposDte"
          :items="catalogoTipoDTE"
          item-title="nombre"
          item-value="id"
          label="Tipos de Documentos Tributarios"
          variant="outlined"
          multiple
          chips
          clearable
          v-bind="getValidationProps('tiposDte')"
        />

        <v-divider class="my-4" />

        <h3 class="mb-2">Información del Establecimiento</h3>
        <p class="text-caption text-medium-emphasis mb-4">
          Proporcione la información de su establecimiento para completar la
          configuración de emisión de DTEs.
        </p>

        <v-autocomplete
          v-model="form.tipoSucursal"
          :items="catalogoEstablecimientos"
          item-title="nombre"
          item-value="id"
          label="Tipo de establecimiento"
          variant="outlined"
          placeholder="Selecciona el tipo de establecimiento"
          v-bind="getValidationProps('tipoSucursal')"
        />

        <v-text-field
          v-model="form.direccion"
          label="Dirección"
          variant="outlined"
          placeholder="Escribe la dirección del establecimiento"
          v-bind="getValidationProps('direccion')"
        />

        <v-text-field
          v-model="form.codigoMH"
          label="Código del Ministerio de Hacienda"
          variant="outlined"
          placeholder="(ej: M001, S001, etc.)"
          v-bind="getValidationProps('codigoMH')"
        />

        <!-- <v-text-field
          v-model="form.puntosVenta"
          label="Cantidad de Puntos de Venta (opcional)"
          variant="outlined"
          type="number"
          min="1"
        /> -->
      </template>

      <!-- PASO 2: Credenciales de Certificado y API -->
      <template v-slot:[`item.2`]>
        <h3 class="mb-4">Credenciales</h3>
        <p class="text-caption text-medium-emphasis mb-4">
          Configura las credenciales necesarias para la emisión de Documentos
          Tributarios Electrónicos:
        </p>

        <!-- Clave Privada -->
        <v-text-field
          v-model="form.clavePrivada"
          :type="mostrarClavePrivada ? 'text' : 'password'"
          :append-icon="mostrarClavePrivada ? 'mdi-eye-off' : 'mdi-eye'"
          label="Clave Privada"
          variant="outlined"
          placeholder="Ingresa tu clave privada para transmisión"
          class="mb-3"
          @click:append="mostrarClavePrivada = !mostrarClavePrivada"
          v-bind="getValidationProps('clavePrivada')"
        />

        <!-- Certificado (.crt) -->
        <v-file-input
          v-model="form.certificado"
          label="Certificado (.crt)"
          variant="outlined"
          accept=".crt"
          prepend-icon="mdi-certificate"
          :show-size="1000"
          class="mb-3"
          v-bind="getValidationProps('certificado')"
        >
          <template v-slot:selection="{ fileNames }">
            <v-chip
              v-for="fileName in fileNames"
              :key="fileName"
              size="small"
              color="primary"
              class="me-2"
            >
              {{ fileName }}
            </v-chip>
          </template>
        </v-file-input>

        <!-- Clave API -->
        <v-text-field
          v-model="form.apiKey"
          :type="mostrarApiKey ? 'text' : 'password'"
          :append-icon="mostrarApiKey ? 'mdi-eye-off' : 'mdi-eye'"
          label="Clave API"
          variant="outlined"
          placeholder="Ingresa tu clave API para transmisión"
          class="mb-3"
          @click:append="mostrarApiKey = !mostrarApiKey"
          v-bind="getValidationProps('apiKey')"
        />
      </template>
    </v-stepper>
  </AppDialogComponent>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import useCatalogos from "@/composables/useCatalogos";
import AppDialogComponent from "./AppDialogComponent.vue";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import useNoti from "@/composables/useNoti";
import { convertToFormData } from "@/utils/data";
import comerciantesServices from "@/services/comerciantes.services";
import { watch } from "vue";
import informacionFacturacionServices from "@/services/informacionFacturacion.services";

const { notify } = useNoti();

const props = defineProps({
  showDialog: Boolean,
  idComerciante: [String, Number],
});

const emit = defineEmits(["update:modelValue", "on-save", "on-close"]);

const showDialog = computed({
  get: () => props.showDialog,
  set: (value) => emit("update:modelValue", value),
});

const closeDialog = () => {
  resetForm();
  emit("update:modelValue", false);
  emit("on-close");
};

const step = ref(1);

const items = [
  { title: "Información General", value: 1 },
  { title: "Credenciales", value: 2 },
];

const { catalogoTipoDTE, catalogoEstablecimientos, obtenerTipoDTE, obtenerTipoEstablecimiento } = useCatalogos();

const form = ref({
  tipoSucursal: null,
  direccion: null,
  codigoMH: null,
  puntosVenta: null,
  tiposDte: [],
  clavePrivada: null,
  certificado: null,
  apiKey: null,
});

const mostrarApiKey = ref(false);
const mostrarClavePrivada = ref(false);
const existPathCer = ref(false);

// Reglas de validación
const rules = computed(() => ({
  tiposDte: {
    required: helpers.withMessage(
      "Debe seleccionar al menos un tipo de DTE",
      required,
    ),
  },
  tipoSucursal: {
    required: helpers.withMessage(
      "El tipo de establecimiento es requerido",
      required,
    ),
  },
  direccion: {
    required: helpers.withMessage("La dirección es requerida", required),
  },
  codigoMH: {
    required: helpers.withMessage("El código del MH es requerido", required),
  },
  clavePrivada: {
    required: helpers.withMessage("La clave privada es requerida", required),
  },
  certificado: existPathCer.value ? {} : {
    required: helpers.withMessage("El certificado es requerido", required),
  },
  apiKey: {
    required: helpers.withMessage("La clave API es requerida", required),
  },
}));

const $v = useVuelidate(rules, form);

// Obtener props de validación
const getValidationProps = (campo) => {
  const field = $v.value[campo];
  if (!field) return {};

  const errors = field.$errors?.map((e) => e.$message) || [];

  return {
    onBlur: () => field.$touch(),
    "error-messages": errors,
  };
};

// Validar antes de cambiar de paso
const validarCambioStep = async (nuevoStep) => {
  if (nuevoStep > step.value) {
    // Solo validar si avanzamos
    if (step.value === 1) {
      // Validar campos del paso 1
      const camposPaso1 = ["tiposDte", "tipoSucursal", "direccion", "codigoMH"];

      for (const campo of camposPaso1) {
        $v.value[campo].$touch();
      }

      const tieneErroresPaso1 = camposPaso1.some(
        (campo) => $v.value[campo].$error,
      );

      if (tieneErroresPaso1) {
        step.value = 1; // Mantener en paso 1
        return;
      }
    }
  }

  step.value = nuevoStep;
};

// Resetear formulario
const resetForm = () => {
  form.value = {
    tipoSucursal: null,
    direccion: null,
    codigoMH: null,
    puntosVenta: null,
    tiposDte: [],
    clavePrivada: null,
    certificado: null,
    apiKey: null,
  };

  mostrarApiKey.value = false;
  mostrarClavePrivada.value = false;
  step.value = 1;
  $v.value.$reset();
};

const cargarConfiguracion = async () => {
  const { data, status } = await informacionFacturacionServices.obtenerConfigEmision({
    id_comerciante: props.idComerciante,
  });

  if (status !== 200 || !data) return;

  const credencial = data.credenciales?.[0];
  const establecimiento = data.establecimientos?.[0];

  form.value = {
    tipoSucursal: establecimiento?.id_tipo_establecimiento ?? null,
    direccion: establecimiento?.direccion ?? null,
    codigoMH: establecimiento?.codigo ?? null,

    tiposDte: [
      ...new Set(data.CmConfigTipoDTEContribuyentes.map((d) => d.id_tipo_dte)),
    ],

    clavePrivada: credencial?.clave_privada ?? null,
    apiKey: credencial?.clave_api ?? null,
  };

  existPathCer.value = !!credencial?.path_cer;
};

// Registrar cuenta con validación completa
const enviarFormulario = async () => {
  // Validar todos los campos
  $v.value.$touch();

  if ($v.value.$error) {
    // Determinar qué paso tiene errores y volver a él
    const step1 = ["tiposDte", "tipoSucursal", "direccion", "codigoMH"];
    const step2 = ["clavePrivada", "certificado", "apiKey"];

    const tieneErroresPaso1 = step1.some(
      (campo) => $v.value[campo].$error,
    );

    const tieneErroresPaso2 = step2.some(
      (campo) => $v.value[campo].$error,
    );

    if (tieneErroresPaso1) {
      step.value = 1;
      notify("Hay campos inválidos", "error");
    } else if (tieneErroresPaso2) {
      step.value = 2;
      notify("Hay campos inválidos", "error");
    }

    return;
  }

  try {
    const formData = convertToFormData({
      idComerciante: props.idComerciante,
      ...form.value,
    });
    
    await comerciantesServices.configurarEmisionDTE(formData);

    closeDialog();
    emit("on-save");
  } catch (error) {
    notify("Error al registrar la cuenta", "error");
  }
};

watch(() => props.idComerciante, () => cargarConfiguracion(),
  { immediate: true }
);

onMounted(async () => {
  await obtenerTipoDTE();
  await obtenerTipoEstablecimiento();
});
</script>
