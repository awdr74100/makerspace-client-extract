import Vue from 'vue';

// eslint-disable-next-line import/no-unresolved
import { registerSW } from 'virtual:pwa-register';

import App from './App.vue';
import router from './router';
import store from './store';

import './plugins/vue-axios';
import './plugins/vue-fontawesome';
import './plugins/vue-js-modal';
import './plugins/vue-loading-overlay';
import './plugins/vue-toastification';
import './plugins/vue-web-cam';

import 'bootstrap/dist/js/bootstrap.esm';

Vue.config.productionTip = false;

registerSW();

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
