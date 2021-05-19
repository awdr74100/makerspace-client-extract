<template>
  <div id="app">
    <Loading />
    <Modal />
    <router-view></router-view>
  </div>
</template>

<script>
import Loading from '@/components/Loading.vue';
import Modal from '@/components/Modal.vue';

export default {
  components: {
    Loading,
    Modal,
  },
};
</script>

<style lang="scss">
@import '@/assets/scss/all.scss';
</style>
