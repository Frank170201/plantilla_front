<template>
    <v-dialog v-model="dialog" max-width="600px" persistent>
        <v-card>
            <v-card-title>
                <span class="text-h5">{{ selected?.id ? 'Editar Usuario' : 'Agregar Usuario' }}</span>
            </v-card-title>

            <v-card-text>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field
                            v-model="local.email"
                            label="Correo Electronico *"
                            required
                            variant="outlined"
                            type="email"
                            :error-messages="$vForm.email.$errors.map((e) => e.$message)"
                            @blur="$vForm.email.$touch()"
                            @input="$vForm.email.$touch()"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                            v-model="local.password"
                            :label="`Contraseña ${!selected?.id ? '*' : ''}`"
                            required
                            variant="outlined"
                            type="password"
                            :error-messages="$vForm.password.$errors.map((e) => e.$message)"
                            @blur="$vForm.password.$touch()"
                            @input="$vForm.password.$touch()"
                        ></v-text-field>
                    </v-col>                      
                    <v-col cols="12" :md="user.is_admin ? 6 : 12">
                        <v-autocomplete
                            v-model="local.id_coleccion_permiso"                
                            :items="colecciones"
                            label="Permisos *"
                            item-title="nombre"
                            item-value="id" 
                            item-subtitle="descripcion"         
                            required
                            variant="outlined"
                            clearable
                            chips
                            :error-messages="$vForm.id_coleccion_permiso.$errors.map((e) => e.$message)"
                            @blur="$vForm.id_coleccion_permiso.$touch()"
                            @input="$vForm.id_coleccion_permiso.$touch()"
                        >
                            <template #item="{ props, item }">
                                <v-list-item
                                    v-bind="props"
                                    :title="item.raw.nombre"
                                    :subtitle="item.raw.descripcion"
                                ></v-list-item>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" :md="user.is_admin ? 6 : 12" v-if="user.is_admin">
                        <v-autocomplete
                            multiple
                            v-model="local.id_comercio"                
                            :items="comercios"
                            label="Comercio"
                            item-title="nombre"
                            item-value="id"                 
                            required
                            variant="outlined"
                            clearable
                            chips
                        >
                            <template #item="{ props, item }">
                                <v-list-item
                                    v-bind="props"
                                    :title="item.raw.nombre"
                                ></v-list-item>
                            </template>
                        </v-autocomplete>
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
import { required, helpers, email, minLength } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import useNoti from "@/composables/useNoti";
import useUsuarios from "../../composables/useUsuarios";
import useComercios from "@/views/comercios/composables/useComercios";
import { useAuthStore } from "@/store/auth";
import { onMounted, ref, watch } from "vue";
import { computed } from "vue";

const props = defineProps({
    addEditDialog: Boolean,
    selected: Object,
    colecciones: Array
});

const {
    listarPerfiles,
    guardarUsuario,
    actualizarUsuario,
    transform,
} = useUsuarios();

const {
    comercios,
    listarComercios
} = useComercios();

const {
    user,
} = useAuthStore();

const { notify } = useNoti();

const emit = defineEmits(["update:addEditDialog", "save", "update:selected"]);

const dialog = ref(props.addEditDialog);
const local = ref({ ...props.selected });

watch(() => props.addEditDialog, (newVal) => {
    dialog.value = newVal;
    local.value = transform(props.selected);
});

const rules = computed(() => ({
  email: {
    required: helpers.withMessage("El email es requerido", required),
    email: helpers.withMessage("El email no es válido", email),
  },
  id_coleccion_permiso: {
    required: helpers.withMessage("El Permiso es requerido", required),
  },
  password: {
    ...(!local.value?.id ?  {required: helpers.withMessage("La contraseña es requerida", required)} : {}),
    minLength: helpers.withMessage("La contraseña debe tener al menos 8 caracteres", minLength(8)),
  },
//   ...(user.is_admin ? { id_comercio: {
//     required: helpers.withMessage("El comercio es requerido", required),
//   } } : {})
}));

const $vForm = useVuelidate(rules, local);

const closeDialog = () => {
    emit("update:addEditDialog", false);
    emit("update:selected", null);
    $vForm.value.$reset();
};

const saveLocal = async () => {
    $vForm.value.$touch();
    if ($vForm.value.$invalid) {
        notify("Por favor, complete los campos requeridos", "error");
        return;
    }

    local.value.id ? await actualizarUsuario(local.value.id, local.value) : await guardarUsuario(local.value);
    emit("save", local.value);
    closeDialog();
};

onMounted(() => {
    listarPerfiles();
    if (user.is_admin) {
        listarComercios({ paginacion: false });
    }
})
</script>