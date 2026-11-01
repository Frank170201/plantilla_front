<template>
    <v-dialog :model-value="props.showDialog" persistent max-width="600">
        <v-card>
            <v-card-title>
                <p class="text-h5 text-center font-weight-black my-2 color-primario-1">
                    Configurar un Authenticator
                </p>
            </v-card-title>
            <v-card-text>
                <v-row class="d-flex flex-column justify-center align-center color-primario-1">
                    <ul>
                        <li>
                            <span>En la app de autenticación de su elección, presiona el ícono <strong>+</strong></span>
                        </li>
                        <li>
                            <span>Elige la opción <strong>Escanear un código QR</strong>.</span>
                        </li>
                    </ul>
                </v-row>
                <v-row justify="center">
                    <v-img :src="QrCode" max-width="200"/>
                </v-row>
                <v-otp-input
                    v-if="QrCode"
                    v-model="otpCode"
                    @finish="onFinish"
                >
                </v-otp-input>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primario-1" variant="flat" style="border-radius: 8px;" :disabled="!otpCode" @click="onFinish">Verificar</v-btn>
                <v-btn color="red" @click="cancelSetup">Cancelar</v-btn>
            </v-card-actions>
        </v-card>
        <AppDialogoConfirmComponent
            v-model="confirmDialog"
            @on-confirm="validateAuthenticator"
            title="¿Deseas finalizar la configuración?"
            descripcion="Por favor, verifica que el código sea correcto para continuar."
        />
    </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import authServices from "@/services/auth.services";
import AppDialogoConfirmComponent from "@/components/AppDialogoConfirmComponent.vue";

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const confirmDialog = ref(false);
const QrCode = ref(null);
const otpCode = ref("");

const validateAuthenticator = async () => {
  try {
    await authServices.validateMethod(otpCode.value);
    emit('update:modelValue', false);
  } catch (error) {
    console.error("Error validando el código:", error);
  }
};

const cancelSetup = () => {
    otpCode.value = "";
    emit('update:modelValue', false);
};

const generateQrCode = async () => {
  const { data } = await authServices.getQrCode();
  QrCode.value = data;
};

const onFinish = () => {
  confirmDialog.value = true;
};

defineExpose({
  generateQrCode,
});
</script>
