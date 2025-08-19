<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" lg="6" md="8" sm="10">
        <v-card class="pa-6" flat rounded="xl">
          <v-card-title class="text-h4 font-weight-bold text-center mb-4">User Profile</v-card-title>
          <v-card-subtitle class="text-center mb-6">Manage your account settings</v-card-subtitle>

          <v-sheet class="pa-4 mb-6 text-center" rounded="lg">
            <v-avatar class="mb-4" color="grey-lighten-2" size="120">
              <v-img src="https://cdn.vuetifyjs.com/images/john-smirk.png" />
            </v-avatar>
            <div class="text-h5 font-weight-bold">{{ user.username }}</div>
            <div class="text-subtitle-1 text-medium-emphasis">Username</div>
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

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="user.firstName"
                    density="comfortable"
                    label="First Name"
                    prepend-inner-icon="mdi-account-outline"
                    rounded="pill"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="user.lastName"
                    density="comfortable"
                    label="Last Name"
                    prepend-inner-icon="mdi-account-outline"
                    rounded="pill"
                    variant="outlined"
                  />
                </v-col>
              </v-row>

              <v-text-field
                v-model="user.email"
                class="mb-4"
                density="comfortable"
                label="Email"
                prepend-inner-icon="mdi-email-outline"
                readonly
                rounded="pill"
                variant="outlined"
              />

              <v-text-field
                v-model="user.phone"
                class="mb-4"
                density="comfortable"
                label="Phone Number"
                prepend-inner-icon="mdi-phone-outline"
                rounded="pill"
                variant="outlined"
              />

              <v-textarea
                v-model="user.aboutMe"
                class="mb-4"
                density="comfortable"
                label="About Me"
                prepend-inner-icon="mdi-information-outline"
                rounded="lg"
                rows="3"
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

            <v-btn
              block
              class="mt-4"
              color="primary"
              rounded="pill"
              size="large"
              type="submit"
            >
              Save Changes
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'

  const user = reactive({
    username: 'john.doe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '',
    aboutMe: 'A short description about myself.',
  })

  const password = reactive({
    current: '',
    new: '',
    confirm: '',
  })

  function saveProfile () {
    console.log('Saving profile:', user, password)
  // Add logic to save user profile and change password
  }
</script>
