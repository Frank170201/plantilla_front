<template>
    <v-btn
        color="nieve"
        to="/login"
        variant="elevated"
        :size="display.mdAndUp.value ? 'large' : 'default'"
        rounded="lg"
    >
        <span
            class="color-primario-1 font-weight-bold"
            style="font-size: 18px; line-height: 23px; letter-spacing: 0px; text-transform: none;"
        >
            Iniciar sesión
        </span>
    </v-btn>
</template>
<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs';

const display = useDisplay();
</script>
