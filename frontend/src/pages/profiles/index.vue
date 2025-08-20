<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card flat rounded="xl">
          <v-card-title class="pa-6">
            <v-row align="center">
              <v-col cols="12" md="8"> Profiles </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  clearable
                  flat
                  hide-details
                  label="Search"
                  rounded="pill"
                  single-line
                />
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text class="pa-6">
            <v-list>
              <v-list-item
                v-for="profile in paginatedProfiles"
                :key="profile.id"
                border
                class="mb-4"
                :prepend-avatar="profile.avatarUrl"
                rounded="xl"
                :title="profile.username"
                :to="`/profiles/${profile.id}`"
              />
            </v-list>
          </v-card-text>
          <v-card-actions class="pa-6">
            <div class="text-body-2 text-disabled">{{ paginationInfo }}</div>
            <v-spacer />
            <v-pagination
              v-model="page"
              :length="totalPages"
              rounded="circle"
              show-first-last-page
              :total-visible="5"
            />
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { Profile } from '@/types'
import { computed, ref } from 'vue'

const search = ref('')
const page = ref(1)
const itemsPerPage = 10

const profiles = ref<Profile[]>([
  {
    id: '1',
    userId: '1',
    username: 'john.doe',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    bio: 'I am a software developer from New York.',
  },
  {
    id: '2',
    userId: '2',
    username: 'jane.smith',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    bio: 'I am a data scientist from Berlin.',
  },
  {
    id: '3',
    userId: '3',
    username: 'peter.jones',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    bio: 'I am a software developer from New York.',
  },
  {
    id: '4',
    userId: '4',
    username: 'mary.williams',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
    bio: 'I am a data scientist from Berlin.',
  },
  {
    id: '5',
    userId: '5',
    username: 'david.brown',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    bio: 'I am a full-stack developer from Tokyo.',
  },
  {
    id: '6',
    userId: '6',
    username: 'susan.davis',
    avatarUrl: 'https://i.pravatar.cc/150?img=6',
    bio: 'I am a project manager from Sydney.',
  },
  {
    id: '7',
    userId: '7',
    username: 'michael.miller',
    avatarUrl: 'https://i.pravatar.cc/150?img=7',
    bio: 'I am a QA engineer from Toronto.',
  },
  {
    id: '8',
    userId: '8',
    username: 'linda.wilson',
    avatarUrl: 'https://i.pravatar.cc/150?img=8',
    bio: 'I am a business analyst from Singapore.',
  },
  {
    id: '9',
    userId: '9',
    username: 'robert.moore',
    avatarUrl: 'https://i.pravatar.cc/150?img=9',
    bio: 'I am a DevOps engineer from Mumbai.',
  },
  {
    id: '10',
    userId: '10',
    username: 'patricia.taylor',
    avatarUrl: 'https://i.pravatar.cc/150?img=10',
    bio: 'I am a technical writer from Dublin.',
  },
  {
    id: '11',
    userId: '11',
    username: 'james.anderson',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    bio: 'I am a mobile developer from Seoul.',
  },
  {
    id: '12',
    userId: '12',
    username: 'barbara.thomas',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    bio: 'I am a database administrator from Moscow.',
  },
  {
    id: '13',
    userId: '13',
    username: 'william.jackson',
    avatarUrl: 'https://i.pravatar.cc/150?img=13',
    bio: 'I am a network engineer from Beijing.',
  },
  {
    id: '14',
    userId: '14',
    username: 'elizabeth.white',
    avatarUrl: 'https://i.pravatar.cc/150?img=14',
    bio: 'I am a security analyst from Cairo.',
  },
  {
    id: '15',
    userId: '15',
    username: 'richard.harris',
    avatarUrl: 'https://i.pravatar.cc/150?img=15',
    bio: 'I am a cloud architect from Rio de Janeiro.',
  },
])

const filteredProfiles = computed(() => {
  if (!search.value) {
    return profiles.value
  }
  return profiles.value.filter((profile) =>
    profile.username.toLowerCase().includes(search.value.toLowerCase())
  )
})

const totalPages = computed(() => {
  return Math.ceil(filteredProfiles.value.length / itemsPerPage)
})

const paginatedProfiles = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProfiles.value.slice(start, end)
})

const paginationInfo = computed(() => {
  const start = (page.value - 1) * itemsPerPage + 1
  const end = Math.min(page.value * itemsPerPage, filteredProfiles.value.length)
  return `Showing ${start}-${end} of ${filteredProfiles.value.length}`
})
</script>

<style scoped></style>
