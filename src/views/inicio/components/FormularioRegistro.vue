<template>
    <v-card>
        <v-card-title>
            <h3 class="text-h6 font-weight-bold text-uppercase break-word">
                ¿Aún no te registras?
            </h3>
        </v-card-title>
        <v-divider />
        <v-card-text>
            <p class="mb-0 text-body-1">
                Regístrate en pocos pasos dando clic en el botón y completa el formulario
            </p>
        </v-card-text>
        <v-card-actions class="d-flex justify-center align-center">
            <v-btn 
                color="secondary" 
                size="large" 
                variant="elevated"
                @click="openDialog"
            >
                Registrarse
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script setup>
const emit = defineEmits(['open-dialog']);

const openDialog = () => {
    emit('open-dialog', true);
};
</script>