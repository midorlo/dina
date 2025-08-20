<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card flat rounded="xl">
          <v-card-title class="pa-6">App Store State</v-card-title>
          <v-card-text class="pa-6">
            <h3>Current User:</h3>
            <pre>{{ JSON.stringify(currentUser, null, 2) }}</pre>

            <h3>User Profile:</h3>
            <pre>{{ JSON.stringify(userProfile, null, 2) }}</pre>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { currentUser, userProfile } = storeToRefs(authStore)
</script>

<style scoped>
pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
  overflow-x: auto;
}
</style>
