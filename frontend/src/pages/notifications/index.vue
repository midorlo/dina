<template>
  <v-container>
    <h1 class="text-h4 mb-4">Notifications</h1>
    <v-alert v-if="error" class="mb-4" type="error">Failed to load notifications</v-alert>
    <v-list v-else lines="three">
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
        <template #subtitle><div v-html="sanitize(item.subtitle)" /></template>
        <template #append>
          <div class="text-caption">{{ item.time }}</div>
        </template>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useNotificationsStore } from '@/stores/notifications';
import { Role } from '@/types';
import { sanitize } from '@/utils/sanitize';

definePage({
  meta: { roles: [Role.User], layout: 'default', breadcrumb: 'Benachrichtigungen' }
});

const notificationsStore = useNotificationsStore();
const { items, error } = storeToRefs(notificationsStore);
const { handleNotificationClick } = notificationsStore;

onMounted(() => {
  // Ensure notifications are loaded when page opens
  notificationsStore.load?.();
});
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
