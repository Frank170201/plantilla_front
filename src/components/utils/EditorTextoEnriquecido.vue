<template>
  <VuetifyTiptap
    outlined
    :disableToolbar="props.desactivarToolbar"
    :label="props.label"
    :extensions="extensions"
    :disabled="props.disabled"
    :max-height="465"
  >
    <template #bottom>
      <!-- Slot para acciones personalizadas -->
      <template v-if="$slots.actions">
        <slot name="actions" :disabled="props.disabled" />
      </template>

      <p v-if="props.errores" class="text-caption" style="color: #b00020">
        {{ props.errores.join(', ') }}
      </p>
    </template>
  </VuetifyTiptap>
</template>
<script setup>
import {
BaseKit,
Bold,
Color,
Fullscreen,
Heading,
Highlight,
History,
Image,
Italic,
Link,
Strike,
Table,
Underline,
Video,
VuetifyTiptap,
TextAlign,
OrderedList,
BulletList,
HorizontalRule,
} from "vuetify-pro-tiptap";
import "vuetify-pro-tiptap/style.css";

  const props = defineProps({
    label: String,
    placeholder: String,
    disabled: Boolean,
    desactivarToolbar: Boolean,
    valor: Object,
    errores: Array,
  });

  const extensions = [
    BaseKit.configure({ placeholder: { placeholder: props.placeholder } }),
    Bold,
    Italic,
    Underline,
    Strike,
    Color,
    Highlight,
    Heading,
    Link,
    Image,
    Video,
    Table,
    Fullscreen,
    History,
    TextAlign,
    OrderedList,
    BulletList,
    HorizontalRule,
  ];
</script>
<style>
  .text-overline {
    display: none !important;
  }
  .error-messages {
    color: red;
    margin-top: 5px;
  }
</style>
<style scoped>
    .vuetify-pro-tiptap :deep(.v-btn.v-btn--icon:nth-child(8)),
    .vuetify-pro-tiptap :deep(.v-btn.v-btn--icon:nth-child(9)),
    .vuetify-pro-tiptap :deep(.v-btn.v-btn--icon:nth-child(10)),
    .vuetify-pro-tiptap :deep(.v-btn.v-btn--icon:nth-child(11))
    {
        display: none;
    }
</style>
