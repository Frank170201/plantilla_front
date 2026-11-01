<template>
    <v-menu v-model="menuActivo" :close-on-content-click="false" transition="scale-transition">
        <template v-slot:activator="{ props: menuProps }">
            <v-text-field
                v-bind="menuProps"
                :label="label"
                :placeholder="placeholder ?? label"
                :variant="variant"
                :model-value="fechaFormateada"
                :error-messages="erroresFormulario"
                :hide-details="erroresFormulario.length === 0"
                @blur="props.vFormulario?.[props.pregunta?.id]?.$touch()"
                @input="updateValue($event.target.value)"
                readonly
                @click="menuActivo = true"
            />
        </template>
        <v-date-picker
            v-model="fechaSeleccionada"
            @update:modelValue="updateValue"
            hide-header
        />
    </v-menu>
</template>

<script setup>
import dayjs from 'dayjs';
import { computed, ref, watch } from 'vue';

const emit = defineEmits(["update:modelValue", "on-blur"]);

const props = defineProps({
    modelValue: { type: Date, required: false },
    label: { type: String, required: true },
    variant: { type: String, default: 'outlined' },
    required: { type: Boolean, default: false },
    vFormulario: { type: Object },
    pregunta: { type: Object },
    placeholder: { type: String },
});

const menuActivo = ref(false);

const fechaFormateada = computed(() => {
    return props.modelValue ? dayjs(props.modelValue).format("DD/MM/YYYY") : "";
});

const fechaSeleccionada = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
});

const erroresFormulario = computed(() => props.vFormulario?.[props.pregunta?.id]?.$errors?.map((e) => e.$message) || [])

const updateValue = (value) => {
    emit("update:modelValue", value);
    menuActivo.value = false;
};

watch(fechaSeleccionada, () => {
    emit('on-blur');
})
</script>
