<template>
    <v-card class="text-center app-empty-state pa-4" :class="{ 'bordered': props.borde }" elevation="0">
        <slot name="empty-content">
            <h3 
                v-if="props.titulo" 
                class="font-weight-bold color-primario-1 text-uppercase mb-1" 
                style="font-size: 24px; line-height: 32px; letter-spacing: 0%;"
                v-html="props.titulo"
            />

            <slot name="descripcion">
                <p class="color-carbon" style="font-size: 16px;" v-html="props.descripcion" />
            </slot>
            <v-icon size="100" class="color-neutro-2 mt-4">{{ props.icono }}</v-icon>
        </slot>
    </v-card>
</template>
<script setup>
const props = defineProps({
    icono: { 
        type: String,
        default: 'mdi-database-off',
    },
    titulo: { 
        type: String,
        default: 'No hay datos disponibles',
    },
    descripcion: { 
        type: String,
        default: 'Intenta con otra búsqueda o vuelve más tarde',
    },
    borde: {
        type: Boolean,
        default: false,
    },
})
</script>
<style scoped>
.app-empty-state.bordered {
    border: dashed 2px var(--neutro-2);
}
</style>
