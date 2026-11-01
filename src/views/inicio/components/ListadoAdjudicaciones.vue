<template>
    <v-card>
        <v-card-title>
            <h3 class="text-h6 font-weight-bold text-uppercase break-word">
                Adjudicaciones públicas
            </h3>
        </v-card-title>
        <v-divider />
        <v-card-text>
            <p class="mb-0 text-body-1">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti neque numquam quasi expedita deserunt, vel soluta provident. Placeat, voluptate quos atque quidem eveniet distinctio saepe cumque incidunt animi aliquid sunt.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti neque numquam quasi expedita deserunt, vel soluta provident. Placeat, voluptate quos atque quidem eveniet distinctio saepe cumque incidunt animi aliquid sunt.
            </p>
            <v-data-table 
                class="mt-4" 
                :headers="headers" 
                :items="items" 
                :hide-default-header="smAndDown"
                :mobile="smAndDown"
                no-data-text="No hay registros disponibles"
            />
        </v-card-text>
    </v-card>
</template>
<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs';

const items = [];

const headers = [
    { title: 'Código', key: 'codigo', align: 'center', sortable: false },
    { title: 'Nombre', key: 'nombre', align: 'center', sortable: false },
    { title: 'Descripción', key: 'descripcion', align: 'center', sortable: false },
];

const { smAndDown } = useDisplay();
</script>