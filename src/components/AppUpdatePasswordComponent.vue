<template>
  <v-dialog :model-value="props.modelValue" persistent max-width="400">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold" style="color: var(--primario-1);">
        Actualizar Contraseña
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          label="Contraseña *"
          @click:append-inner="showPassword = !showPassword"
          :error-messages="$vProfile.password.$errors.map((e) => e.$message)"
          @blur="$vProfile.password.$touch()"
          @input="$vProfile.password.$touch()"
          variant="outlined"
        ></v-text-field>
        <v-text-field
          v-model="form.confirm_password"
          :type="showConfirmPassword ? 'text' : 'password'"
          :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
          label="Confirmar contraseña *"
          @click:append-inner="showConfirmPassword = !showConfirmPassword"
          :error-messages="$vProfile.confirm_password.$errors.map((e) => e.$message)"
          @blur="$vProfile.confirm_password.$touch()"
          @input="$vProfile.confirm_password.$touch()"
          variant="outlined"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="red" @click="cancel">Cancelar</v-btn>
        <v-btn variant="flat" style="border-radius: 8px;" color="primario-2" @click="confirm">Confirmar</v-btn>
      </v-card-actions>
    </v-card>

    <AppDialogoConfirmComponent
      v-model="confirmDialog"
      @on-confirm="sendPasswordData"
      title="¿Esta seguro de actualizar su contraseña?"
      descripcion="Asegúrese de que la nueva contraseña sea correcta, esta acción no se podrá deshacer."
    />
  </v-dialog>
</template>

<script setup>
import { computed, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers, minLength, sameAs, maxLength } from "@vuelidate/validators";
import AppDialogoConfirmComponent from "@/components/AppDialogoConfirmComponent.vue";
import useNoti from "@/composables/useNoti";
import usuariosServices from "@/services/usuarios.services";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const form = ref({
  password: "",
  confirm_password: "",
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const confirmDialog = ref(false);
const { notify } = useNoti();

const regexDescripcion = (value) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/;
  return regex.test(value);
};

const rules = computed(() => ({
  password: {
    required: helpers.withMessage("La nueva contraseña es requerida.", required),
    minLength: helpers.withMessage("La contraseña debe tener al menos 8 caracteres", minLength(8)),
    maxLength: helpers.withMessage("La contraseña no debe tener más de 16 caracteres", maxLength(16)),
    regexDescripcion: helpers.withMessage(
      "La contraseña debe incluir al menos una mayúscula, una minúscula y un número",
      regexDescripcion
    ),
  },
  confirm_password: {
    required: helpers.withMessage("Debe confirmar la nueva contraseña.", required),
    sameAsPassword: helpers.withMessage("Las contraseñas no coinciden.", sameAs(form.value.password)),
  },
}));

const $vProfile = useVuelidate(rules, form);

const emit = defineEmits(["update:modelValue", "confirm"]);

const cancel = () => {
  $vProfile.value.$reset();

  form.value.password = null;
  form.value.confirm_password = null;

  emit("update:modelValue", false);
};

const confirm = () => {
    confirmDialog.value = true;
};

const sendPasswordData = async () => {
  $vProfile.value.$validate();
  if ($vProfile.value.$invalid) {
    notify("Hay campos inválidos", "error");
    return;
  }

  const payload = {
    password: form.value.password,
    confirm_password: form.value.confirm_password,
  };

  await usuariosServices.updatePassword(payload);

  $vProfile.value.$reset();
  emit("update:modelValue", false);
};

</script>
