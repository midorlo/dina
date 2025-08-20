<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" lg="4" md="6" sm="8">
        <v-card class="pa-6" flat rounded="xl">
          <v-card-title class="text-h4 font-weight-bold text-center mb-4"
            >Create Account</v-card-title
          >
          <v-card-subtitle class="text-center mb-6">Join us today!</v-card-subtitle>

          <v-form @submit.prevent="register">
            <v-text-field
              v-model="name"
              class="mb-4"
              density="comfortable"
              label="Full Name"
              prepend-inner-icon="mdi-account-outline"
              required
              rounded="pill"
              variant="outlined"
            />

            <v-text-field
              v-model="email"
              class="mb-4"
              density="comfortable"
              label="Email"
              prepend-inner-icon="mdi-email-outline"
              required
              rounded="pill"
              variant="outlined"
            />

            <v-text-field
              v-model="password"
              class="mb-4"
              density="comfortable"
              label="Password"
              prepend-inner-icon="mdi-lock-outline"
              required
              rounded="pill"
              type="password"
              variant="outlined"
            />

            <v-text-field
              v-model="confirmPassword"
              class="mb-4"
              density="comfortable"
              label="Confirm Password"
              prepend-inner-icon="mdi-lock-check-outline"
              required
              rounded="pill"
              type="password"
              variant="outlined"
            />

            <v-btn block class="mb-4" color="primary" rounded="pill" size="large" type="submit">
              Register
            </v-btn>
          </v-form>

          <v-divider class="my-4" />

          <div class="text-center mb-4">
            <v-btn class="mx-2" color="red" icon rounded="pill" size="large">
              <v-icon>mdi-google</v-icon>
            </v-btn>
            <v-btn class="mx-2" color="blue-darken-2" icon rounded="pill" size="large">
              <v-icon>mdi-facebook</v-icon>
            </v-btn>
          </div>

          <div class="text-center">
            <span class="text-body-2">Already have an account? </span>
            <router-link class="text-decoration-none text-primary" to="/auth/login"
              >Login</router-link
            >
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Role } from '@/types'

definePage({
  meta: { roles: [Role.Guest] },
})

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

function register() {
  // Handle registration logic here
  console.log(
    'Registration attempt:',
    name.value,
    email.value,
    password.value,
    confirmPassword.value
  )
}
</script>
