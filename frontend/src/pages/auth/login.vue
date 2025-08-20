<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" lg="4" md="6" sm="8">
        <v-card class="pa-6" flat rounded="xl">
          <v-card-title class="text-h4 font-weight-bold text-center mb-4"
            >Welcome Back</v-card-title
          >
          <v-card-subtitle class="text-center mb-6">Sign in to continue</v-card-subtitle>

          <v-form @submit.prevent="login">
            <v-alert
              v-if="loginError"
              class="mb-4"
              color="error"
              icon="mdi-alert-circle-outline"
              text="{{ loginError }}"
              variant="tonal"
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
              class="mb-2"
              density="comfortable"
              label="Password"
              prepend-inner-icon="mdi-lock-outline"
              required
              rounded="pill"
              type="password"
              variant="outlined"
            />

            <v-row align="center" class="mb-4" justify="space-between">
              <v-col cols="auto">
                <v-checkbox
                  v-model="rememberMe"
                  density="compact"
                  hide-details
                  label="Remember me"
                />
              </v-col>
              <v-col cols="auto">
                <router-link class="text-decoration-none text-primary" to="/forgot-password"
                  >Forgot password?</router-link
                >
              </v-col>
            </v-row>

            <v-btn block class="mb-4" color="primary" rounded="pill" size="large" type="submit">
              Login
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
            <span class="text-body-2">Don't have an account? </span>
            <router-link class="text-decoration-none text-primary" to="/auth/register"
              >Register</router-link
            >
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import { Role } from '@/types'

definePage({
  meta: { roles: [Role.Guest] },
})

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loginError = ref('')

const authStore = useAuthStore()

async function login() {
  loginError.value = '' // Clear previous errors
  try {
    const { login } = await import('@/services/auth')
    const response = await login(email.value, password.value)
    if (response.user.id) {
      authStore.setUser(response.user)
      authStore.setTokens(response.tokens)
      authStore.setProfile(response.profile)
      // Redirect to profile or dashboard
      console.log('Login successful!', response.user)
    } else {
      // This case should ideally not be reached if apiService.login rejects on failure
      loginError.value = 'An unexpected login error occurred.'
    }
  } catch (error: any) {
    console.error('Login error:', error)
    loginError.value = error.message || 'Login failed. Please check your credentials.'
  }
}
</script>
