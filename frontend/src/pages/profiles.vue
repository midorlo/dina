<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card flat rounded="xl">
          <v-card-title class="pa-6">
            <v-row align="center">
              <v-col cols="12" md="8">
                Profiles
              </v-col>
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
                :prepend-avatar="profile.avatar"
                rounded="xl"
                :title="profile.name"
              >
                <template #append>
                  <div class="d-flex align-center">
                    <v-icon v-if="profile.status === 'online'" color="success" icon="mdi-circle" size="8" />
                    <span v-if="profile.status === 'online'" class="ms-2 text-body-2">Online</span>
                    <span v-else class="ms-2 text-body-2 text-disabled">{{ profile.lastSeen }}</span>
                  </div>
                </template>
              </v-list-item>
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
  import { computed, ref } from 'vue'

  const search = ref('')
  const page = ref(1)
  const itemsPerPage = 10

  const profiles = ref([
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', avatar: 'https://i.pravatar.cc/150?img=1', status: 'online', lastSeen: '' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', avatar: 'https://i.pravatar.cc/150?img=2', status: 'offline', lastSeen: '2 hours ago' },
    { id: 3, name: 'Peter Jones', email: 'peter.jones@example.com', avatar: 'https://i.pravatar.cc/150?img=3', status: 'online', lastSeen: '' },
    { id: 4, name: 'Mary Williams', email: 'mary.williams@example.com', avatar: 'https://i.pravatar.cc/150?img=4', status: 'offline', lastSeen: 'yesterday' },
    { id: 5, name: 'David Brown', email: 'david.brown@example.com', avatar: 'https://i.pravatar.cc/150?img=5', status: 'online', lastSeen: '' },
    { id: 6, name: 'Susan Davis', email: 'susan.davis@example.com', avatar: 'https://i.pravatar.cc/150?img=6', status: 'offline', lastSeen: '30 minutes ago' },
    { id: 7, name: 'Michael Miller', email: 'michael.miller@example.com', avatar: 'https://i.pravatar.cc/150?img=7', status: 'online', lastSeen: '' },
    { id: 8, name: 'Linda Wilson', email: 'linda.wilson@example.com', avatar: 'https://i.pravatar.cc/150?img=8', status: 'offline', lastSeen: '1 hour ago' },
    { id: 9, name: 'Robert Moore', email: 'robert.moore@example.com', avatar: 'https://i.pravatar.cc/150?img=9', status: 'online', lastSeen: '' },
    { id: 10, name: 'Patricia Taylor', email: 'patricia.taylor@example.com', avatar: 'https://i.pravatar.cc/150?img=10', status: 'offline', lastSeen: 'today' },
    { id: 11, name: 'James Anderson', email: 'james.anderson@example.com', avatar: 'https://i.pravatar.cc/150?img=11', status: 'online', lastSeen: '' },
    { id: 12, name: 'Barbara Thomas', email: 'barbara.thomas@example.com', avatar: 'https://i.pravatar.cc/150?img=12', status: 'offline', lastSeen: '5 hours ago' },
    { id: 13, name: 'William Jackson', email: 'william.jackson@example.com', avatar: 'https://i.pravatar.cc/150?img=13', status: 'online', lastSeen: '' },
    { id: 14, name: 'Elizabeth White', email: 'elizabeth.white@example.com', avatar: 'https://i.pravatar.cc/150?img=14', status: 'offline', lastSeen: '2 days ago' },
    { id: 15, name: 'Richard Harris', email: 'richard.harris@example.com', avatar: 'https://i.pravatar.cc/150?img=15', status: 'online', lastSeen: '' },
  ])

  const filteredProfiles = computed(() => {
    if (!search.value) {
      return profiles.value
    }
    return profiles.value.filter(profile =>
      profile.name.toLowerCase().includes(search.value.toLowerCase())
      || profile.email.toLowerCase().includes(search.value.toLowerCase()),
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

<style scoped>

</style>
