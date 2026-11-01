<template>
  <v-expansion-panels class="filtros-sticky" :style="`position: sticky !important; z-index: 2000; top: ${menuHeight}px;`">
    <v-expansion-panel>
      <v-expansion-panel-title>
        <div class="d-flex align-center" style="gap: 8px">
          <v-icon
            :size="props.size"
            :icon="props.icon"
          />
          <span class="font-weight-bold text-uppercase">{{ props.title }}</span>
        </div>
      </v-expansion-panel-title>
      <v-divider />
      <v-expansion-panel-text>
        <div class="px-4 py-4">
          <slot></slot>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import { useDashboardStore } from '@/store/dashboard';
import { storeToRefs } from 'pinia';

const props = defineProps({
  icon: {
    type: String,
    default: "mdi-filter-cog",
  },
  size: {
    type: Number,
  },
  title: {
    type: String,
    default: 'Filtros'
  },
});

const { menuHeight } = storeToRefs(useDashboardStore());
</script>

<style scoped>
:deep(.v-expansion-panel-text__wrapper) {
  padding: 0px !important;
}
</style>
