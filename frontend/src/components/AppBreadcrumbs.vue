<template>
  <!-- Inherits classes/attrs (e.g., ms-2) from parent -->
  <v-breadcrumbs :items="items" v-bind="$attrs" />
  <!-- If you prefer to hide when empty, replace with:
  <v-breadcrumbs v-if="items.length" :items="items" v-bind="$attrs" />
  -->
</template>

<script setup lang="ts">
import { useBreadcrumbs } from '@/composables/useBreadcrumbs';

const { breadcrumbItems } = useBreadcrumbs();
const items = breadcrumbItems;
</script>
