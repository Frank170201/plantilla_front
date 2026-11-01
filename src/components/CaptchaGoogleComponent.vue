<script setup>
import { ref } from "vue";
import { RecaptchaV2, useRecaptcha } from "vue3-recaptcha-v2";
import useNoti from "@/composables/useNoti";

const { handleReset } = useRecaptcha();
const { notify } = useNoti();

const widgetId = ref(null);

const emits = defineEmits(["generar-token", "token-expirado"]);

const handleWidgetId = (id) => {
  widgetId.value = id;
};

const resetRecaptcha = () => {
  handleReset(widgetId.value);
};

const handleErrorCallback = () => {
  notify({
    type: "error",
    message: "Error al verificar el captcha. Por favor, inténtelo de nuevo.",
  });
  resetRecaptcha();
};

const handleExpiredCallback = () => {
  notify({
    type: "warning",
    message: "El captcha ha expirado. Por favor, inténtelo de nuevo.",
  });
  resetRecaptcha();
  
  emits('token-expirado');
};

const handleLoadCallback = (response) => {
  emits("generar-token", response);
  notify("Captcha cargado correctamente.", "success");
};
</script>

<template>
  <RecaptchaV2
    size="normal"
    @widget-id="handleWidgetId"
    @error-callback="handleErrorCallback"
    @expired-callback="handleExpiredCallback"
    @load-callback="handleLoadCallback"
  />
</template>
