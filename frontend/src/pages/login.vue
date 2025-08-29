<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" lg="4" md="6" sm="8">
        <v-card class="pa-6" flat rounded="xl">
          <v-card-title class="text-h4 font-weight-bold text-center mb-4">Welcome Back</v-card-title>
          <v-card-subtitle class="text-center mb-6">Sign in to continue</v-card-subtitle>

          <v-form ref="form" @submit.prevent="login">
            <v-alert
              v-if="loginError"
              class="mb-4"
              color="error"
              icon="mdi-alert-circle-outline"
              :text="loginError"
              variant="tonal"
            />
            <v-text-field
              v-model="email"
              class="mb-4"
              density="comfortable"
              label="Email"
              prepend-inner-icon="mdi-email-outline"
              rounded="pill"
              :rules="emailRules"
              variant="outlined"
            />

            <v-text-field
              v-model="password"
              class="mb-2"
              density="comfortable"
              label="Password"
              prepend-inner-icon="mdi-lock-outline"
              rounded="pill"
              :rules="passwordRules"
              type="password"
              variant="outlined"
            />

            <v-row align="center" class="mb-4" justify="space-between">
              <v-col cols="auto">
                <v-checkbox v-model="rememberMe" density="compact" hide-details label="Remember me" />
              </v-col>
              <v-col cols="auto">
                <router-link class="text-decoration-none text-primary" to="/forgot-password"
                  >Forgot password?</router-link
                >
              </v-col>
            </v-row>

            <v-row class="mb-4" justify="space-between">
              <v-col cols="6">
                <v-btn block color="primary" rounded="pill" size="large" type="submit">Login</v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn block color="secondary" rounded="pill" size="large" to="/">Zurück</v-btn>
              </v-col>
            </v-row>
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

          <v-divider class="my-4" />

          <div class="text-center mb-4">
            <div class="mb-2">Preset Logins</div>
            <v-btn
              v-for="preset in presets"
              :key="preset.email"
              class="ma-1"
              rounded="pill"
              size="small"
              variant="outlined"
              @click="presetLogin(preset.email)"
            >
              {{ preset.label }} (ID: {{ preset.id }})
            </v-btn>
          </div>

          <div class="text-center">
            <span class="text-body-2">Don't have an account? </span>
            <router-link class="text-decoration-none text-primary" to="/register">Register</router-link>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useFormValidation } from '@/composables/useFormValidation';
import { db } from '@/data/normalized-mock-data';
import { useAuthStore } from '@/stores/auth';
import { useSnackbarStore } from '@/stores/snackbar';

import { Role } from '@/types';

definePage({
  alias: '/auth/login',
  meta: {
    roles: [Role.Guest],
    layout: 'empty',
    requiresGuest: true,
    breadcrumb: 'Login'
  }
});

const form = ref();
const formData = reactive({
  email: '',
  password: ''
});
const { email, password } = toRefs(formData);
const rememberMe = ref(false);
const loginError = ref('');

const { required, email: emailRule } = useFormValidation();

const emailRules = [required, emailRule];
const passwordRules = [required];

const presets = db.users.map(user => ({
  label: user.role,
  email: user.email,
  id: user.id
}));

const authStore = useAuthStore();

const router = useRouter();
const snackbarStore = useSnackbarStore();

async function login() {
  const result = await form.value?.validate();
  const valid = typeof result === 'object' ? (result as any).valid : !!result;
  if (!valid) return;
  loginError.value = '';
  try {
    const { login } = await import('@/services/auth');
    const response = await login(formData.email, formData.password);
    if (response.user.id) {
      authStore.setUser(response.user);
      authStore.setTokens(response.tokens);
      authStore.setProfile(response.profile);
      snackbarStore.showSnackbar('Login successful!', 'success');
      router.push('/');
    }
  } catch (error: any) {
    loginError.value = error.message || 'Login failed. Please check your credentials.';
  }
}

function presetLogin(presetEmail: string) {
  formData.email = presetEmail;
  formData.password = 'password';
  login();
}
</script>
