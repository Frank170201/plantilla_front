<template>
    <v-dialog max-width="600px" persistent>
        <v-card class="no-padding">
            <v-card-title class="pa-4">
                <v-btn icon variant="text" size="small" @click.stop="cerrarModal">
                    <v-icon size="28px">mdi-window-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-4">
                <div class="d-flex flex-column align-center gap-2">
                    <v-icon size="52px" :color="color">{{ icono }}</v-icon>
                    <p class="mb-0 font-weight-medium text-h6">{{ texto }}</p>
                    <slot name="accion" :close="cerrarModal" :color="color"></slot>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script setup>
import { computed } from 'vue';

const emits = defineEmits(['on-close']);

const { texto, tipo } = defineProps({   
    texto: String, 
    tipo: { type: String, default: 'success' },
});

const icono = computed(() => {
    switch(tipo) {
        case 'success': return 'mdi-check-circle' 
        default: return 'mdi-help';
    }
});

const color = computed(() => {
    switch(tipo) {
        case 'success': return 'success' 
        default: return '#000000';
    }
});

const cerrarModal = () => {
    emits('on-close')
}
</script>
