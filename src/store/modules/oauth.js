import axios from 'axios';

export default {
  namespaced: true,
  state: {
    user: {
      id: '',
      name: '',
      email: '',
    },
  },
  actions: {
    async getUserInfo({ commit }, { accessToken }) {
      const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`;

      try {
        const { data } = await axios.get(url);

        commit('SET_USER', { id: data.id, name: data.name, email: data.email });
      } catch (error) {
        this._vm.$toast.error(error.message);
      }
    },
  },
  mutations: {
    SET_USER(state, { id, name, email }) {
      state.user.id = id;
      state.user.name = name;
      state.user.email = email;
    },
  },
};
