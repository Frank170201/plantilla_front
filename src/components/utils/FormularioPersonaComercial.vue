<template>
  <v-sheet class="mt-2">
    <div class="d-flex align-center gap-2 mt-2">
      <v-icon>{{ icono }}</v-icon>
      <span class="text-subtitle-1 font-weight-bold text-uppercase">
        {{ tituloSeccion }}
      </span>
    </div>
    <v-divider class="mb-4" />

    <v-row>
      <v-col cols="12" md="6">
        <v-select
          v-model="form.id_tipo_documento"
          :items="tiposDocumentos"
          item-title="nombre"
          item-value="id"
          label="Tipo de documento"
          variant="outlined"
          clearable
          v-bind="AttributeMapper($v, 'id_tipo_documento')"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-if="mask"
          v-model="form.numero_documento"
          label="Número de documento"
          variant="outlined"
          clearable
          v-mask="mask"
          :disabled="!form.id_tipo_documento"
          v-bind="AttributeMapper($v, 'numero_documento')"
        />
        <v-text-field
          v-else
          v-model="form.numero_documento"
          label="Número de documento"
          variant="outlined"
          clearable
          :disabled="!form.id_tipo_documento"
          v-bind="AttributeMapper($v, 'numero_documento')"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="form.nrc"
          label="NRC"
          variant="outlined"
          v-bind="AttributeMapper($v, 'nrc')"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="form.nombre"
          :label="labelNombre"
          variant="outlined"
          v-bind="AttributeMapper($v, 'nombre')"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="form.nombre_comercial"
          label="Nombre comercial"
          variant="outlined"
          v-bind="AttributeMapper($v, 'nombre_comercial')"
        />
      </v-col>

      <v-col cols="12" md="6">
        <ProgresiveAutocomplete
          v-model="form.id_actividad"
          :vuetify-props="{
            variant: 'outlined',
            clearable: true,
            hideDetails: true,
            placeholder: 'Seleccione una actividad económica',
            label: 'Actividad económica',
            itemTitle: 'nombre',
            itemValue: 'id',
          }"
          :service="listarActividades"
          v-bind="AttributeMapper($v, 'id_actividad')"
        />
      </v-col>

      <v-col cols="12" md="6">
        <ProgresiveAutocomplete
          v-model="form.id_municipio"
          :vuetify-props="{
            variant: 'outlined',
            clearable: true,
            hideDetails: true,
            placeholder: 'Seleccione un municipio',
            label: 'Municipio',
            itemTitle: 'nombre',
            itemValue: 'id',
          }"
          :service="listarMunicipios"
          v-bind="AttributeMapper($v, 'id_municipio')"
        >
          <template #item="{ item, props }">
            <v-list-item v-bind="props">
              <span v-if="item.raw.departamento" class="text-caption">
                Departamento de
                <b>{{ item.raw.departamento.nombre }}</b>
              </span>
            </v-list-item>
          </template>
        </ProgresiveAutocomplete>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="form.direccion"
          label="Dirección"
          variant="outlined"
          v-bind="AttributeMapper($v, 'direccion')"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="form.telefono"
          label="Teléfono"
          variant="outlined"
          v-mask="mascaraTelefono"
          v-bind="AttributeMapper($v, 'telefono')"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="form.correo_electronico"
          label="Correo electrónico"
          variant="outlined"
          v-bind="AttributeMapper($v, 'correo_electronico')"
        />
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import useVuelidate from "@vuelidate/core";
import ProgresiveAutocomplete from "@/components/ProgresiveAutocomplete.vue";
import { AttributeMapper, ValidationBuilder } from "@/utils/VuelidateForm";
import catalogosServices from "@/services/catalogos.services";
import informacionFacturacionServices from "@/services/informacionFacturacion.services";
import departamentosServices from "@/services/departamentos.services";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  tipo: {
    type: String,
    default: "proveedor",
    validator: (value) => ["proveedor", "cliente"].includes(value),
  },
  titulo: {
    type: String,
    default: "",
  },
  icono: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const formVacio = () => ({
  numero_documento: "",
  nrc: "",
  nombre: "",
  nombre_comercial: "",
  id_tipo_documento: null,
  id_municipio: null,
  direccion: "",
  telefono: "",
  correo_electronico: "",
  id_actividad: null,
});

