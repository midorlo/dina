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
      <v-list item-props :items="filteredItems" nav />

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
      <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown" @click="drawer = !drawer" />

      <div class="d-flex align-center" style="cursor: pointer" @click="goToHome">
        <v-img alt="Logo" class="ms-2" contain height="40" src="@/assets/logo.svg" width="40" />
      </div>

      <v-breadcrumbs class="ms-2" :items="breadcrumbItems" />

      <v-spacer />

      <template #append>
        <v-btn class="app-bar-icon-btn text-none me-2" height="48" icon slim @click="toggleTheme">
          <v-icon>mdi-theme-light-dark</v-icon>
        </v-btn>

        <v-btn class="app-bar-icon-btn text-none me-2" height="48" icon slim to="/notifications">
          <v-badge
            color="error"
            :content="unreadCount"
            :model-value="unreadCount > 0"
            rounded="pill"
          >
            <v-icon>mdi-bell-outline</v-icon>
          </v-badge>
        </v-btn>

        <v-btn class="app-bar-icon-btn text-none me-2" height="48" icon slim>
          <v-avatar
            color="surface-light"
            image="https://cdn.vuetifyjs.com/images/john.png"
            size="32"
          />

          <v-menu activator="parent">
            <v-list nav>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">John Doe</v-list-item-title>
                <v-list-item-subtitle>john.doe@example.com</v-list-item-subtitle>
              </v-list-item>
              <v-divider />
              <v-list-item
                append-icon="mdi-account"
                link
                title="Profile"
                :to="`/profiles/${currentUser.value?.id}/edit`"
              />
              <!-- Settings removed -->
              <v-list-item append-icon="mdi-logout" title="Logout" @click="logout" />
            </v-list>
          </v-menu>
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
  </v-layout>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import logo from '@/assets/logo.svg'
import { filterMenuByRole, useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'
import { Role } from '@/types'

const drawer = ref(true)
const theme = useTheme()
const loading = ref(false)
const route = useRoute()
const router = useRouter()

const breadcrumbItems = computed(() => {
  const crumbs = []
  if (route.path === '/') {
    return crumbs
  }

  crumbs.push({
    title: 'Dina',
    disabled: false,
    to: '/',
  })

  const pathParts = route.path.split('/').filter(Boolean)
  let currentPath = ''
  for (const [index, part] of pathParts.entries()) {
    currentPath += `/${part}`
    const crumb = {
      title: part.charAt(0).toUpperCase() + part.slice(1),
      disabled: index === pathParts.length - 1,
      to: currentPath,
    }
    crumbs.push(crumb)
  }
  return crumbs
})

function goToHome() {
  router.push('/')
}

router.beforeEach(() => {
  loading.value = true
})

router.afterEach(() => {
  loading.value = false
})

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

const items = computed(() => [
  {
    title: 'Home',
    prependAvatar: logo,
    to: '/',
  },
  {
    title: 'Store',
    prependIcon: 'mdi-store',
    to: '/developer/store',
    roles: [Role.Developer],
  },
  {
    title: 'Login',
    prependIcon: 'mdi-login',
    to: '/login',
    roles: [Role.Guest],
  },
  {
    title: 'Register',
    prependIcon: 'mdi-account-plus',
    to: '/register',
    roles: [Role.Guest],
  },
  {
    title: 'Profile',
    prependIcon: 'mdi-account',
    to: `/profiles/${currentUser.value?.id}/edit`,
    roles: [Role.User],
  },
  {
    title: 'About',
    prependIcon: 'mdi-information-outline',
    to: '/about',
  },
  {
    title: 'Conversations',
    prependIcon: 'mdi-message-text-outline',
    to: '/conversations',
  },
  {
    title: 'Photos',
    prependIcon: 'mdi-image-multiple',
    to: `/photos/${currentUser.value?.id}`,
  },
  {
    title: 'Blogs',
    prependIcon: 'mdi-post-outline',
    to: '/blogs',
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
    roles: [Role.User],
  },
  {
    title: 'Error 401',
    prependIcon: 'mdi-alert-circle-outline',
    to: '/error/401',
  },
  {
    title: 'Error 403',
    prependIcon: 'mdi-alert-octagon-outline',
    to: '/error/403',
  },
  {
    title: 'Error 404',
    prependIcon: 'mdi-alert-box-outline',
    to: '/error/404',
  },
])

const filteredItems = computed(() =>
  filterMenuByRole(items.value, currentUser.value?.role || Role.Guest)
)
</script>

<style>
.v-navigation-drawer__content::-webkit-scrollbar {
  display: none;
}

.v-navigation-drawer__content {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.app-bar-icon-btn.v-btn--icon:hover > .v-btn__overlay {
  border-radius: 50%;
}
</style>
