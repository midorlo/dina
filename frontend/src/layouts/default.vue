<template>
  <v-layout>
    <v-navigation-drawer
      v-model="drawer"
      color="surface-variant"
      :expand-on-hover="mdAndUp && !uiStore.sidebarPinned"
      fixed
      mobile-breakpoint="md"
      :rail="mdAndUp && !uiStore.sidebarPinned"
      width="256"
    >
      <v-list nav>
        <template
          v-for="(item, index) in navigationMenuItems"
          :key="(item as any).to || (item as any).title || `it-${index}`"
        >
          <v-divider v-if="item.type === 'divider'" />
          <v-list-item v-else v-bind="item">
            <template #append>
              <v-badge
                v-if="isConversationsItem(item)"
                color="error"
                :content="unreadConversationsCount"
                inline
                :model-value="unreadConversationsCount > 0"
              />
            </template>
          </v-list-item>
        </template>
      </v-list>

      <template #append>
        <v-divider v-if="mdAndUp" />
        <v-list v-if="mdAndUp" nav>
          <v-list-item
            aria-label="Theme umschalten"
            link
            prepend-icon="mdi-theme-light-dark"
            rounded="lg"
            :title="'Theme umschalten'"
            @click="toggleTheme"
          />
          <v-list-item
            aria-label="Sidebar anheften/lösen"
            link
            :prepend-icon="!uiStore.sidebarPinned ? 'mdi-pin-outline' : undefined"
            rounded="lg"
            :title="uiStore.sidebarPinned ? 'Sidebar gepinnt' : 'Sidebar anheften'"
            @click="uiStore.toggleSidebarPinned()"
          >
            <template v-if="uiStore.sidebarPinned" #prepend>
              <v-avatar class="me-3" color="primary" size="28">
                <v-icon color="white">mdi-pin</v-icon>
              </v-avatar>
            </template>
            <template v-if="!isRail" #title>
              <span>{{ uiStore.sidebarPinned ? 'Sidebar gepinnt' : 'Sidebar anheften' }}</span>
            </template>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-app-bar flat height="56">
      <v-progress-linear absolute :active="loading" bottom color="primary" :indeterminate="loading" />
      <v-app-bar-nav-icon aria-label="Menü öffnen/schließen" title="Menü" @click="onNavToggle" />

      <app-breadcrumbs class="ms-2" />

      <v-spacer />

      <template #append>
        <NotificationsList />

        <v-btn
          v-if="authStore.isLoggedIn"
          aria-label="Benutzerkonto"
          class="app-bar-icon-btn text-none me-2"
          height="48"
          icon
          slim
          title="Benutzerkonto"
        >
          <v-avatar
            v-if="currentUser?.avatarUrl"
            :alt="currentUser?.name || 'Avatar'"
            :image="currentUser.avatarUrl"
            size="32"
          />
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
          v-if="authStore.isGuest"
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
import { loading } from '@/router/index.ts';
import { getMenuItems } from '@/services/menu';
import { useAuthStore } from '@/stores/auth';
import { useConversationsStore } from '@/stores/conversations';
import { useNotificationsStore } from '@/stores/notifications';
import { useSnackbarStore } from '@/stores/snackbar';
import { useUiStore } from '@/stores/ui';
import { Role } from '@/types';

const snackbarStore = useSnackbarStore();
const { message, color, visible, timeout } = storeToRefs(snackbarStore);

const drawer = ref<boolean>(true);
const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);
const route = useRoute();

// --- Breadcrumbs --- handled by <app-breadcrumbs /> component

// --- Display / Drawer Behavior ---
const { mdAndUp } = useDisplay();
// On desktop show nav icon to toggle pin like YouTube; on mobile toggle drawer
const showAppBarNavIcon = computed(() => true);

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
const conversationsStore = useConversationsStore();
const { unreadCount: unreadConversationsCount } = storeToRefs(conversationsStore);
const uiStore = useUiStore();

onMounted(() => {
  notificationsStore.load?.();
  conversationsStore.load?.();
});

// --- Theme Umschalten ---
function toggleTheme(): void {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
}

function onNavToggle(): void {
  if (mdAndUp.value) {
    uiStore.toggleSidebarPinned();
  } else {
    drawer.value = !drawer.value;
  }
}

// --- Auth ---
const authStore = useAuthStore();
const { currentUser } = storeToRefs(authStore);

// --- Menüfilterung & Keying ---
type ResolvedMenuItem = Omit<MenuItem, 'to'> & { to?: string };
const navigationMenuItems = computed<ResolvedMenuItem[]>(() => {
  return getMenuItems(
    authStore.currentUser?.role || Role.Guest,
    authStore.currentUser?.id
  ) as unknown as ResolvedMenuItem[];
});

const isRail = computed(() => mdAndUp.value && !uiStore.sidebarPinned);
const isConversationsItem = (item: ResolvedMenuItem) => item.to === '/conversations';
</script>

<style scoped>
.v-navigation-drawer--rail .v-list-subheader span {
  display: none;
}
</style>
