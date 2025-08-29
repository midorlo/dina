<template>
  <v-container class="fill-height" max-width="900">
    <div>
      <div class="mb-8 text-center">
        <div class="text-body-2 font-weight-light mb-n1">This is</div>
        <v-img class="mb-4" cover height="200" src="@/assets/medina-text-logo.webp" />
      </div>

      <v-row>
        <v-col class="text-center" cols="12">
          <template v-if="authStore.isLoggedIn">
            <h2 class="text-h5 font-weight-bold mb-4">Willkommen zurück, {{ authStore.currentUser?.name }}!</h2>
            <p class="text-body-1">Schön, dich wiederzusehen.</p>
          </template>
          <template v-else>
            <h2 class="text-h5 font-weight-bold mb-4">Willkommen !</h2>
            <p class="text-body-1 mb-4">
              Bitte <router-link class="text-decoration-none text-primary" to="/login">logge dich ein</router-link> oder
              <router-link class="text-decoration-none text-primary" to="/register">registriere dich</router-link>, um
              alle Funktionen zu nutzen.
            </p>
          </template>
        </v-col>
      </v-row>

      <v-row>
        <v-col v-for="link in links" :key="link.href" cols="6">
          <v-card
            append-icon="mdi-open-in-new"
            class="py-4"
            color="surface-variant"
            :href="link.href"
            :prepend-icon="link.icon"
            rel="noopener noreferrer"
            rounded="lg"
            :subtitle="link.subtitle"
            target="_blank"
            :title="link.title"
            variant="tonal"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth';
import { Role } from '@/types';

const authStore = useAuthStore();

definePage({
  meta: { roles: [Role.Any], layout: 'default', breadcrumb: 'Home' }
});

const links = [
  {
    href: 'https://vuetifyjs.com/',
    icon: 'mdi-text-box-outline',
    subtitle: 'Learn about all things Vuetify in our documentation.',
    title: 'Documentation'
  },
  {
    href: 'https://vuetifyjs.com/introduction/why-vuetify/#feature-guides',
    icon: 'mdi-star-circle-outline',
    subtitle: 'Explore available framework Features.',
    title: 'Features'
  },
  {
    href: 'https://vuetifyjs.com/components/all',
    icon: 'mdi-widgets-outline',
    subtitle: 'Discover components in the API Explorer.',
    title: 'Components'
  },
  {
    href: 'https://discord.vuetifyjs.com',
    icon: 'mdi-account-group-outline',
    subtitle: 'Connect with Vuetify developers.',
    title: 'Community'
  }
];
</script>
