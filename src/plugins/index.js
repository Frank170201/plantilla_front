/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { loadFonts } from "./webfontloader";
import vuetify from "./vuetify";
import pinia from "../store";
import router from "../router";
import Toastify from "vue3-toastify";
import { LoadingPlugin } from "vue-loading-overlay";
import { Cropper } from "vue-advanced-cropper";
import VueDatePicker from "@vuepic/vue-datepicker";
import "vue-advanced-cropper/dist/style.css";
import "@vuepic/vue-datepicker/dist/main.css";
import "vue-loading-overlay/dist/css/index.css";
import "vue3-json-viewer/dist/vue3-json-viewer.css";
import VueTheMask from "vue-the-mask";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import LoadingComponent from "@/components/LoadingComponent.vue";
import Vue3Lottie from "vue3-lottie";
import VueApexCharts from "vue3-apexcharts";

export function registerPlugins(app) {
  loadFonts();
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(Toastify)
    .use(LoadingPlugin)
    .use(VueTheMask)
    .use(Vue3Lottie)
    .use(VueApexCharts)
    .component("Cropper", Cropper)
    .component("PulseLoader", PulseLoader)
    .component("VueDatePicker", VueDatePicker);
  app.component("LoadingComponent", LoadingComponent);
}
