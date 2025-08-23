<template>
  <v-btn aria-label="Benutzerkonto" class="app-bar-icon-btn text-none me-2" height="48" icon slim title="Benutzerkonto">
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
          v-if="currentUser"
          link
          prepend-icon="mdi-account"
          title="Profil bearbeiten"
          :to="`/profiles/${currentUser.id}/edit`"
        />
        <v-list-item prepend-icon="{{ ICON_LOGOUT }}" title="Logout" @click="authStore.logout()" />
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const { currentUser } = storeToRefs(authStore);
</script>
