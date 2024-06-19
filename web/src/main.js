import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import {loadFonts} from './plugins/webfontloader'
import loader from "vue-ui-preloader";
import { SnackbarService } from "vue3-snackbar";
import "vue3-snackbar/styles";

await loadFonts()

createApp(App)
    .use(router)
    .use(store)
    .use(vuetify)
    .use(loader)
    .use(SnackbarService)
    .mount('#app')
