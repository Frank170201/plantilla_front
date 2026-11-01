<template>
  <v-dialog max-width="80%" persistent>
    <v-card>
      <v-card-title
        class="mt-5 d-flex justify-space-between"
        style="position: sticky; top: 0; z-index: 10"
      >
        <v-btn
          icon="mdi-close"
          variant="outlined"
          color="black"
          @click.stop="cerrarModal"
        />
      </v-card-title>
      <v-card-text>
        <VueMagnifier :src="props.src" mg-shape="square" zoom-factor="1.5" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup>
import VueMagnifier from "@websitebeaver/vue-magnifier";
import "@websitebeaver/vue-magnifier/styles.css";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  src: { type: String },
});

// Metodos
const cerrarModal = () => {
  emit("update:modelValue", false);
};
</script>
