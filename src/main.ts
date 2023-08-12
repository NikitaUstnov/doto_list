import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Ripple from "primevue/ripple";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/vela-orange/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);

app.directive("ripple", Ripple);

const primevueOptions = { ripple: true };
const toastOptions = { timeout: 2000 };

app
  .use(store)
  .use(router)
  .use(PrimeVue, primevueOptions)
  .use(Toast, toastOptions)
  .mount("#app");
