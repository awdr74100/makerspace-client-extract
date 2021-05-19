export default {
  namespaced: true,
  mutations: {
    OPEN_MODAL(state, { modal }) {
      this._vm.$modal.show(modal);
    },
    CLOSE_MODAL(state, { modal }) {
      this._vm.$modal.hide(modal);
    },
  },
};
