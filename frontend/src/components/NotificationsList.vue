<template>
  <v-btn
    v-if="isLoggedIn"
    aria-label="Benachrichtigungen"
    class="app-bar-icon-btn text-none me-2"
    height="48"
    icon
    slim
    title="Benachrichtigungen"
  >
    <v-badge :content="unreadCount" :model-value="unreadCount > 0" color="error" rounded="pill">
      <v-icon icon="mdi-bell-outline" />
    </v-badge>

    <v-menu activator="parent" location="bottom end" :close-on-content-click="false" transition="slide-y-transition">
      <v-card class="notifications-menu" min-width="340" max-width="420" elevation="8">
        <v-card-title class="py-3 d-flex align-center justify-space-between">
          <span class="text-subtitle-1">Benachrichtigungen</span>
          <v-chip v-if="unreadCount > 0" color="error" label size="small">{{ unreadCount }}</v-chip>
        </v-card-title>
        <v-divider />

        <div class="notifications-scroll">
          <v-list v-if="items.length > 0" lines="three" density="comfortable" nav>
            <v-list-item
              v-for="item in items"
              :key="item.id"
              class="mb-1 rounded-lg"
              :class="{ 'is-read': item.read }"
              link
              :prepend-avatar="item.avatar"
              @click="onClick(item)"
            >
              <template #title>
                <div class="d-flex align-center gap-2">
                  <span class="text-body-1">{{ item.title }}</span>
                  <v-icon v-if="!item.read" size="10" color="primary" icon="mdi-circle" class="ms-1" />
                </div>
              </template>
              <template #subtitle>
                <div v-html="sanitize(item.subtitle)" />
              </template>
              <template #append>
                <div class="text-caption text-medium-emphasis">{{ item.time }}</div>
              </template>
            </v-list-item>
          </v-list>

          <div v-else class="d-flex flex-column align-center justify-center py-8">
            <v-icon size="36" class="mb-2" icon="mdi-bell-off-outline" />
            <div class="text-medium-emphasis">Keine Benachrichtigungen</div>
          </div>
        </div>

        <v-divider />
        <v-card-actions class="notifications-actions">
          <v-btn variant="text" color="primary" :disabled="unreadCount === 0" @click="markAllRead">
            Alle gelesen
          </v-btn>
          <div class="d-flex align-center gap-2">
            <v-btn variant="text" color="primary" :to="{ path: '/notifications' }">
              Alle ansehen
            </v-btn>
            <v-btn
              v-if="currentUser?.id"
              variant="text"
              color="primary"
              :to="{ path: `/profiles/${currentUser.id}/notifications` }"
            >
              Einstellungen
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-btn>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useNotificationsStore } from '@/stores/notifications';
import type { NotificationItem } from '@/types';
import { sanitize } from '@/utils/sanitize';

const authStore = useAuthStore();
const { currentUser, isLoggedIn } = storeToRefs(authStore);

const notificationsStore = useNotificationsStore();
const { items, unreadCount } = storeToRefs(notificationsStore);
const { handleNotificationClick } = notificationsStore;

function onClick(item: NotificationItem) {
  handleNotificationClick(item);
}

function markAllRead() {
  for (const n of items.value) n.read = true;
}
</script>

<style scoped>
.notifications-menu {
  display: flex;
  flex-direction: column;
}

.notifications-scroll {
  max-height: 420px;
  overflow-y: auto;
}

.notifications-actions {
  position: sticky;
  bottom: 0;
  background: var(--v-theme-surface);
}

.is-read {
  opacity: 0.7;
}
</style>

