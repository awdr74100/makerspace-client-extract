<template>
  <loading :active="loading.active" :is-full-page="true" :opacity="0.7">
    <slot name="default">
      <div class="d-flex flex-column align-items-center">
        <div class="mb-1">
          <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <span class="text-secondary">{{ loading.status }}</span>
      </div>
    </slot>
  </loading>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['loading']),
  },
};
</script>
