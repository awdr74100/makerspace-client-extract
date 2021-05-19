<template>
  <loading :active="loading.active" :is-full-page="true" :opacity="0.7">
    <slot name="default">
      <div class="d-flex flex-column align-items-center">
        <span class="h3">
          <span class="text-secondary">
            <font-awesome-icon :icon="['fas', 'spinner']" spin />
          </span>
        </span>
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
