<template>
  <h3
    class="color-nieve pl-4"
    :style="`font-size: ${
      display.mdAndUp.value ? '40px' : '32px'
    }; line-height: 100%; letter-spacing: 0%; font-weight: 700; line-height: 100%; word-break: break-word; white-space: normal;`"
  >
    {{ title }}
  </h3>
  <v-card elevation="0" class="pa-4 mt-4 fondo-transparente" rounded="lg">
    <v-row>
      <v-col cols="12" md="6" class="mt-4">
        <v-text-field
          v-model="formData.email"
          prepend-inner-icon="mdi-email-open-outline"
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.email, {
              label: 'Correo electrónico',
              placeholder: 'Correo electrónico',
            })
          "
        />
      </v-col>

      <v-col cols="12" md="6" class="mt-4">
        <v-autocomplete
          v-model="formData.persona.id_tipo_persona"
          :items="tipoPersonas"
          item-title="nombre"
          item-value="id"
          clearable
          @update:modelValue="limpiarValores"
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.persona.id_tipo_persona, {
              label: 'Tipo de persona',
              placeholder: 'Tipo de Persona',
            })
          "
        />
      </v-col>
    </v-row>

    <v-row v-if="formData.persona.id_tipo_persona === 1">
      <v-col cols="12" md="6" class="mt-4">
        <v-text-field
          v-model="formData.persona.primer_nombre"
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.persona.primer_nombre, {
              label: 'Primer Nombre',
              placeholder: 'Primer Nombre',
            })
          "
        />
      </v-col>

      <v-col cols="12" md="6" class="mt-4">
        <v-text-field
          v-model="formData.persona.segundo_nombre"
          v-bind="
            mapearPropiedadesCampoFormulario(null, {
              label: 'Segundo nombre',
              placeholder: 'Segundo nombre',
            })
          "
        />
      </v-col>

      <v-col cols="12" md="6" class="mt-4">
        <v-text-field
          v-model="formData.persona.primer_apellido"
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.persona.primer_apellido, {
              label: 'Primer apellido',
              placeholder: 'Primer apellido',
            })
          "
        />
      </v-col>

      <v-col cols="12" md="6" class="mt-4">
        <v-text-field
          v-model="formData.persona.segundo_apellido"
          v-bind="
            mapearPropiedadesCampoFormulario(null, {
              label: 'Segundo apellido',
              placeholder: 'Segundo apellido',
            })
          "
        />
      </v-col>

      <v-col cols="12" md="4" class="mt-4">
        <v-autocomplete
          v-model="formData.persona.id_genero"
          :items="generos"
          item-title="nombre"
          item-value="id"
          clearable
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.persona.id_genero, {
              label: 'Género',
              placeholder: 'Género',
            })
          "
        />
      </v-col>

      <v-col cols="12" md="4" class="mt-4">
        <v-autocomplete
          v-model="formData.persona.id_distrito"
          :items="distritos"
          item-title="nombre"
          item-value="id"
          clearable
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.persona.id_distrito, {
              label: 'Distrito',
              placeholder: 'Distrito',
            })
          "
        />
      </v-col>
      
      <v-col cols="12" md="4" class="mt-4">
        <v-autocomplete
          v-model="formData.persona.id_municipio"
          :items="municipiosFiltrados"
          item-title="nombre"
          item-value="id"
          readonly
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.persona.id_municipio, {
              label: 'Municipio',
              placeholder: 'Municipio',
            })
          "
        />
      </v-col>

      <v-col cols="12" md="4" class="mt-4">
        <v-autocomplete
          v-model="formData.persona.id_departamento"
          :items="departamentosFiltrados"
          item-title="nombre"
          item-value="id"
          readonly
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.persona.id_departamento, {
              label: 'Departamento',
              placeholder: 'Departamento',
            })
          "
        />
      </v-col>

      <v-col cols="12" md="8" class="mt-4">
        <v-text-field
          v-model="formData.persona.direccion"
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.persona.direccion, {
              label: 'Dirección',
              placeholder: 'Dirección',
            })
          "
        />
      </v-col>

      <v-col cols="12" md="6" class="mt-4">
        <v-date-input
          v-model="formData.persona.fecha_nacimiento"
          prepend-icon=""
          prepend-inner-icon="mdi-calendar"
          :max="fechaMaximaNacimiento"
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.persona.fecha_nacimiento, {
              label: 'Fecha de nacimiento',
              placeholder: 'Fecha de nacimiento',
            })
          "
        />
      </v-col>

      <v-col cols="12" md="6" class="mt-4">
        <v-text-field
          v-model="formData.contacto.telefono"
          placeholder="Teléfono"
          v-mask="mascaraTelefono"
          prepend-inner-icon="mdi-phone"
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.contacto.telefono, {
              label: 'Teléfono',
            })
          "
        />
      </v-col>
    </v-row>

    <v-row v-if="formData.persona.id_tipo_persona === 2">
      <v-col cols="12" md="4" class="mt-4">
        <v-text-field
          v-model="formData.persona.razon_social"
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.persona.razon_social, {
              label: 'Razón Social',
              placeholder: 'Razón Social',
            })
          "
        />
      </v-col>

      <v-col cols="12" md="4" class="mt-4">
        <v-text-field
          v-model="formData.persona.direccion"
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.persona.direccion, {
              label: 'Dirección',
              placeholder: 'Dirección',
            })
          "
        />
      </v-col>

      <v-col cols="12" md="4" class="mt-4">
        <v-text-field
          v-model="formData.contacto.telefono"
          placeholder="Teléfono"
          v-mask="mascaraTelefono"
          prepend-inner-icon="mdi-phone"
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.contacto.telefono, {
              label: 'Teléfono',
            })
          "
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        md="6"
        class="mt-4"
        v-if="[1, 2].includes(formData.persona.id_tipo_persona)"
      >
        <v-autocomplete
          v-model="formData.persona.id_tipo_documento"
          :items="filteredDocs"
          item-title="nombre"
          item-value="id"
          clearable
          @update:model-value="updateDocumentoMask"
          prepend-inner-icon="mdi-view-list-outline"
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.persona.id_tipo_documento, {
              label: 'Tipo de documento',
              placeholder: 'Tipo de documento',
            })
          "
        />
      </v-col>

      <v-col
        cols="12"
        md="6"
        class="mt-4"
        v-if="[1, 2].includes(formData.persona.id_tipo_persona)"
      >
        <v-text-field
          v-if="documentoMask"
          v-model="formData.persona.numero_documento"
          placeholder="Número de documento"
          v-mask="documentoMask"
          :disabled="!formData.persona.id_tipo_documento"
          prepend-inner-icon="mdi-card-account-details-outline"
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.persona.numero_documento, {
              label: 'Número de documento',
            })
          "
        />

        <v-text-field
          v-else
          v-model="formData.persona.numero_documento"
          placeholder="Número de documento"
          :disabled="!formData.persona.id_tipo_documento"
          prepend-inner-icon="mdi-card-account-details-outline"
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.persona.numero_documento, {
              label: 'Número de documento',
            })
          "
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md-offset="6" md="6" class="mt-4">
        <v-text-field
          v-model="formData.comerciante.nombre"
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.comerciante.nombre, {
              label: 'Nombre comercial',
              placeholder: 'Nombre comercial',
            })
          "
        />
      </v-col>

      <v-col cols="12" md="6" class="mt-4">
        <v-autocomplete
          v-model="formData.comerciante.id_clasificacion"
          :items="clasficaciones"
          item-title="nombre"
          item-value="id"
          clearable
          v-bind="
            mapearPropiedadesCampoFormulario(
              $vForm.comerciante.id_clasificacion,
              { label: 'Clasificación', placeholder: 'Clasificación' }
            )
          "
        />
      </v-col>
    </v-row>

    <!-- Sección de Representante Legal para Persona Jurídica -->
    <v-row v-if="formData.persona.id_tipo_persona === 2">
        <v-col cols="12">
          <h3 class="text-h6 mt-8 mb-2 color-nieve">
            <v-icon color="nieve" style="transform: translateY(-2px);">mdi-account-tie</v-icon>
            Datos del representante legal
          </h3>
          <v-divider color="nieve" thickness="thick" />
        </v-col>

      <v-col cols="12" md="6" class="mt-4">
        <v-text-field
          v-model="formData.representante.primer_nombre"
          v-bind="
            mapearPropiedadesCampoFormulario(
              $vForm.representante.primer_nombre,
              { label: 'Primer Nombre', placeholder: 'Primer Nombre' }
            )
          "
        />
      </v-col>

      <v-col cols="12" md="6" class="mt-4">
        <v-text-field
          v-model="formData.representante.segundo_nombre"
          v-bind="
            mapearPropiedadesCampoFormulario(null, {
              label: 'Segundo nombre',
              placeholder: 'Segundo nombre',
            })
          "
        />
      </v-col>

      <v-col cols="12" md="6" class="mt-4">
        <v-text-field
          v-model="formData.representante.primer_apellido"
          v-bind="
            mapearPropiedadesCampoFormulario(
              $vForm.representante.primer_apellido,
              { label: 'Primer apellido', placeholder: 'Primer apellido' }
            )
          "
        />
      </v-col>

      <v-col cols="12" md="6" class="mt-4">
        <v-text-field
          v-model="formData.representante.segundo_apellido"
          v-bind="
            mapearPropiedadesCampoFormulario(null, {
              label: 'Segundo apellido',
              placeholder: 'Segundo apellido',
            })
          "
        />
      </v-col>

      <v-col cols="12" md="4" class="mt-4">
        <v-autocomplete
          v-model="formData.representante.id_genero"
          :items="generos"
          item-title="nombre"
          item-value="id"
          clearable
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.representante.id_genero, {
              label: 'Género',
              placeholder: 'Género',
            })
          "
        />
      </v-col>

      <v-col cols="12" md="4" class="mt-4">
        <v-autocomplete
          v-model="formData.representante.id_distrito"
          :items="distritos"
          item-title="nombre"
          item-value="id"
          clearable
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.representante.id_distrito, {
              label: 'Distrito',
              placeholder: 'Distrito',
            })
          "
        />
      </v-col>
      
      <v-col cols="12" md="4" class="mt-4">
        <v-autocomplete
          v-model="formData.representante.id_municipio"
          :items="municipiosFiltradosRepresentante"
          item-title="nombre"
          item-value="id"
          readonly
          v-bind="
            mapearPropiedadesCampoFormulario(
              $vForm.representante.id_municipio,
              { label: 'Municipio', placeholder: 'Municipio' }
            )
          "
        />
      </v-col>

      <v-col cols="12" md="4" class="mt-4">
        <v-autocomplete
          v-model="formData.representante.id_departamento"
          :items="departamentoFiltradosRepresentante"
          item-title="nombre"
          item-value="id"
          readonly
          v-bind="
            mapearPropiedadesCampoFormulario(
              $vForm.representante.id_departamento,
              { label: 'Departamento', placeholder: 'Departamento' }
            )
          "
        />
      </v-col>  

      <v-col cols="12" md="8" class="mt-4">
        <v-text-field
          v-model="formData.representante.direccion"
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.representante.direccion, {
              label: 'Dirección',
              placeholder: 'Dirección',
            })
          "
        />
      </v-col>

      <v-col cols="12" md="6" class="mt-4">
        <v-text-field
          v-model="formData.representante.email"
          prepend-inner-icon="mdi-email-open-outline"
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.representante.email, {
              label: 'Correo electrónico',
              placeholder: 'Correo electrónico',
            })
          "
        />
      </v-col>

      <v-col cols="12" md="6" class="mt-4">
        <v-text-field
          v-model="formData.representante.telefono"
          :placeholder="mascaraTelefono"
          v-mask="mascaraTelefono"
          prepend-inner-icon="mdi-phone"
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.representante.telefono, {
              label: 'Teléfono',
            })
          "
        />
      </v-col>

      <v-col cols="12" md="6" class="mt-4">
        <v-autocomplete
          v-model="formData.representante.id_tipo_documento"
          :items="filteredDocsRepresentante"
          item-title="nombre"
          item-value="id"
          clearable
          @update:model-value="updateDocumentoMaskRepresentante"
          prepend-inner-icon="mdi-view-list-outline"
          v-bind="
            mapearPropiedadesCampoFormulario(
              $vForm.representante.id_tipo_documento,
              { label: 'Tipo de documento', placeholder: 'Tipo de documento' }
            )
          "
        />
      </v-col>

        <v-col cols="12" md="6" class="mt-4">
          <v-text-field
            v-if="documentoMaskRepresentante"
            v-model="formData.representante.numero_documento"
            placeholder="Número de Documento"
            v-mask="documentoMaskRepresentante"
            prepend-inner-icon="mdi-card-account-details-outline"
            :disabled="!formData.representante.id_tipo_documento"
            v-bind="mapearPropiedadesCampoFormulario($vForm.representante.numero_documento, { label: 'Número de Documento' })"
          />
          <v-text-field
            v-else
            v-model="formData.representante.numero_documento"
            placeholder="Número de Documento"
            prepend-inner-icon="mdi-card-account-details-outline"
            :disabled="!formData.representante.id_tipo_documento"
            v-bind="mapearPropiedadesCampoFormulario($vForm.representante.numero_documento, { label: 'Número de Documento' })"
          />
        </v-col>

      <v-col cols="12" md="6" class="mt-4">
        <v-date-input
          v-model="formData.representante.fecha_nacimiento"
          prepend-icon=""
          prepend-inner-icon="mdi-calendar"
          :max="fechaMaximaNacimiento"
          v-bind="
            mapearPropiedadesCampoFormulario(
              $vForm.representante.fecha_nacimiento,
              { label: 'Fecha de Nacimiento' }
            )
          "
        />
      </v-col>

      <v-col cols="12" md="6" class="mt-4">
        <v-date-input
          v-model="formData.persona.fecha_constitucion_sociedad"
          prepend-icon=""
          prepend-inner-icon="mdi-calendar"
          :max="fechaActual"
          v-bind="
            mapearPropiedadesCampoFormulario(
              $vForm.persona.fecha_constitucion_sociedad,
              {
                label: 'Fecha de constitución de la sociedad',
                placeholder: 'Fecha de constitución de la sociedad',
              }
            )
          "
        />
      </v-col>

      <v-col cols="12" md="6" class="mt-4">
        <v-checkbox
          v-model="formData.persona.es_sas"
          label="Sociedad por Acciones Simplificadas"
          active
          class="font-weight-medium text-justify color-nieve"
          hide-details
          :disabled="enviandoFormulario"
        />
      </v-col>

      <v-col cols="12">
        <h3 class="text-h6 mt-8 mb-2 color-nieve">
          <v-icon color="nieve" style="transform: translateY(-2px)"
            >mdi-account</v-icon
          >
          Datos de contacto
        </h3>
        <v-divider color="nieve" thickness="thick" />
      </v-col>

      <v-col cols="12" md="6" class="mt-4">
        <v-text-field
          v-model="formData.contacto.nombre"
          v-bind="
            mapearPropiedadesCampoFormulario(null, {
              label: 'Nombre',
              placeholder: 'Nombre',
            })
          "
        />
      </v-col>

      <v-col cols="12" md="6" class="mt-4">
        <v-text-field
          v-model="formData.contacto.telefono"
          :placeholder="mascaraTelefono"
          v-mask="mascaraTelefono"
          prepend-inner-icon="mdi-phone"
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.contacto.telefono, {
              label: 'Teléfono',
            })
          "
        />
      </v-col>

      <v-col cols="12" md="6" class="mt-4">
        <v-text-field
          v-model="formData.contacto.correo"
          prepend-inner-icon="mdi-email-open-outline"
          v-bind="
            mapearPropiedadesCampoFormulario($vForm.contacto.correo, {
              label: 'Correo electrónico',
              placeholder: 'Correo electrónico',
            })
          "
        />
      </v-col>

      <v-col cols="12" md="6" class="mt-4">
        <v-text-field
          v-model="formData.contacto.cargo"
          v-bind="
            mapearPropiedadesCampoFormulario(null, {
              label: 'Cargo',
              placeholder: 'Cargo',
            })
          "
        />
      </v-col>
    </v-row>

    <CaptchaGoogleComponent
      class="mt-8"
      @generar-token="cargarCaptcha"
      @token-expirado="formData.captcha = null"
    />

    <div class="d-flex align-center justify-end flex-wrap gap-4 mt-8">
      <v-btn
        @click="cancelarRegistro"
        size="large"
        :disabled="enviandoFormulario"
        rounded="lg"
        color="neutro-4"
        class="flex-grow-1 flex-md-grow-0"
        style="
          font-size: 16px;
          line-height: 23px;
          letter-spacing: -2%;
          font-weight: 700;
          text-transform: none;
        "
      >
        Cancelar
      </v-btn>
      <v-btn
        variant="elevated"
        size="large"
        rounded="lg"
        class="flex-grow-1 flex-md-grow-0"
        color="primario-2"
        style="
          font-size: 16px;
          line-height: 23px;
          letter-spacing: -2%;
          font-weight: 700;
          text-transform: none;
        "
        :loading="enviandoFormulario"
        
        @click="confirmarEnvioFormulario"
      >
        {{ submitButtonText }}
      </v-btn>
    </div>
  </v-card>

  <AppDialogoConfirmComponent
    v-model="dialogoConfirmacion"
    @on-confirm="enviarFormulario"
    title="¿Desea continuar con el registro?"
    descripcion="Al confirmar, se creará el registro dentro del sistema SIAM. Revise su correo eletrónico para los siguientes pasos."
  />
</template>

<script setup>
import AppDialogoConfirmComponent from "@/components/AppDialogoConfirmComponent.vue";
import CaptchaGoogleComponent from "@/components/CaptchaGoogleComponent.vue";
import { email, helpers, maxValue, required } from "@vuelidate/validators";
import { useDisplay } from "vuetify/lib/framework.mjs";
import { VDateInput } from "vuetify/labs/VDateInput";
import { computed, reactive, ref, watch } from "vue";
import useNoti from "@/composables/useNoti";
import useVuelidate from "@vuelidate/core";
import { format, endOfDay, subYears } from "date-fns";

const { notify } = useNoti();

const fechaActual = computed(() => (new Date()));
const fechaMaximaNacimiento = computed(() => endOfDay(subYears(new Date(), 18)));
const dialogoConfirmacion = ref(false);
const display = useDisplay();
const props = defineProps({
  title: {
    type: String,
    default: "Solicitud de Comerciante",
  },
  submitButtonText: {
    type: String,
    default: "Enviar",
  },
  initialData: {
    type: Object,
    default: () => ({
      persona: {},
      comerciante: {},
      representante: {},
      contacto: {},
    }),
  },
  tipoPersonas: {
    type: Array,
    required: true,
  },
  generos: {
    type: Array,
    required: true,
  },
  departamentos: {
    type: Array,
    required: true,
  },
  municipios: {
    type: Array,
    required: true,
  },
  distritos: {
    type: Array,
    required: true,
  },
  tipoDocs: {
    type: Array,
    required: true,
  },
  clasficaciones: {
    type: Array,
    required: true,
  },
  enviandoFormulario: {
    type: Boolean,
  },
});

const emit = defineEmits(["submit", "cancel"]);
const formData = reactive(props.initialData);

const selectedDoc = computed(() =>
  props.tipoDocs.find((doc) => doc.id === formData.persona.id_tipo_documento)
);

const filteredDocs = computed(() =>
  props.tipoDocs.filter((doc) =>
    formData.persona.id_tipo_persona === 2
      ? doc.nombre.toLowerCase() === "nit"
      : true
  )
);

// Nuevo computed para el documento del representante legal (excluyendo NIT)
const filteredDocsRepresentante = computed(() =>
  props.tipoDocs.filter((doc) => doc.nombre.toLowerCase() !== "nit")
);

const selectedDocRepresentante = computed(() =>
  props.tipoDocs.find(
    (doc) => doc.id === formData.representante.id_tipo_documento
  )
);

// Municipios filtrados
const municipiosFiltrados = computed(() =>
  {
    const distrito = props.distritos.find((dr) => dr.id === formData.persona.id_distrito);
    let filteredMunicipio = [];
    if (distrito) {
      filteredMunicipio = props.municipios.filter(
        (municipio) =>
          municipio.id === distrito.id_municipio
      )
    }

    return filteredMunicipio;
  }
);

watch(municipiosFiltrados,
  (newMunicipios) => {
    if (newMunicipios.length === 1) {
      formData.persona.id_municipio = newMunicipios[0].id;
    } else {
      formData.persona.id_municipio = null;
    }
  }
)

// Departamentos filtrados
const departamentosFiltrados = computed(() =>
  {
    const municipio = props.municipios.find((dr) => dr.id === formData.persona.id_municipio);
    let filteredDept = [];
    if (municipio) {
      filteredDept = props.departamentos.filter(
        (departamento) => departamento.id === municipio.id_departamento
      )
    }

    return filteredDept;
  }
);

watch(departamentosFiltrados,
  (newDepto) => {
    if (newDepto.length === 1) {
      formData.persona.id_departamento = newDepto[0].id;
    } else {
      formData.persona.id_departamento = null;
    }
  }
)

// Municipios filtrados para representante
const municipiosFiltradosRepresentante = computed(() =>
  {
    const distrito = props.distritos.find((dr) => dr.id === formData.representante.id_distrito);
    let filteredMunicipio = [];
    if (distrito) {
      filteredMunicipio = props.municipios.filter(
        (municipio) =>
          municipio.id === distrito.id_municipio
      )
    }

    return filteredMunicipio;
  }
);

watch(municipiosFiltradosRepresentante,
  (newMunicipios) => {
    if (newMunicipios.length === 1) {
      formData.representante.id_municipio = newMunicipios[0].id;
    } else { 
      formData.representante.id_municipio = undefined;
    }
  }
)

// Departamento filtrados para representante
const departamentoFiltradosRepresentante = computed(() =>
  {
    const municipio = props.municipios.find((dr) => dr.id === formData.representante.id_municipio);
    let filteredDept = [];
    if (municipio) {
      filteredDept = props.departamentos.filter(
        (departamento) => departamento.id === municipio.id_departamento
      )
    }

    return filteredDept;
  }
);

watch(departamentoFiltradosRepresentante,
  (newDepto) => {
    if (newDepto.length === 1) {
      formData.representante.id_departamento = newDepto[0].id;
    } else {
      formData.representante.id_departamento = undefined;
    }
  }
)

const documentoMask = computed(() => {
  if (!selectedDoc.value || !selectedDoc.value.formato) {
    return "";
  }

  return selectedDoc.value.formato;
});

const documentoMaskRepresentante = computed(() => {
  if (
    !selectedDocRepresentante.value ||
    !selectedDocRepresentante.value.formato
  ) {
    return "";
  }

  return selectedDocRepresentante.value.formato;
});

const mascaraTelefono = computed(() => {
  return "####-####";
});

const updateDocumentoMask = () => {
  formData.persona.numero_documento = "";
};

const updateDocumentoMaskRepresentante = () => {
  formData.representante.numero_documento = "";
};

const limpiarValores = () => {
  formData.persona.numero_documento = null;
  formData.persona.id_tipo_documento = null;
  $vForm.value.$reset();
};

const longitudCorrecta = helpers.withMessage(
  () =>
    `La longitud debe ser de ${selectedDoc?.value?.formato?.length} caracteres`,
  (value) => {
    const tipo = formData.persona.id_tipo_documento;

    if (![1, 2].includes(tipo)) return true;

    if (!value || !selectedDoc?.value?.formato) return false;

    return value.length === selectedDoc.value.formato.length;
  }
);

const logitudDocumentoJuridica = helpers.withMessage(
  () =>
    `La longitud debe ser de ${selectedDocRepresentante?.value?.formato?.length} caracteres`,
  (value) => {
    const tipo = formData.representante.id_tipo_documento;

    if (![1, 2].includes(tipo)) return true;

    if (!value || !selectedDocRepresentante?.value?.formato) return false;

    return value.length === selectedDocRepresentante.value.formato.length;
  }
);

const validacionLongitudTelefono = helpers.withMessage(
  () => `La longitud debe ser de ${mascaraTelefono?.value?.length} caracteres`,
  (value) => {
    if (!value || !mascaraTelefono?.value) return false;
    return value.length === mascaraTelefono.value.length;
  }
);

const validacionTelefono = helpers.withMessage(
  () => "Formato no válido.",
  (value) => {
    if (!value || !mascaraTelefono?.value) return false;
    const regex = /^(2|6|7)\d{3}-\d{4}$/;
    return regex.test(value);
  }
);

const rules = computed(() => ({
  email: {
    required: helpers.withMessage("El correo electrónico es requerido", required),
    email: helpers.withMessage("Debe ser un correo electrónico válido", email),
  },
  persona: {
    id_tipo_persona: {
      required: helpers.withMessage(
        "El tipo de persona es requerido",
        required
      ),
    },
    id_tipo_documento: {
      required: helpers.withMessage(
        "El tipo de documento es requerido",
        required
      ),
    },
    numero_documento: {
      required: helpers.withMessage(
        "El número de documento es requerido",
        required
      ),
      longitudCorrecta,
    },
    direccion: {
      required: helpers.withMessage("La dirección es requerida", required),
    },
    ...(formData.persona.id_tipo_persona === 2 && {
      fecha_constitucion_sociedad: {
        required: helpers.withMessage(
          "La fecha de constitución de sociedad es requerida",
          required
        ),
        maxDate: helpers.withMessage(
          `Seleccione una fecha menor o igual a ${format(fechaActual.value, 'dd/MM/yyyy')}.`, 
          maxValue(fechaActual.value),
        ),
      },
    }),
    ...(formData.persona.id_tipo_persona === 1
      ? {
          id_genero: {
            required: helpers.withMessage("El género es requerido", required),
          },
          id_departamento: {
            required: helpers.withMessage(
              "El departamento es requerido",
              required
            ),
          },
          ...(formData.persona.id_departamento !== 15 && {
            id_municipio: {
              required: helpers.withMessage(
                "El municipio es requerido",
                required
              ),
            },
            id_distrito: {
              required: helpers.withMessage("El distrito es requerido", required),
            },
          }),
          primer_nombre: {
            required: helpers.withMessage("El nombre es requerido", required),
          },
          primer_apellido: {
            required: helpers.withMessage(
              "El primer apellido es requerido",
              required
            ),
          },
          fecha_nacimiento: {
            required: helpers.withMessage(
              "La fecha de  nacimiento es requerida",
              required
            ),
            maxDate: helpers.withMessage(
              `Seleccione una fecha menor o igual a ${format(fechaMaximaNacimiento.value, 'dd/MM/yyyy')}.`, 
              maxValue(fechaMaximaNacimiento.value),
            ),
          },
        }
      : {
          razon_social: {
            required: helpers.withMessage(
              "La razón social es requerida",
              required
            ),
          },
        }),
  },
  comerciante: {
    nombre: {
      required: helpers.withMessage(
        "El nombre comercial es requerido",
        required
      ),
    },
    id_clasificacion: {
      required: helpers.withMessage("La clasificación es requerida", required),
    },
  },
  contacto: {
    telefono: {
      ...(formData.contacto.telefono
        ? {
            validacionLongitudTelefono,
            validacionTelefono,
          }
        : {}),
    },
    correo: {
      email: helpers.withMessage(
        "Debe ser un correo electrónico válido",
        email
      ),
    },
  },
  ...(formData.persona.id_tipo_persona === 2
    ? {
        representante: {
          primer_nombre: {
            required: helpers.withMessage(
              "El primer nombre es requerido",
              required
            ),
          },
          primer_apellido: {
            required: helpers.withMessage(
              "El primer apellido es requerido",
              required
            ),
          },
          direccion: {
            required: helpers.withMessage(
              "La dirección es requerida",
              required
            ),
          },
          telefono: {
            required: helpers.withMessage("El teléfono es requerido", required),
            validacionLongitudTelefono,
            validacionTelefono,
          },
          id_genero: {
            required: helpers.withMessage("El género es requerido", required),
          },
          id_tipo_documento: {
            required: helpers.withMessage(
              "El tipo de documento es requerido",
              required
            ),
          },
          numero_documento: {
            required: helpers.withMessage(
              "El número de documento es requerido",
              required
            ),
            logitudDocumentoJuridica,
          },
          email: {
            required: helpers.withMessage("El email es requerido", required),
            email: helpers.withMessage("Debe ser un email válido", email),
          },
          fecha_nacimiento: {
            required: helpers.withMessage(
              "La fecha de  nacimiento es requerida",
              required
            ),
            maxDate: helpers.withMessage(
              `Seleccione una fecha menor o igual a ${format(fechaMaximaNacimiento.value, 'dd/MM/yyyy')}.`, 
              maxValue(fechaMaximaNacimiento.value),
            ),
          },
          id_departamento: {
            required: helpers.withMessage(
              "El departamento es requerido",
              required
            ),
          },
          ...(formData.representante?.id_departamento !== 15 && {
            id_municipio: {
              required: helpers.withMessage(
                "El municipio es requerido",
                required
              ),
            },
            id_distrito: {
              required: helpers.withMessage("El distrito es requerido", required),
            },
          }),
        },
      }
    : {}),
}));

const $vForm = useVuelidate(rules, formData);

const cancelarRegistro = () => {
  emit("cancel");
  // Reinicia los valores del formulario a los iniciales
  Object.keys(formData).forEach((key) => {
    if (typeof formData[key] === "object" && formData[key] !== null) {
      formData[key] = { ...(props.initialData[key] || {}) };
    } else {
      formData[key] = props.initialData[key] || "";
    }
  });

  // También resetea las validaciones
  $vForm.value.$reset();
};

const confirmarEnvioFormulario = () => {
  $vForm.value.$touch();

  if ($vForm.value.$invalid) return;

  if (!formData.captcha) {
    notify("Debe completar el captcha", "error");
    return;
  }

  dialogoConfirmacion.value = true;
};

const enviarFormulario = () => {
  emit("submit", formData);

  $vForm.value.$reset();
};

const mapearPropiedadesCampoFormulario = (
  campo,
  { placeholder, label },
  eventos = ["onInput", "onBlur"]
) => {
  const configuracionBase = {
    label,
    ...placeholder && ({ placeholder }),
    'bg-color': 'nieve',
    variant: 'outlined',
    rounded: 'lg',
    ...props.enviandoFormulario && ({ disabled: props.enviandoFormulario }),
  }

  if (!campo) return { ...configuracionBase, "hide-details": true };

  const eventosControl = eventos.reduce(
    (prev, evento) => (prev[evento] = campo.$touch),
    {}
  );
  const errores = campo.$errors?.map((e) => e.$message) ?? [];

  return {
    ...configuracionBase,
    ...eventosControl,
    "error-messages": errores,
    "hide-details": errores.length === 0,
  };
};

const cargarCaptcha = (token) => {
  formData.captcha = token;
};

watch(
  () => fechaMaximaNacimiento.value,
  (value) => {
    if (value) {
      formData.persona.fecha_nacimiento = value;
      if (formData.representante) formData.representante.fecha_nacimiento = value;
    } else {
      formData.persona.fecha_nacimiento = null;
      if (formData.representante) formData.representante.fecha_nacimiento = null;
    }
  },
  { immediate: true },
);
</script>
<style scoped>
:deep(.v-messages) {
  color: var(--complementario-1) !important;
}

:deep(.v-field__outline__notch) {
  position: absolute;
  top: 0;
  left: 0;
}

:deep(
    .v-field__outline__notch > .v-label.v-field-label.v-field-label--floating
  ) {
  transform: translateY(-24px);
  color: var(--nieve);
  opacity: 1;
}


/** Bordes de INPUT **/
:deep(.v-field__outline__notch::before),
:deep(.v-field__outline__notch::after) {
  border: none !important;
}

:deep(.v-field__outline) > .v-field__outline__start {
  border-right: none !important;
}

:deep(.v-field__outline) > .v-field__outline__end {
  border-left: none !important;
}

:deep(.v-field__outline) > :is(.v-field__outline__start, .v-field__outline__end) {
  border-width: 3px !important;
}

:deep(.v-input:not(.v-input--error) .v-field__outline) > :is(.v-field__outline__start, .v-field__outline__end) {
  border-color: var(--neutro-5) !important;
}

:deep(.v-input:focus-within .v-field__outline) > :is(.v-field__outline__start, .v-field__outline__end) {
  border-color: var(--primario-2) !important; 
}

/** indicador de error **/
:deep(.v-input.v-input--error) :is(.v-field__outline__start, .v-field__outline__end) {
  border-color: var(--complementario-6) !important;
}

:deep(.v-input.v-input--error) .v-field__prepend-inner > .v-icon,
:deep(.v-input.v-input--error) .v-field__append-inner > .v-icon {
  color: var(--complementario-6) !important;
}

:deep(.v-input.v-input--error) .v-field:not(.v-field--active) .v-label {
  color: var(--complementario-6) !important;
}
</style>