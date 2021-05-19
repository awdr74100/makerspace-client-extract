import Vue from 'vue';
import Vuex from 'vuex';
import oauthModule from './modules/oauth';
import modalModule from './modules/modal';
import memberModule from './modules/member';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: import.meta.env.DEV,
  state: {
    loading: {
      status: '',
      active: false,
    },
    features: [],
  },
  actions: {},
  mutations: {
    SET_LOADING(state, { status, active }) {
      state.loading.status = status;
      state.loading.active = active;
    },
    SET_FEATURES(state, { features }) {
      state.features = features;
    },
  },
  modules: {
    oauth: oauthModule,
    modal: modalModule,
    member: memberModule,
  },
});
