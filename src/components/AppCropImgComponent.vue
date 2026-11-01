<template>
  <v-dialog
    :model-value="props.showDialogConfirm"
    max-width="25%"
    persistent=""
  >
    <v-card>
      <v-card-title>
        <p class="text-h5 text-center font-weight-black my-2">
          {{ props.title }}
        </p>
      </v-card-title>
      <v-divider />
      <v-card-text class="d-flex flex-column justify-center align-center">
        <cropper
          ref="imgCutter"
          class="upload-example-cropper"
          :src="getPhoto"
          :stencil-size="{
            width: 500,
            height: 500,
          }"
          :stencil-props="{
            handlers: {},
            movable: false,
            resizable: false,
            aspectRatio: 1,
          }"
          image-restriction="stencil"
        />
      </v-card-text>
      <v-card-text>
        <p>Cargar imagen</p>
        <v-file-input
          v-model="photo"
          prepend-icon=""
          prepend-inner-icon="mdi-upload"
          variant="outlined"
          density="compact"
          accept="image/png, image/jpeg, image/jpg"
          :clearable="false"
        />
      </v-card-text>
      <v-card-actions class="d-flex justify-center align-center">
        <v-btn
          variant="outlined"
          v-if="!props.hide_cancel_button"
          color="warningDinac"
          @click="closeDialog"
          :loading="loading"
          >Cancelar</v-btn
        >
        <v-btn
          variant="outlined"
          color="blueDinac"
          :loading="loading"
          @click="confirmAction"
          >Aceptar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import useNoti from "@/composables/useNoti";
import { ref } from "vue";
import { computed } from "vue";

const { notify } = useNoti();

const props = defineProps({
  showDialogConfirm: {
    type: Boolean,
    default: false,
  },
  hide_cancel_button: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Cargar imagen",
  },
  formatPermit: {
    type: Array,
    default: () => ["image/png", "image/jpeg", "image/jpg"],
  },
});
const validImage = ({ type }) => {
  if (!props.formatPermit.includes(type)) {
    return false;
  }
  return true;
};

const photo = ref(null);
const imgCutter = ref(null);
const loading = ref(false);

const emit = defineEmits(["update:modelValue", "onConfirm"]);

const getPhoto = computed(() => {
  return photo.value ? URL.createObjectURL(photo.value[0]) : "";
});

const confirmAction = async () => {
  loading.value = true;
  if (!photo.value) {
    notify("Seleccione una imagen", "error");
    loading.value = false;
    return;
  }
  if (!validImage(photo.value[0])) {
    notify(
      `Solo puede cargar imágenes de tipo ${props.formatPermit.join()}`,
      "error"
    );
     loading.value = false;
    return;
  }

  const { canvas, image } = imgCutter.value.getResult();
  // Convertir canvas a blob
  const blob = await new Promise((resolve) => canvas.toBlob(resolve));

  // Crear objeto File a partir del blob
  const imageFile = new File([blob], "filename.png", { type: "image/png" });
  const imageBase64 = canvas.toDataURL();
  loading.value = false;
  photo.value = null;
  imgCutter.value.null;
  imgCutter.value.null;
  emit("onConfirm", { imageBase64, image, imageFile });
  emit("update:modelValue", false);

  //Validar input file
};

const closeDialog = () => {
  photo.value = null;
  imgCutter.value.null;
  emit("update:modelValue", false);
};
</script>
