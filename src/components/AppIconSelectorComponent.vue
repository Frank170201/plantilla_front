<template>
  <v-dialog :model-value="modelValue" max-width="700">
    <v-card style="border-radius: 8px; padding: 2%;">
      <v-card-title class="text-h5 text-center mt-4 text-uppercase" style="font-weight: 600; color: #043432;">
        Seleccionar icono
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="search"
          label="Buscar icono..."
          append-inner-icon="mdi-magnify"
          variant="solo"
          hide-details
          class="mb-4"
        />

        <v-virtual-scroll
            :items="filteredIcons"
            height="400"
            item-height="60"
        >
            <template #default="{ item }">
                <v-list-item @click="selectIcon(item.value)" class="px-2">
                    <template v-slot:prepend>
                        <v-icon>{{ item.value }}</v-icon>
                    </template>

                    <v-list-item-title>{{ item.text }}</v-list-item-title>
                </v-list-item>
            </template>
        </v-virtual-scroll>

      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn 
            @click="closeModal()"
            variant="tonal"
            color="error"
        >Cancelar</v-btn>
        <v-btn
            variant="flat"
            color="#29ABE2"
            style="filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)); border-radius: 8px;"
        >
            Seleccionar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import mdiMeta from '@/assets/mdi_traducido.json';
import { ref, computed, onMounted } from 'vue';

defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    }
});
const emit = defineEmits(['update:modelValue', 'icon-selected']);

const search = ref('');
const icons = ref([]);

const selectIcon = (icon) => {
  emit('icon-selected', icon)
  closeModal();
};

const removeDiacritics = (text) =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const filteredIcons = computed(() =>
  icons.value.filter(icon =>
    removeDiacritics(icon.keyword.toLowerCase())
      .includes(removeDiacritics(search.value.toLowerCase()))
  )
);

const closeModal = () => {
  emit('update:modelValue', false);
  search.value = '';
};

onMounted(() => {
  icons.value = mdiMeta.map(i => ({
    value: `mdi-${i.name}`,
    text: i.name,
    keyword: i.keyword,
  }));
});
</script>

<style scoped>
:deep(.v-field--variant-solo, .v-field--variant-solo-filled ) {
  box-shadow: none !important;
  background-color: #F6F6FB !important;
  font-weight: 400;
  font-size: 14px;
  line-height: 13px;
  letter-spacing: 0.5px;
  border-radius: 5px;
}
</style>
