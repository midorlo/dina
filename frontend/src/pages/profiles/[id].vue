<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" lg="6" md="8" sm="10">
        <v-card class="pa-6" flat rounded="xl">
          <v-card-title class="text-h4 font-weight-bold text-center mb-4"
            >User Profile</v-card-title
          >

          <v-sheet class="pa-4 mb-6 text-center" rounded="lg">
            <v-avatar class="mb-4" color="grey-lighten-2" size="120">
              <v-img :src="profile?.avatarUrl" />
            </v-avatar>
            <div class="text-h5 font-weight-bold">{{ profile?.username }}</div>
            <div class="text-subtitle-1 text-medium-emphasis">{{ profile?.bio }}</div>
          </v-sheet>

          <v-sheet class="pa-4 mb-6" rounded="lg">
            <v-card-title class="text-h6 font-weight-bold mb-4">Personal Information</v-card-title>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>About Me</v-list-item-title>
                <v-list-item-subtitle>{{ profile?.bio }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-sheet>

          <v-btn block class="mt-4" color="primary" rounded="pill" size="large" to="/profiles">
            Go Back
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { Profile } from '@/types'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

interface ProfileRouteParams {
  id: string
}

const route = useRoute()
const profileId = computed(() => (route.params as ProfileRouteParams).id)

const profile = ref<Profile | null>(null)

onMounted(() => {
  // In a real application, you would fetch the profile data from an API
  // For this example, we'll use a mock profile
  profile.value = {
    id: profileId.value,
    userId: profileId.value,
    username: 'john.doe',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    bio: 'I am a software developer from New York.',
  }
})
</script>
