<!-- eslint-disable vue/no-mutating-props -->
<template>
    <div v-if="props.elementoFormulario.es_seccion" class="d-flex flex-column" style="width: 100%">
        <h6 class="text-h6 font-weight-bold text-uppercase">{{ props.elementoFormulario.nombre }}</h6>
        <v-divider class="mt-2 mb-4" />
        <JerarquiaFormulario 
            v-for="pregunta in props.elementoFormulario.preguntas" 
            :key="pregunta.id" 
            :elemento-formulario="pregunta" 
            :state="props.state"
        />
    </div>
    <div v-else style="width: 100%">
        <component 
            :is="resolverComponente(elementoFormulario.tipo?.nombre)"
            v-bind="mapearPropiedades(elementoFormulario)"
            v-model="props.state[elementoFormulario.id]"
        />
    </div>
</template>
<script setup>
import DatePickerFormulario from '@/components/form/DatePickerFormulario.vue';
import { VTextarea, VTextField } from 'vuetify/lib/components/index.mjs';

const props = defineProps({
    elementoFormulario: { type: Object },
    state: { type: Object },
});

const resolverComponente = (type = 'input') => {
    switch(type) {
        case 'input':
            return VTextField; 
        case 'textarea':
            return VTextarea;
        case 'datepicker':
            return DatePickerFormulario;
    }
};

const mapearPropiedades = (pregunta) => {
  const props = {
    label: pregunta.label,
    variant: 'outlined',
    required: pregunta.campo_requerido,
    ...pregunta.cofiguracion_extra
  };

  return props;
}
</script>