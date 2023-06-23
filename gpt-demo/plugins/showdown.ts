import { VueShowdown } from "vue-showdown";

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.component("VueShowdown", VueShowdown);
});