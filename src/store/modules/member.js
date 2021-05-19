import axios from 'axios';

export default {
  namespaced: true,
  actions: {
    async createMember(context, { id, name, email, features }) {
      try {
        const url = `${import.meta.env.VITE_APP_BACKEND_URL}/api/members`;
        const payload = {
          oauthId: id,
          name,
          email,
          features: features.map((feature) =>
            JSON.stringify(feature.descriptor),
          ),
        };

        const { data } = await axios.post(url, payload);

        if (!data.success) {
          throw new Error(data.message);
        }

        this._vm.$toast.success(data.message);
      } catch (error) {
        this._vm.$toast.error(error.message);
      }
    },
  },
};
