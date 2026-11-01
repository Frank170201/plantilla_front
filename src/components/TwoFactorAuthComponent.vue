<template>
  <v-dialog :model-value="props.showDialog" persistent max-width="500">
    <v-card>
      <v-card-title>
        <p class="text-h5 text-center font-weight-black my-2">
          Verifique su cuenta
        </p>
      </v-card-title>
      <v-card-text class="text-center">
        <p class="mb-5">
          Ingresa el código de verificación para continuar con tu inicio de
          sesión.
        </p>
        <v-otp-input 
          v-model="otpCode" 
          @finish="onFinish"
        >
        </v-otp-input>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "sendCode"]);

const otpCode = ref("");

const onFinish = () => {
  emit("sendCode", otpCode.value);
};
</script>
