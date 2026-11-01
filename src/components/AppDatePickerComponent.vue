<template>
  <v-menu v-model="isMenuOpen"
          :close-on-content-click="false"
          transition="scale-transition"
          min-width="auto"
  >
    <template v-slot:activator="{ props }">
      <v-text-field
          :label="title"
          :model-value="formattedDate"
          @blur="$vFecha.selectedDate.$touch()"
          @input="$vFecha.selectedDate.$touch()"
          :error-messages="$vFecha.selectedDate.$error ? $vFecha.selectedDate.$errors[0].$message : ''"
          readonly
          v-bind="props"
          variant="outlined"
          density="compact"
      ></v-text-field>
    </template>
    <v-date-picker title="Elija una fecha" :min="minDate" color="blueDinac" v-model="selectedDate">
      <template #header>
      </template>
    </v-date-picker>
  </v-menu>
</template>
<script setup>
import {computed, ref, watch} from "vue";
import dayjs from "dayjs";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
const {title,  modelValue, minDate } = defineProps([
  "modelValue",
  "title",
  "minDate",
]);

const emit = defineEmits(["update:modelValue", "update:senDate"]);

const isMenuOpen = ref(false);
const selectedDate = ref(modelValue);

const rules = computed(() => {
  return {
    selectedDate: {
      required: helpers.withMessage(
        'La fecha es requerida',
        required,
      ),
    }
  }
})

const $vFecha = useVuelidate(rules, selectedDate)

const formattedDate = computed(() => {
  const date_format = dayjs(selectedDate.value).format("DD/MM/YYYY");
  return selectedDate.value ? date_format : "";
});
watch(selectedDate, (newDate) => {
  emit("update:modelValue", newDate);
  emit("update:senDate", dayjs(newDate).format("YYYY-MM-DD"));
  isMenuOpen.value = false;
});
</script>
