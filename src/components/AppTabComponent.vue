<template>
  <v-tabs 
    v-model="tabs"
    :align-tabs="props.align_tabs"
  >
    <v-tab
      v-for="(tab, index) in props.content_tabs"
      :key="index"
      :value="tab.value"
      :prepend-icon="tab.icon"
      :slider-color="props.slider_color"
    >
      <span>{{ tab.text }}</span>
    </v-tab>
  </v-tabs>

  <v-tabs-window v-model="tabs" class="pa-4">
    <v-tabs-window-item
      v-for="(item, index) in props.content_tabs"
      :key="index"
      :value="item.value"
      :eager="item.eager"
    >
      <slot :name="`tab-${index}`" :params="{ ...item.extra }">
        <component :is="item.componente" v-if="item.componente" />
      </slot>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  align_tabs: {
    type: String,
    required: false,
    default: "left",
  },
  content_tabs: {
    type: Array,
    required: true,
  },
  slider_color: {
    type: String,
    required: false,
    default: "blueLigthDinac",
  },
});

const emit = defineEmits(["update:tab"]);

const tabs = ref(null);

watch(tabs, (newVal) => {
  emit('update:tab', newVal);
});

defineExpose({
  tabs,
});

</script>
