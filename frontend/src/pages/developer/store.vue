<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card flat rounded="xl">
          <v-card-title class="pa-6">Auth Store</v-card-title>
          <v-card-text class="pa-6">
            <h3>Current User:</h3>
            <pre>{{ JSON.stringify(currentUser, null, 2) }}</pre>

            <h3>User Profile:</h3>
            <pre>{{ JSON.stringify(userProfile, null, 2) }}</pre>

            <h3>Tokens:</h3>
            <pre>{{ JSON.stringify(tokens, null, 2) }}</pre>
          </v-card-text>
          <v-card-actions class="pa-6">
            <v-btn color="primary" @click="resetAuth">Reset Auth</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-4">
      <v-col>
        <v-card flat rounded="xl">
          <v-card-title class="pa-6">Notifications Store</v-card-title>
          <v-card-text class="pa-6">
            <h3>Items:</h3>
            <pre>{{ JSON.stringify(items, null, 2) }}</pre>

            <h3>Unread Count:</h3>
            <pre>{{ unreadCount }}</pre>
          </v-card-text>
          <v-card-actions class="pa-6">
            <v-btn color="primary" @click="resetNotifications">Reset Notifications</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'
import { Role } from '@/types'
definePage({
  meta: { roles: [Role.Developer] },
})

const authStore = useAuthStore()
const notificationsStore = useNotificationsStore()
const { currentUser, userProfile, tokens } = storeToRefs(authStore)
const { items, unreadCount } = storeToRefs(notificationsStore)

function resetAuth() {
  authStore.reset()
}

function resetNotifications() {
  notificationsStore.reset()
}
</script>

<style scoped>
pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
  overflow-x: auto;
}
</style>
