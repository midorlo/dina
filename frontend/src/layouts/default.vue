<template>
  <v-layout>
    <v-navigation-drawer
      v-model="drawer"
      color="surface-variant"
      :expand-on-hover="$vuetify.display.mdAndUp"
      fixed
      mobile-breakpoint="md"
      :rail="$vuetify.display.mdAndUp"
      width="256"
    >
      <v-list item-props :items="items" nav />

      <template #append />
    </v-navigation-drawer>

    <v-app-bar absolute flat height="56">
      <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown" @click="drawer = !drawer" />

      <v-app-bar-title v-if="$vuetify.display.mdAndUp">Application</v-app-bar-title>

      <template #append>
        <v-btn
          class="text-none me-2"
          height="48"
          icon
          slim
          @click="toggleTheme"
        >
          <v-icon>mdi-theme-light-dark</v-icon>
        </v-btn>

        <v-btn
          class="text-none me-2"
          height="48"
          icon
          slim
          to="/notifications"
        >
          <v-badge color="error" :content="unreadCount" :model-value="unreadCount > 0">
            <v-icon>mdi-bell-outline</v-icon>
          </v-badge>
        </v-btn>

        <v-btn class="text-none me-2" height="48" icon slim>
          <v-avatar color="surface-light" image="https://cdn.vuetifyjs.com/images/john.png" size="32" />

          <v-menu activator="parent">
            <v-list nav>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">John Doe</v-list-item-title>
                <v-list-item-subtitle>john.doe@example.com</v-list-item-subtitle>
              </v-list-item>
              <v-divider />
              <v-list-item append-icon="mdi-account" link title="Profile" to="/profile" />
              <v-list-item append-icon="mdi-cog-outline" link title="Settings" to="/settings" />
              <v-list-item append-icon="mdi-logout" link title="Logout" />
            </v-list>
          </v-menu>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-layout>
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  import { ref } from 'vue'
  import { useTheme } from 'vuetify'
  import { useNotificationsStore } from '@/stores/notifications'

  const drawer = ref(true)
  const theme = useTheme()

  const notificationsStore = useNotificationsStore()
  const { unreadCount } = storeToRefs(notificationsStore)

  function toggleTheme () {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  }

  const items = ref([
    {
      title: 'Home',
      prependIcon: 'mdi-home',
      to: '/',
    },
    {
      title: 'Login',
      prependIcon: 'mdi-login',
      to: '/login',
    },
    {
      title: 'Register',
      prependIcon: 'mdi-account-plus',
      to: '/register',
    },
    {
      title: 'Profile',
      prependIcon: 'mdi-account',
      to: '/profile',
    },
    {
      title: 'Settings',
      prependIcon: 'mdi-cog-outline',
      to: '/settings',
    },
    {
      title: 'About',
      prependIcon: 'mdi-information-outline',
      to: '/about',
    },
    {
      title: 'Messages',
      prependIcon: 'mdi-message-text-outline',
      to: '/messages',
    },
    {
      title: 'Gallery',
      prependIcon: 'mdi-image-multiple',
      to: '/gallery',
    },
    {
      title: 'Profiles',
      prependIcon: 'mdi-account-group-outline',
      to: '/profiles',
    },
    {
      title: 'Notifications',
      prependIcon: 'mdi-bell-outline',
      to: '/notifications',
    },
    {
      title: 'Error 401',
      prependIcon: 'mdi-alert-circle-outline',
      to: '/401',
    },
    {
      title: 'Error 403',
      prependIcon: 'mdi-alert-octagon-outline',
      to: '/403',
    },
    {
      title: 'Error 404',
      prependIcon: 'mdi-alert-box-outline',
      to: '/404',
    },
  ])
</script>
