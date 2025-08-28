<template>
  <v-layout>
    <v-app-bar flat height="56">
      <v-progress-linear absolute :active="loading" bottom color="primary" :indeterminate="loading" />
      <app-breadcrumbs class="ms-2" />
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { loading } from '@/router/index.ts';
</script>
