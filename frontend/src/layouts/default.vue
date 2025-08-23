<template>
  <v-layout>
    <v-navigation-drawer
      v-model="drawer"
      color="surface-variant"
      :expand-on-hover="mdAndUp"
      fixed
      mobile-breakpoint="md"
      :rail="mdAndUp"
      width="256"
    >
      <v-list nav>
        <template
          v-for="(item, index) in navigationMenuItems"
          :key="(item as any).to || (item as any).title || `it-${index}`"
        >
          <v-divider v-if="item.type === 'divider'" />
          <v-list-item v-else v-bind="item" />
        </template>
      </v-list>

      <template #append />
    </v-navigation-drawer>

    <v-app-bar flat height="56">
      <v-progress-linear absolute :active="loading" bottom color="primary" :indeterminate="loading" />
      <v-app-bar-nav-icon
        v-if="showAppBarNavIcon"
        aria-label="Menü öffnen/schließen"
        title="Menü"
        @click="drawer = !drawer"
      />

      <v-breadcrumbs class="ms-2" :items="breadcrumbItems" />

      <v-spacer />

      <template #append>
        <v-btn
          aria-label="Theme umschalten"
          class="app-bar-icon-btn text-none me-2"
          height="48"
          icon
          slim
          title="Theme umschalten"
          @click="toggleTheme"
        >
          <v-icon>mdi-theme-light-dark</v-icon>
        </v-btn>

        <v-btn
          v-if="authStore.isLoggedIn"
          aria-label="Benachrichtigungen"
          class="app-bar-icon-btn text-none me-2"
          height="48"
          icon
          slim
          title="Benachrichtigungen"
          to="/notifications"
        >
          <v-badge color="error" :content="unreadCount" :model-value="unreadCount > 0" rounded="pill">
            <v-icon>mdi-bell-outline</v-icon>
          </v-badge>
        </v-btn>

        <v-btn
          v-if="authStore.isLoggedIn"
          aria-label="Benutzerkonto"
          class="app-bar-icon-btn text-none me-2"
          height="48"
          icon
          slim
          title="Benutzerkonto"
        >
          <v-avatar v-if="currentUser?.avatarUrl" :image="currentUser.avatarUrl" size="32" />
          <v-avatar v-else color="surface-light" size="32">
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>

          <v-menu activator="parent">
            <v-list nav>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">
                  {{ currentUser?.name ?? 'Profil' }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ currentUser?.email ?? '' }}</v-list-item-subtitle>
              </v-list-item>
              <v-divider />
              <v-list-item
                append-icon="mdi-account"
                link
                title="Profile"
                :to="currentUser ? `/profiles/${currentUser.id}/edit` : undefined"
              />
              <v-list-item append-icon="mdi-logout" title="Logout" @click="authStore.logout()" />
            </v-list>
          </v-menu>
        </v-btn>

        <v-btn
          v-else-if="authStore.isGuest"
          aria-label="Login"
          class="app-bar-icon-btn text-none me-2"
          height="48"
          icon
          slim
          title="Login"
          to="/login"
        >
          <v-icon>mdi-login</v-icon>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main class="overflow-y-auto">
      <router-view v-slot="{ Component }">
        <v-fade-transition mode="out-in">
          <component :is="Component" />
        </v-fade-transition>
      </router-view>
    </v-main>

    <app-footer />

    <v-snackbar v-model="visible" :color="color" location="bottom right" rounded="pill" :timeout="timeout">
      {{ message }}
    </v-snackbar>
  </v-layout>
</template>

<script setup lang="ts">
import type { MenuItem } from '@/types/menuData.ts';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import { useDisplay, useTheme } from 'vuetify';
import { useBreadcrumbs } from '@/composables/useBreadcrumbs';
import { loading } from '@/router/index.ts';
import { getMenuItems } from '@/services/menu';
import { useAuthStore } from '@/stores/auth';
import { useNotificationsStore } from '@/stores/notifications';
import { useSnackbarStore } from '@/stores/snackbar';
import { Role } from '@/data/mock-data.ts';

const snackbarStore = useSnackbarStore();
const { message, color, visible, timeout } = storeToRefs(snackbarStore);

const drawer = ref<boolean>(true);
const theme = useTheme();
const route = useRoute();

// --- Breadcrumbs ---
const { breadcrumbItems } = useBreadcrumbs();

// --- Display / Drawer Behavior ---
const { mdAndUp } = useDisplay();
const showAppBarNavIcon = computed(() => !mdAndUp.value);

// Initialzustand abhängig von Breakpoint
onMounted(() => {
  drawer.value = mdAndUp.value;
});

// Drawer-Status bei Breakpoint-Wechsel anpassen
watch(
  () => mdAndUp.value,
  isMdUp => {
    // auf großen Screens offen halten, auf kleinen schließen
    drawer.value = isMdUp;
  }
);

// Bei Navigation auf kleinen Screens den Drawer schließen (Focus/UX)
watch(
  () => route.fullPath,
  () => {
    if (!mdAndUp.value) drawer.value = false;
  }
);

// --- Notifications ---
const notificationsStore = useNotificationsStore();
const { unreadCount } = storeToRefs(notificationsStore);

// --- Theme Umschalten ---
function toggleTheme(): void {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
}

// --- Auth ---
const authStore = useAuthStore();
const { currentUser } = storeToRefs(authStore);

// --- Menüfilterung & Keying ---
const navigationMenuItems = computed<MenuItem[]>(() => {
  return getMenuItems(authStore.currentUser?.role || Role.Guest, authStore.currentUser?.id);
});
</script>

<style scoped>
.v-navigation-drawer--rail .v-list-subheader span {
  display: none;
}
</style>
