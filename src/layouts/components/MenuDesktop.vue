<template>
    <ul style="list-style: none; max-width: 650px;" class="d-flex flex-grow-1 justify-end gap-8">
        <li 
            v-for="(opcion, index) in menuItems" 
            :key="index"
            class="flex-grow-1 flex-shrink-0 app__header--link"
            style="color: white;"
        >
            <v-menu 
                v-if="opcion.children"
                offset-y
                transition="scale-transition"
            >
                <template #activator="{ props, isActive }">
                    <p v-bind="props" class="color-nieve" style="font-size: 18px; line-height: 23px; font-weight: 700;">
                        <span class="mr-2">{{ opcion.title }}</span>
                        <v-icon style="transform: translateY(-1px);">mdi-chevron-{{ isActive ? 'up' : 'down' }}</v-icon>
                    </p>
                </template>
                <v-list>
                    <v-list-item
                        v-for="subOpcion in opcion.children"
                        :key="subOpcion.id"
                        :to="{ name: subOpcion.to, params: { ...subOpcion.params } }"
                        :title="subOpcion.title"
                    />
                </v-list>
            </v-menu>
            <router-link v-else :to="opcion.to" class="color-nieve" style="font-size: 18px; line-height: 23px; font-weight: 700; text-decoration: none;">
                {{ opcion.title }}
            </router-link>
        </li>
    </ul>
</template>
<script setup>
const { menuItems } = defineProps({
    menuItems: Array,
});
</script>
<style scoped>
    :deep(.v-slide-group__content) {
        gap: 16px;
    }

    :deep(.v-slide-group__content > *) {
        flex-grow: 1;
        cursor: pointer;
        text-decoration: none;
        text-align: center;
    }

    :deep(.v-slide-group__content > *:active ) {
        color: var(--complementario-2) !important;
    }

    .app__header--link {
        cursor: pointer;
    }

    .app__header--link:active > * {
        color: var(--complementario-2) !important;
    }
</style>