const form = ref({
  ...formVacio(),
  ...props.modelValue,
});

const tiposDocumentos = ref([]);

const tituloSeccion = computed(() => {
  if (props.titulo) return props.titulo;
  return props.tipo === "cliente" ? "Datos del cliente" : "Datos del proveedor";
});

const icono = computed(() => {
  if (props.icono) return props.icono;
  return props.tipo === "cliente" ? "mdi-account-edit" : "mdi-account-tie";
});

const labelNombre = computed(() =>
  props.tipo === "cliente" ? "Nombre o razón social" : "Nombre o Razón social",
);

const tipoDocumento = computed(() =>
  tiposDocumentos.value.find(
    (doc) => doc.id === form.value.id_tipo_documento,
  ),
);

const mask = computed(() => tipoDocumento.value?.formato ?? null);

const mascaraTelefono = computed(() => "####-####");

const rules = computed(() => ({
  numero_documento: new ValidationBuilder().required().construirReglas(),
  nrc: new ValidationBuilder().required().construirReglas(),
  nombre: new ValidationBuilder().required().construirReglas(),
  nombre_comercial: new ValidationBuilder().required().construirReglas(),
  id_tipo_documento: new ValidationBuilder().required().construirReglas(),
  id_municipio: new ValidationBuilder().required().construirReglas(),
  direccion: new ValidationBuilder().required().construirReglas(),
  id_actividad: new ValidationBuilder().required().construirReglas(),
  telefono: new ValidationBuilder()
    .required()
    .regex("El teléfono debe tener un formato válido", /^(2|6|7)\d{3}-\d{4}$/)
    .construirReglas(),
  correo_electronico: new ValidationBuilder()
    .required()
    .email("El correo electrónico no es válido")
    .construirReglas(),
}));

const $v = useVuelidate(rules, form);

watch(() => props.modelValue, (newVal) => {
  if (JSON.stringify(newVal) === JSON.stringify(form.value)) return;

  form.value = {
    ...formVacio(),
    ...newVal,
  };
}, { deep: true });

watch(form, (newVal) => {
  if (JSON.stringify(newVal) === JSON.stringify(props.modelValue)) return;

  emit("update:modelValue", { ...newVal });
}, { deep: true });

watch(() => form.value.id_tipo_documento, (newVal, oldVal) => {
  if (newVal !== oldVal) form.value.numero_documento = "";
});

const listarTiposDocumentos = async () => {
  const { data } = await catalogosServices.fetchTipoDoc();
  tiposDocumentos.value = data;
};

const listarActividades = async (paginacion, termino) => {
  const filtros = {
    ...paginacion,
    ...(termino ? { busqueda: termino } : {}),
    ...(form.value.id_actividad ? { id_actividad: form.value.id_actividad } : {}),
  };

  const response = await informacionFacturacionServices.cargarCatalogoActividades(filtros);

  response.data = response.data.map((actividad) => ({
    ...actividad,
    nombre: `${actividad.codigo} - ${actividad.nombre}`,
  }));

  return response;
};

const listarMunicipios = async (paginacion, termino) => {
  const filtros = {
    ...paginacion,
    ...(termino ? { nombre: termino } : {}),
    ...(form.value.id_municipio ? { id_municipio: form.value.id_municipio } : {}),
  };

  return await departamentosServices.fetchMunicipio(filtros);
};

const validate = async () => {
  const isValid = await $v.value.$validate();
  return isValid;
};

const reset = () => {
  form.value = formVacio();
  $v.value.$reset();
};

const getData = () => ({ ...form.value });

defineExpose({
  validate,
  reset,
  getData,
  v$: $v,
});

onMounted(() => {
  listarTiposDocumentos();
});
</script>
