<template>
  <v-container>
    <h1 class="text-h4 mb-4">Notifications for {{ profileId }}</h1>
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
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useNotificationsStore } from '@/stores/notifications';
import { Role } from '@/types';
import { sanitize } from '@/utils/sanitize';

definePage({
  meta: { roles: [Role.Administrator], layout: 'default' }
});

const route = useRoute();
const profileId = computed(() => (route.params as any).id as string);
const notificationsStore = useNotificationsStore();
const { items } = storeToRefs(notificationsStore);
const { handleNotificationClick } = notificationsStore;

onMounted(() => {
  notificationsStore.load?.();
});
</script>

<style scoped>
.notification-read {
  background-color: #f5f5f5;
  opacity: 0.7;
}

@media (prefers-color-scheme: dark) {
  .notification-read {
    background-color: #2e2e2e;
  }
}
</style>
