import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import DB from "./scripts/db";
import {Shell, shell} from "electron";
import OuterLink from "./components/common/OuterLink.vue";
import * as electron from "electron";

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

declare global {
    interface Window {
        db: DB;
    }
}

Vue.component("outer-link", OuterLink);

electron.ipcRenderer.on("configLoaded", (event) => {
    /* eslint-disable no-new */
    new Vue({
        components: {App},
        router,
        store,
        template: '<App/>'
    }).$mount('#app');
});
