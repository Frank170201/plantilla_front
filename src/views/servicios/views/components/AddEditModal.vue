<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{
          selected?.id ? "Editar Servicio" : "Agregar Servicio"
        }}</span>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="local.nombre"
              label="Nombre *"
              required
              variant="outlined"
              :error-messages="$vForm.nombre.$errors.map((e) => e.$message)"
              @blur="$vForm.nombre.$touch()"
              @input="$vForm.nombre.$touch()"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <!--<v-select
                            v-model="local.icono"
                            :items="iconsUsed"
                            label="Icono *"
                            item-title="titulo"
                            item-value="icon"
                            required
                            variant="outlined"
                            clearable
                            :error-messages="$vForm.icono.$errors.map((e) => e.$message)"
                            @blur="$vForm.icono.$touch()"
                            @input="$vForm.icono.$touch()"
                        >
                            <template #item="{ props, item }">
                                <v-list-item v-bind="props">
                                    <template v-slot:prepend>
                                      <v-icon>{{ item.raw.icon }}</v-icon>
                                    </template>
                                </v-list-item>
                            </template>

                            <template v-slot:selection="{ item }">
                                <v-icon class="mr-2">{{ item.raw.icon }}</v-icon>{{ item.raw.titulo }}
                            </template>
                        </v-select>-->
            <v-text-field
              v-model="local.icono"
              label="Icono *"
              variant="outlined"
              readonly
              :error-messages="$vForm.icono.$errors.map((e) => e.$message)"
              @blur="$vForm.icono.$touch()"
              @input="$vForm.icono.$touch()"
              @click="modal_icon = true"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-menu
              v-model="colorModal"
              :close-on-content-click="false"
              transition="scale-transintion"
            >
              <template #activator="{ props }">
                <v-text-field
                  v-model="local.color"
                  label="Color *"
                  v-bind="props"
                  variant="outlined"
                  readonly
                  :error-messages="$vForm.color.$errors.map((e) => e.$message)"
                  @blur="$vForm.color.$touch()"
                  @input="$vForm.color.$touch()"
                ></v-text-field>
              </template>
              <v-card class="pa-3">
                <v-color-picker
                  v-model="local.color"
                  elevation="0"
                  hide-inputs
                ></v-color-picker>

                <v-card-actions class="justify-end mt-2">
                  <v-btn color="red" @click="colorModal = false"
                    >Cancelar</v-btn
                  >
                  <v-btn
                    color="green"
                    variant="elevated"
                    @click="colorModal = false"
                    >Aceptar</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-col>
          <v-col cols="12" md="6">
            <v-menu
              v-model="textColorModal"
              :close-on-content-click="false"
              transition="scale-transintion"
            >
              <template #activator="{ props }">
                <v-text-field
                  v-model="local.color_texto"
                  label="Color del Texto *"
                  v-bind="props"
                  variant="outlined"
                  readonly
                  :error-messages="
                    $vForm.color_texto.$errors.map((e) => e.$message)
                  "
                  @blur="$vForm.color_texto.$touch()"
                  @input="$vForm.color_texto.$touch()"
                ></v-text-field>
              </template>
              <v-card class="pa-3">
                <v-color-picker
                  v-model="local.color_texto"
                  elevation="0"
                  hide-inputs
                ></v-color-picker>

                <v-card-actions class="justify-end mt-2">
                  <v-btn color="red" @click="textColorModal = false"
                    >Cancelar</v-btn
                  >
                  <v-btn
                    color="green"
                    variant="elevated"
                    @click="textColorModal = false"
                    >Aceptar</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-col>
          <v-col cols="12" class="text-center">
            <h4>Vista Previa</h4>
            <v-tooltip
              :text="capitalizar(`Servicio de ${local?.nombre ?? ''}`)"
              location="top"
              class="custom-tooltip"
              :style="{
                '--bg-tooltip': local?.color,
                '--text-tooltip': local?.color_texto,
              }"
            >
              <template v-slot:activator="{ props }">
                <v-icon :color="local?.color" v-bind="props" size="x-large">{{
                  local?.icono
                }}</v-icon>
              </template>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="closeDialog">Cancelar</v-btn>
        <v-btn variant="tonal" class="bg-blueDinac" @click="saveLocal"
          >Guardar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <AppIconSelectorComponent
    v-if="modal_icon"
    v-model="modal_icon"
    @update:modelValue="modal_icon = $event"
    @iconSelected="updateIcon"
  />
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { required, helpers } from "@vuelidate/validators";
/* import useLocales from "../../../composables/useLocales"; */
import userServicios from "../../composables/useServicios";
import useVuelidate from "@vuelidate/core";
import useNoti from "@/composables/useNoti";
import AppIconSelectorComponent from "@/components/AppIconSelectorComponent.vue";
import { capitalizar } from "@/utils/data";

const {
  textColorModal,
  colorModal,
  transform,
  guardarServicio,
  actualizarServicio,
} = userServicios();


const props = defineProps({
  addEditDialog: Boolean,
  selected: Object,
});

const { notify } = useNoti();

const emit = defineEmits(["update:addEditDialog", "save", "update:selected"]);

const dialog = ref(props.addEditDialog);
const local = ref({ ...props.selected });
const modal_icon = ref(false);

const updateIcon = (icon) => {
  local.value.icono = icon;
};

watch(
  () => props.addEditDialog,
  (newVal) => {
    dialog.value = newVal;
    local.value = transform(props.selected);
  }
);

const rules = computed(() => ({
  nombre: {
    required: helpers.withMessage("El nombre es requerido", required),
  },
  icono: {
    required: helpers.withMessage("El icono es requerido", required),
  },
  color: {
    required: helpers.withMessage("El color es requerido", required),
  },
  color_texto: {
    required: helpers.withMessage("El color del texto es requerido", required),
  },
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

  local.value.id
    ? await actualizarServicio(local.value.id, local.value)
    : await guardarServicio({ ...local.value });
  emit("save", local.value);
  closeDialog();
};
</script>
<style scoped>
.custom-tooltip ::v-deep(.v-overlay__content) {
  background: var(--bg-tooltip, #333);
  color: var(--text-tooltip, #fff);
}
</style>
