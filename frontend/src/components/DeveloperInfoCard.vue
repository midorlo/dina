<template>
  <v-card v-if="isDeveloper">
    <v-card-title v-if="$slots.title">
      <slot name="title" />
    </v-card-title>
    <v-card-text>
      <slot />
    </v-card-text>
    <v-card-actions v-if="$slots.actions">
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { Role } from '@/types';

const authStore = useAuthStore();
const { currentUser } = storeToRefs(authStore);

const isDeveloper = computed(() => currentUser.value?.role === Role.Developer);
</script>
