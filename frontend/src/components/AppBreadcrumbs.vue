<template>
  <!-- Inherits classes/attrs (e.g., ms-2) from parent -->
  <v-breadcrumbs :items="items" v-bind="$attrs">
    <template #title="{ item, index }">
      <img v-if="index === 0" alt="Dina" class="app-breadcrumb-logo" :src="textLogo" />
      <span v-else>{{ item.title }}</span>
    </template>
  </v-breadcrumbs>
  <!-- If you prefer to hide when empty, replace with:
  <v-breadcrumbs v-if="items.length" :items="items" v-bind="$attrs" />
  -->
</template>

<script setup lang="ts">
import textLogo from '@/assets/medina-text-logo.webp';
import { useBreadcrumbs } from '@/composables/useBreadcrumbs';

const { breadcrumbItems } = useBreadcrumbs();
const items = breadcrumbItems;
</script>

<style scoped>
.app-breadcrumb-logo {
  height: 20px;
}
</style>
