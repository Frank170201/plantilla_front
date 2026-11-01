<template>
  <div v-if="isLoading" class="spinner-overlay">
    <PacmanLoader color="#252B58" />
  </div>
</template>

<script setup>
import { isLoading } from "@/services/network.services";
import  PacmanLoader  from "vue-spinner/src/PacmanLoader.vue";

</script>

<style>
.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 9999;
}
</style>
