<template>
    <v-dialog :model-value="modelValue" max-width="600px" persistent>
        <v-card>
            <v-card-title>
                <span class="text-h5">{{ selected?.id ? 'Editar Pregunta Frecuente' : 'Agregar Pregunta Frecuente' }}</span>
            </v-card-title>

            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            v-model="selected.pregunta"
                            label="Pregunta *"
                            required
                            variant="outlined"
                            :error-messages="$vForm.pregunta.$errors.map((e) => e.$message)"
                            @blur="$vForm.pregunta.$touch()"
                            @input="$vForm.pregunta.$touch()"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <EditorTextoEnriquecido
                            label="Respuesta *"
                            v-model="selected.respuesta"
                            :error-messages="$vForm.respuesta.$errors.map((e) => e.$message)"
                            @blur="$vForm.respuesta.$touch()"
                            @input="$vForm.respuesta.$touch()"
                        />
                    </v-col>
                    <v-col cols="12">
                        <v-switch :label="`Activo:  ${ selected?.activo ? 'si' : 'no' }`" v-model="selected.activo" inset></v-switch>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-actions>
                <v-spacer />
                <v-btn text @click="closeDialog">Cancelar</v-btn>
                <v-btn variant="tonal" class="bg-blueDinac" @click="saveLocal">Guardar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { computed } from "vue";
import { required, helpers } from "@vuelidate/validators";
/* import useLocales from "../../../composables/useLocales"; */
import useFAQ from "../../composables/useFAQ";
import useVuelidate from "@vuelidate/core";
import useNoti from "@/composables/useNoti";
import EditorTextoEnriquecido from '@/components/utils/EditorTextoEnriquecido.vue';

 const {
    guardarFAQ,
    actualizarFAQ,
    selected,
    transform,
} = useFAQ();

defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
});

const { notify } = useNoti();

const emit = defineEmits(["update:modelValue", "save"]);

const rules = computed(() => ({
  pregunta: {
    required: helpers.withMessage("La pregunta es requerida", required),
  },
  respuesta: {
    required: helpers.withMessage("La respuesta es requerida", required),
  },
}));

const $vForm = useVuelidate(rules, selected);

const closeDialog = () => {
    emit("update:modelValue", false);
    selected.value = transform(null);
    $vForm.value.$reset();
};

const saveLocal = async () => {
    $vForm.value.$touch();
    if ($vForm.value.$invalid) {
        notify("Por favor, complete los campos requeridos", "error");
        return;
    }

    selected.value.id ? await actualizarFAQ(selected.value.id, selected.value) : await guardarFAQ({ ...selected.value });
    emit("save", selected.value);
    closeDialog();
};
</script>
<style scoped>
.custom-tooltip  ::v-deep(.v-overlay__content) {
    background: var(--bg-tooltip, #333);
    color: var(--text-tooltip, #fff);
}
</style>