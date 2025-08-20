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
            <template v-if="loading">
              <v-skeleton-loader
                v-for="n in itemsPerPage"
                :key="n"
                class="mb-4"
                type="list-item-avatar-two-line"
              />
            </template>
            <template v-else>
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
                >
                  <template #append>
                    <div class="d-flex align-center">
                      <v-icon
                        v-if="profile.status === 'online'"
                        color="success"
                        icon="mdi-circle"
                        size="8"
                      />
                      <span v-if="profile.status === 'online'" class="ms-2 text-body-2">
                        Online
                      </span>
                      <span v-else class="ms-2 text-body-2 text-disabled">
                        {{ profile.lastSeen }}
                      </span>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </template>
          </v-card-text>
          <v-card-actions v-if="!loading" class="pa-6">
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
import { computed, onMounted, ref } from 'vue'
import { fetchProfiles } from '@/services/profiles'

const search = ref('')
const page = ref(1)
const itemsPerPage = 10

const profiles = ref<Profile[]>([])
const loading = ref(true)

onMounted(async () => {
  profiles.value = await fetchProfiles()
  loading.value = false
})

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
