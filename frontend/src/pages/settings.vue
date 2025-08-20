<template>
  <v-container>
    <h1>Settings Page</h1>
    <p>This is the settings page.</p>
  </v-container>
</template>

<script setup lang="ts">
import { Role } from '@/types'
definePage({
  meta: { roles: [Role.User, Role.Admin] },
})
</script>
