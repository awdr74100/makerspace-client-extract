<template>
  <div>
    <modal
      name="postModal"
      height="auto"
      :adaptive="true"
      :shift-y="0.2"
      :width="460"
      :max-width="maxWidth"
      @before-open="beforeOpen"
      @before-close="closeModal(null)"
    >
      <div class="container-fluid px-0">
        <div class="modal-content border-0 rounded-0">
          <div class="modal-header border-0 bg-teal text-white rounded-0">
            <h5 class="modal-title">確認資料</h5>
            <button
              type="button"
              class="btn-close"
              @click.prevent="closeModal('postModal')"
            ></button>
          </div>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="userName" class="form-label">姓名</label>
            <input
              id="userName"
              :value="user.name"
              type="text"
              disabled
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label for="userEmail" class="form-label">信箱</label>
            <input
              id="userEmail"
              :value="user.email"
              type="email"
              disabled
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label for="userId" class="form-label">成員識別碼</label>
            <input
              id="userId"
              :value="user.id"
              type="text"
              disabled
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label for="userSoundId" class="form-label">聲音識別碼</label>
            <input
              id="userSoundId"
              value="自動分配"
              type="text"
              disabled
              class="form-control"
            />
          </div>
        </div>
        <div class="modal-footer rounded-0">
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click.prevent="closeModal('postModal')"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-outline-teal"
            @click.prevent="post"
          >
            確定
          </button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data: () => ({
    maxWidth: 0,
  }),
  computed: {
    ...mapState('oauth', ['user']),
    ...mapState(['features']),
  },
  methods: {
    beforeOpen() {
      this.maxWidth = window.innerWidth - 30;
    },
    closeModal(modal) {
      this.$store.commit('modal/CLOSE_MODAL', { modal });
    },
    async post() {
      this.$store.commit('SET_LOADING', { status: '特徵上傳中', active: true });
      await this.$store.dispatch('member/createMember', {
        id: this.user.id,
        name: this.user.name,
        email: this.user.email,
        features: this.features,
      });
      this.$store.commit('SET_LOADING', { status: '', active: false });
      this.$store.commit('modal/CLOSE_MODAL', { modal: 'postModal' });
    },
  },
};
</script>
