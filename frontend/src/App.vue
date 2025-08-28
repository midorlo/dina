<template>
  <v-app>
    <router-view v-slot="{ Component, route }">
      <!-- Only re-render when the layout actually changes -->
      <component :is="Component" :key="route.meta?.layout" />
    </router-view>
  </v-app>
</template>

<script lang="ts" setup>
//
</script>
