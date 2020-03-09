import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import DB from "./scripts/db";

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

declare global {
  interface Window { db: DB; }
}

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
