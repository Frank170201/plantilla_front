<template>
  <v-app class="fondo-nieve">
    <loading-component />
    <div>
      <app-aside-bar-component
        ref="asideBar"
        v-model="drawer"
        @on-close="close"
      />
      <app-bar-nav @on-show="showMenu" />
      <v-main>
        <router-view />
      </v-main>
    </div>
  </v-app>
</template>

<script setup>
import { useDisplay } from "vuetify";
import { onMounted, ref } from "vue";
import AppAsideBarComponent from "@/components/AppAsideBarComponent.vue";
import AppBarNav from "@/components/AppBarNav.vue";
import "vue-loading-overlay/dist/css/index.css";
import LoadingComponent from "@/components/LoadingComponent.vue";

const display = useDisplay();

const drawer = ref(false);
const asideBar = ref(null);

const showMenu = () => {
  drawer.value = !drawer.value;
};

const close = () => {
  if (display.xs.value) {
    drawer.value = !drawer.value;
  }
};

onMounted(() => {
  localStorage.removeItem("sesionCerrada");
});
</script>

<style>
html, body {
  font-family: Inter, sans-serif !important;
}

.v-card:not(.card-sin-estilizar):has(.v-table) {
  box-shadow: none !important;
  padding: 5% !important;
}

.v-table:has(.v-input) .v-field--variant-solo, .v-field--variant-solo-filled {
  box-shadow: none !important;
  background-color: #F6F6FB !important;
  font-weight: 400;
  font-size: 12px;
  line-height: 13px;
  letter-spacing: 0.5px;
}

.v-data-table:not(.table-sin-estilizar) .v-data-table__td:has(.v-btn) .v-btn {
  background: #00D6BD !important;
  color: #FFF;
  box-shadow: none !important;
}

.table-titulo {
  font-family: Inter;
  font-weight: 900;
  font-size: 3rem;
  line-height: 119%;
  color: #043432 !important;
  white-space: normal;
  word-wrap: break-word;
}

.table-subtitulo {
  font-family: Inter;
  font-weight: 500;
  line-height: 30px;
  letter-spacing: -2%;
  color: #043432 !important;
  white-space: normal;
  word-wrap: break-word;
}

@media screen and (max-width: 730px) {
  .table-titulo {
    font-size: 2rem;
  }
}

.custom-chip-cats {
  border-radius: 5px !important;
  color: #7E7E7E !important;
  min-height: 50px !important;
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: flex-start !important;
}

.custom-chip-cats i {
  margin-right: 5px;
}

.custom-chip-cats span {
  overflow-wrap: break-word;
  white-space: normal;
  line-height: 1.1;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  line-clamp: 1;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.rows-niveles {
  width: 100%;
  background: #F5F5F5;
  box-shadow: 0px 4px 4px 0px #00000040;
  display: flex;
  align-items: center !important;
  padding: 1% 2% 1% 2%;
}

.rows-niveles .v-label {
  color: #121212 !important;
}

.rows-niveles .mdi-radiobox-blank {
  font-size: 1rem;
}

.rows-niveles .mdi-radiobox-marked::before {
  color: #5A6ACF !important;
  content: "\F09DF";
  font-size: 4.5rem !important;
}

.v-btn.bg-blueDinac {
  background: #043432 !important;
  color: #FFFFFF !important;
  border-radius: 8px !important;
}

.v-dialog > .v-overlay__content > .v-card:not(.card-sin-estilizar) {
  border-radius: 8px !important;
  padding: 16px !important;
}

.v-dialog > .v-overlay__content > .v-card:not(.card-sin-estilizar) .v-card-title {
  font-family: Inter;
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 2rem;
  color: #043432 !important;
}

.v-dialog > .v-overlay__content > .v-card:not(.card-sin-estilizar) .v-card-title span {
  font-family: Inter;
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 2rem;
  color: #043432 !important;
}

.v-dialog > .v-overlay__content > .v-card .v-card-title .bg-blueDinac span {
  font-size: 14px;
  color: #FFF !important;
}

.v-dialog > .v-overlay__content > .v-card .v-card-actions .v-btn--variant-text {
  color: red;
}

.v-btn.text-primary {
  background: #00D6BD !important;
  color: #FFFFFF !important;
}

.v-autocomplete > .v-input__control .v-field__append-inner i::before {
  content: "\F0B26";
  font-size: 18px;
}

.v-card:not(.card-sin-estilizar) .v-card-title {
  font-family: Inter;
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 2rem;
  color: #043432 !important;
}
</style>
