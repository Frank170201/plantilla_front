<template>
    <PresentacionInstitucional :style="pageMargins" />
    <div :style="pageMargins" style="background-color: #FBFBFB;">
        <SeccionAnuncios  style="margin-top: 30px;"  />
    </div>
</template>
<script setup>
import PresentacionInstitucional from "@/layouts/components/PresentacionInstitucional.vue";
import SeccionAnuncios from "./components/SeccionAnuncios.vue";
import { usePageMargin } from "@/composables/usePageMargin";

const pageMargins = usePageMargin();
</script>