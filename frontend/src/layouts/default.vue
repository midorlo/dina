<template>
  <v-layout>
    <v-navigation-drawer
      v-model="drawer"
      app
      color="surface-variant"
      :expand-on-hover="$vuetify.display.mdAndUp"
      fixed
      mobile-breakpoint="md"
      :rail="$vuetify.display.mdAndUp"
      width="256"
    >
      <v-list nav>
        <template v-for="(item, index) in filteredItems" :key="index">
          <v-divider v-if="item.type === 'divider'" />
          <v-list-item v-else v-bind="item" />
        </template>
      </v-list>

      <template #append />
    </v-navigation-drawer>

    <v-app-bar app flat height="56">
      <v-progress-linear
        absolute
        :active="loading"
        bottom
        color="primary"
        :indeterminate="loading"
      />
      <v-app-bar-nav-icon v-if="showAppBarNavIcon" @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-breadcrumbs class="ms-2" :items="breadcrumbItems" />

      <v-spacer />

      <template #append>
        <v-btn class="app-bar-icon-btn text-none me-2" height="48" icon slim @click="toggleTheme">
          <v-icon>mdi-theme-light-dark</v-icon>
        </v-btn>

        <v-btn
          v-if="currentUser"
          class="app-bar-icon-btn text-none me-2"
          height="48"
          icon
          slim
          to="/notifications"
        >
          <v-badge
            color="error"
            :content="unreadCount"
            :model-value="unreadCount > 0"
            rounded="pill"
          >
            <v-icon>mdi-bell-outline</v-icon>
          </v-badge>
        </v-btn>

        <v-btn v-if="currentUser" class="app-bar-icon-btn text-none me-2" height="48" icon slim>
          <v-avatar v-if="currentUser.avatarUrl" :image="currentUser.avatarUrl" size="32" />
          <v-avatar v-else color="surface-light" size="32">
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>

          <v-menu activator="parent">
            <v-list nav>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">
                  {{ currentUser.name }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ currentUser.email }}</v-list-item-subtitle>
              </v-list-item>
              <v-divider />
              <v-list-item
                append-icon="mdi-account"
                link
                title="Profile"
                :to="`/profiles/${currentUser.id}/edit`"
              />
              <v-list-item append-icon="mdi-logout" title="Logout" @click="logout" />
            </v-list>
          </v-menu>
        </v-btn>

        <v-btn v-else class="app-bar-icon-btn text-none me-2" height="48" icon slim to="/login">
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

    <v-snackbar
      v-model="visible"
      :color="color"
      location="bottom right"
      rounded="pill"
      :timeout="timeout"
    >
      {{ message }}
    </v-snackbar>
  </v-layout>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { menu } from '@/config/menu'
import { loading } from '@/router/loading'
import { filterMenuByRole, useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'
import { useSnackbarStore } from '@/stores/snackbar' // New import
import { Role } from '@/types'

const snackbarStore = useSnackbarStore() // New
const { message, color, visible, timeout } = storeToRefs(snackbarStore) // New

const drawer = ref(true)
const theme = useTheme()
const route = useRoute()
const router = useRouter()

const breadcrumbItems = computed(() => {
  if (route.matched.length <= 1) return []

  const items = [{ title: 'Dina', disabled: false, to: '/' }]
  const records = route.matched.slice(1)

  for (const [index, record] of records.entries()) {
    const segment = record.path.split('/').findLast(Boolean) ?? ''

    const paramMatches = [...segment.matchAll(/:([^/-]+)/g)].map((m) => m[1])
    const slugParam = paramMatches.at(-1)
    let title =
      record.meta?.breadcrumb ||
      (slugParam && typeof route.params[slugParam] === 'string' ? route.params[slugParam] : segment)

    title = title
      .replace(/[:()*]/g, '')
      .replace(/-/g, ' ')
      .replace(/^\w/, (c) => c.toUpperCase())

    const to = router.resolve({ name: record.name, params: route.params }).path

    items.push({
      title,
      disabled: index === records.length - 1,
      to,
    })
  }

  return items
})

const showAppBarNavIcon = computed(() => !$vuetify.display.mdAndUp)

const notificationsStore = useNotificationsStore()
const { unreadCount } = storeToRefs(notificationsStore)

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

const authStore = useAuthStore()
const { currentUser } = storeToRefs(authStore)

function logout() {
  authStore.reset()
  router.push('/login')
}

const filteredItems = computed(() => {
  const items = filterMenuByRole(menu, currentUser.value?.role || Role.Guest).map((item) => ({
    ...item,
    to: typeof item.to === 'function' ? item.to(currentUser.value?.id) : item.to,
  }))

  return items.filter((item, index, array) => {
    if (item.type !== 'divider') return true
    const prev = array[index - 1]
    const next = array[index + 1]
    return prev && prev.type !== 'divider' && next && next.type !== 'divider'
  })
})
</script>

<style>
.v-navigation-drawer__content::-webkit-scrollbar {
  display: none;
}

.v-navigation-drawer__content {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.v-navigation-drawer .v-list-item {
  --indent-padding: 0;
}

.v-navigation-drawer--rail .v-list-subheader span {
  display: none;
}

.app-bar-icon-btn.v-btn--icon:hover > .v-btn__overlay {
  border-radius: 50%;
}
</style>
