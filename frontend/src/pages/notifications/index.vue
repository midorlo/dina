<template>
  <v-container>
    <h1 class="text-h4 mb-4">Notifications</h1>
    <v-list lines="three">
      <v-list-item
        v-for="item in items"
        :key="item.id"
        class="mb-2 rounded-lg"
        :class="{ 'notification-read': item.read }"
        link
        :prepend-avatar="item.avatar"
        @click="handleNotificationClick(item)"
      >
        <template #title>{{ item.title }}</template>
        <template #subtitle><div v-html="item.subtitle" /></template>
        <template #append>
          <div class="text-caption">{{ item.time }}</div>
        </template>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications'
import { Role } from '@/types'

definePage({
  meta: { roles: [Role.User], layout: 'default' },
})

const notificationsStore = useNotificationsStore()
const { items } = storeToRefs(notificationsStore)
const { handleNotificationClick } = notificationsStore
</script>

<style scoped>
.notification-read {
  background-color: #f5f5f5; /* A light grey for read notifications */
  opacity: 0.7;
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .notification-read {
    background-color: #2e2e2e; /* A dark grey for read notifications */
  }
}
</style>
