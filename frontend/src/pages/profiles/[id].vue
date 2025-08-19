<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" lg="6" md="8" sm="10">
        <v-card class="pa-6" flat rounded="xl">
          <v-card-title class="text-h4 font-weight-bold text-center mb-4">User Profile</v-card-title>

          <v-sheet class="pa-4 mb-6 text-center" rounded="lg">
            <v-avatar class="mb-4" color="grey-lighten-2" size="120">
              <v-img :src="user.avatar" />
            </v-avatar>
            <div class="text-h5 font-weight-bold">{{ user.name }}</div>
            <div class="text-subtitle-1 text-medium-emphasis">{{ user.email }}</div>
          </v-sheet>

          <v-sheet class="pa-4 mb-6" rounded="lg">
            <v-card-title class="text-h6 font-weight-bold mb-4">Personal Information</v-card-title>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>About Me</v-list-item-title>
                <v-list-item-subtitle>{{ user.aboutMe }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-sheet>

          <v-btn
            block
            class="mt-4"
            color="primary"
            rounded="pill"
            size="large"
            to="/profiles"
          >
            Go Back
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const userId = Number(route.params.id)

  // In a real application, you would fetch the user data from an API
  // For this example, we'll use the same placeholder data as in the profiles list
  const profiles = ref([
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', avatar: 'https://i.pravatar.cc/150?img=1', status: 'online', lastSeen: '', aboutMe: 'I am a software developer from New York.' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', avatar: 'https://i.pravatar.cc/150?img=2', status: 'offline', lastSeen: '2 hours ago', aboutMe: 'I am a product manager from London.' },
    { id: 3, name: 'Peter Jones', email: 'peter.jones@example.com', avatar: 'https://i.pravatar.cc/150?img=3', status: 'online', lastSeen: '', aboutMe: 'I am a UI/UX designer from Paris.' },
    { id: 4, name: 'Mary Williams', email: 'mary.williams@example.com', avatar: 'https://i.pravatar.cc/150?img=4', status: 'offline', lastSeen: 'yesterday', aboutMe: 'I am a data scientist from Berlin.' },
    { id: 5, name: 'David Brown', email: 'david.brown@example.com', avatar: 'https://i.pravatar.cc/150?img=5', status: 'online', lastSeen: '', aboutMe: 'I am a full-stack developer from Tokyo.' },
    { id: 6, name: 'Susan Davis', email: 'susan.davis@example.com', avatar: 'https://i.pravatar.cc/150?img=6', status: 'offline', lastSeen: '30 minutes ago', aboutMe: 'I am a project manager from Sydney.' },
    { id: 7, name: 'Michael Miller', email: 'michael.miller@example.com', avatar: 'https://i.pravatar.cc/150?img=7', status: 'online', lastSeen: '', aboutMe: 'I am a QA engineer from Toronto.' },
    { id: 8, name: 'Linda Wilson', email: 'linda.wilson@example.com', avatar: 'https://i.pravatar.cc/150?img=8', status: 'offline', lastSeen: '1 hour ago', aboutMe: 'I am a business analyst from Singapore.' },
    { id: 9, name: 'Robert Moore', email: 'robert.moore@example.com', avatar: 'https://i.pravatar.cc/150?img=9', status: 'online', lastSeen: '', aboutMe: 'I am a DevOps engineer from Mumbai.' },
    { id: 10, name: 'Patricia Taylor', email: 'patricia.taylor@example.com', avatar: 'https://i.pravatar.cc/150?img=10', status: 'offline', lastSeen: 'today', aboutMe: 'I am a technical writer from Dublin.' },
    { id: 11, name: 'James Anderson', email: 'james.anderson@example.com', avatar: 'https://i.pravatar.cc/150?img=11', status: 'online', lastSeen: '', aboutMe: 'I am a mobile developer from Seoul.' },
    { id: 12, name: 'Barbara Thomas', email: 'barbara.thomas@example.com', avatar: 'https://i.pravatar.cc/150?img=12', status: 'offline', lastSeen: '5 hours ago', aboutMe: 'I am a database administrator from Moscow.' },
    { id: 13, name: 'William Jackson', email: 'william.jackson@example.com', avatar: 'https://i.pravatar.cc/150?img=13', status: 'online', lastSeen: '', aboutMe: 'I am a network engineer from Beijing.' },
    { id: 14, name: 'Elizabeth White', email: 'elizabeth.white@example.com', avatar: 'https://i.pravatar.cc/150?img=14', status: 'offline', lastSeen: '2 days ago', aboutMe: 'I am a security analyst from Cairo.' },
    { id: 15, name: 'Richard Harris', email: 'richard.harris@example.com', avatar: 'https://i.pravatar.cc/150?img=15', status: 'online', lastSeen: '', aboutMe: 'I am a cloud architect from Rio de Janeiro.' },
  ])

  const user = ref<any>({})

  onMounted(() => {
    const foundUser = profiles.value.find(p => p.id === userId)
    if (foundUser) {
      user.value = foundUser
    }
  })
</script>
