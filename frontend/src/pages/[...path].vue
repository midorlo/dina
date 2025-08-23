<template>
  <v-container class="py-10">
    <h1 class="text-h4 mb-4">Debug Page</h1>
    <p class="mb-2">Full Path: {{ route.fullPath }}</p>
    <pre>{{ JSON.stringify({ params: route.params, query: route.query }, null, 2) }}</pre>
  </v-container>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { Role } from '@/types';

definePage({
  meta: {
    roles: [Role.Developer],
    layout: 'empty',
    breadcrumb: 'Debug'
  }
});

const route = useRoute();
</script>
