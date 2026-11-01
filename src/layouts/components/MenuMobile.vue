<template>
    <v-menu
        v-model="menu"
        offset-y
        transition="scale-transition"
    >
        <template #activator="{ props }">
            <v-app-bar-nav-icon v-bind="props" color="white" />
        </template>
        <v-list>
            <template v-for="(opcion, index) in menuItems" :key="index">
                <v-list-group
                    v-if="opcion.children"
                    :value="opcion.title"
                >
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" :title="opcion.title " />
                    </template>

                    <v-list-item
                        v-for="subOpcion in opcion.children"
                        :key="subOpcion.id"
                        :title="subOpcion.title"
                        :to="{ name: subOpcion.to, params: { ...subOpcion.params } }"
                    />
                </v-list-group>
                <v-list-item v-else :to="opcion.to">
                    <v-list-item-title>
                        {{ opcion.title }}
                    </v-list-item-title>
                </v-list-item>
            </template>
        </v-list>
    </v-menu>
</template>
<script setup>
import { ref } from "vue";

const { menuItems } = defineProps({
    menuItems: Array,
});

// Estado
const menu = ref(false);

</script>