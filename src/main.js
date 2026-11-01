/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";
import VCalendar from "v-calendar";
import "v-calendar/style.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

// composables
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";
import { inyectarColoresDelSitio } from "./config/app.colors";

// Recaptcha
import { install } from "vue3-recaptcha-v2";

const app = createApp(App);

registerPlugins(app);

// Global registry
app.use(VCalendar, {
  componentPrefix: "vc",
});

// Recaptcha
app.use(install, {
  sitekey: import.meta.env.VITE_VUE_GOOGLE_CAPTCHA_SECRET,
  cnDomains: false,
});

inyectarColoresDelSitio();

app.mount("#app");
