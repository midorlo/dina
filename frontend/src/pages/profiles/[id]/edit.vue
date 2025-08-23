<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" lg="6" md="8" sm="10">
        <v-card class="pa-6" flat rounded="xl">
          <v-card-title class="text-h4 font-weight-bold text-center mb-4">User Profile</v-card-title>
          <v-card-subtitle class="text-center mb-6">Manage your account settings</v-card-subtitle>

          <template v-if="loading">
            <v-skeleton-loader type="avatar, article, actions" />
          </template>
          <template v-else-if="user">
            <v-sheet class="pa-4 mb-6 text-center" rounded="lg">
              <v-avatar class="mb-4" color="grey-lighten-2" size="120">
                <v-img :src="user.avatarUrl" />
              </v-avatar>
              <div class="text-h5 font-weight-bold">{{ user.username }}</div>
              <div class="text-subtitle-1 text-medium-emphasis">Username</div>
              <div class="text-subtitle-2">{{ user.location }}</div>
            </v-sheet>

            <v-form @submit.prevent="saveProfile">
              <v-sheet class="pa-4 mb-6" rounded="lg">
                <v-card-title class="text-h6 font-weight-bold mb-4">Personal Information</v-card-title>
                <v-text-field
                  v-model="user.username"
                  class="mb-4"
                  density="comfortable"
                  disabled
                  label="Username"
                  prepend-inner-icon="mdi-account-circle-outline"
                  readonly
                  rounded="pill"
                  variant="outlined"
                />

                <v-textarea
                  v-model="user.bio"
                  class="mb-4"
                  density="comfortable"
                  label="About Me"
                  prepend-inner-icon="mdi-information-outline"
                  rounded="lg"
                  rows="3"
                  variant="outlined"
                />

                <v-text-field
                  v-model="user.location"
                  class="mb-4"
                  density="comfortable"
                  label="Location"
                  prepend-inner-icon="mdi-map-marker"
                  rounded="pill"
                  variant="outlined"
                />
              </v-sheet>

              <v-sheet class="pa-4 mb-6" rounded="lg">
                <v-card-title class="text-h6 font-weight-bold mb-4">Change Password</v-card-title>

                <v-text-field
                  v-model="password.current"
                  class="mb-4"
                  density="comfortable"
                  label="Current Password"
                  prepend-inner-icon="mdi-lock-outline"
                  rounded="pill"
                  type="password"
                  variant="outlined"
                />

                <v-text-field
                  v-model="password.new"
                  class="mb-4"
                  density="comfortable"
                  label="New Password"
                  prepend-inner-icon="mdi-lock-plus-outline"
                  rounded="pill"
                  type="password"
                  variant="outlined"
                />

                <v-text-field
                  v-model="password.confirm"
                  class="mb-4"
                  density="comfortable"
                  label="Confirm New Password"
                  prepend-inner-icon="mdi-lock-check-outline"
                  rounded="pill"
                  type="password"
                  variant="outlined"
                />
              </v-sheet>

              <v-btn block class="mt-4" color="primary" rounded="pill" size="large" type="submit"> Save Changes </v-btn>
            </v-form>
          </template>
          <template v-else>
            <v-alert type="error">Error loading profile. Please try again.</v-alert>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { Role } from '@/types';

definePage({
  meta: { roles: [Role.User], layout: 'default' }
});

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const profileId = computed(() => (route.params as any).id as string);

const password = reactive({
  current: '',
  new: '',
  confirm: ''
});

const loading = ref(true);
const user = computed(() => authStore.userProfile);

onMounted(async () => {
  if (profileId.value !== authStore.currentUser?.id) {
    router.replace('/error/403');
    return;
  }

  loading.value = true;
  try {
    const { fetchProfile } = await import('@/services/users');
    const profile = await fetchProfile(profileId.value);
    authStore.updateProfile(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
  } finally {
    loading.value = false;
  }
});

async function saveProfile() {
  if (user.value) {
    try {
      const { updateProfile: updateProfileApi } = await import('@/services/users');
      const updatedProfile = await updateProfileApi(user.value);
      authStore.updateProfile(updatedProfile);
      console.log('Profile saved successfully!', updatedProfile);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  }
}
</script>
