<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" lg="6" md="8" sm="10">
        <v-card class="pa-6" flat rounded="xl">
          <v-card-title class="text-h4 font-weight-bold text-center mb-4"> User Profile </v-card-title>

          <template v-if="loading">
            <v-skeleton-loader type="avatar, article, actions" />
          </template>
          <template v-else-if="profile">
            <v-sheet class="pa-4 mb-6 text-center" rounded="lg">
              <v-avatar class="mb-4" color="grey-lighten-2" size="120">
                <v-img :src="profile.avatarUrl" />
              </v-avatar>
              <div class="text-h5 font-weight-bold">{{ profile.username }}</div>
              <div class="text-subtitle-1 text-medium-emphasis">{{ profile.bio }}</div>
            </v-sheet>

            <v-sheet class="pa-4 mb-6" rounded="lg">
              <v-card-title class="text-h6 font-weight-bold mb-4"> Personal Information </v-card-title>
              <v-list-item>
                <v-list-item-title>About Me</v-list-item-title>
                <v-list-item-subtitle>{{ profile.bio }}</v-list-item-subtitle>
              </v-list-item>
            </v-sheet>

            <v-btn
              v-if="profileId === currentUser?.id"
              block
              class="mt-4"
              color="secondary"
              rounded="pill"
              size="large"
              :to="`/profiles/${profileId}/edit`"
            >
              Edit Profile
            </v-btn>
            <v-btn block class="mt-4" color="primary" rounded="pill" size="large" to="/profiles"> Go Back </v-btn>
          </template>
          <template v-else>
            <v-empty-state icon="mdi-account-off-outline" title="Profile not found" />
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchProfile } from '@/services/profiles';
import { useAuthStore } from '@/stores/auth'; // New import
import { type Profile, Role } from '@/types';

interface ProfileRouteParams {
  id: string;
}

definePage({
  meta: { roles: [Role.Any], layout: 'default' }
});

const route = useRoute();
const profileId = computed(() => (route.params as unknown as ProfileRouteParams).id);

const profile = ref<Profile | null>(null);
const loading = ref(true);

const authStore = useAuthStore(); // New
const { currentUser } = storeToRefs(authStore); // New

onMounted(async () => {
  profile.value = (await fetchProfile(profileId.value)) || null;
  loading.value = false;
});
</script>
