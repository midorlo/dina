<template>
  <v-btn
    aria-label="Benachrichtigungen"
    class="app-bar-icon-btn text-none me-2"
    height="48"
    icon
    slim
    title="Benachrichtigungen"
    to="/notifications"
  >
    <v-badge color="error" :content="unreadCount" :model-value="unreadCount > 0" rounded="pill">
      <v-icon>{{ ICON_BELL_OUTLINE }}</v-icon>
    </v-badge>
  </v-btn>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useNotificationsStore } from '@/stores/notifications';

const notificationsStore = useNotificationsStore();
const { unreadCount } = storeToRefs(notificationsStore);
</script>
