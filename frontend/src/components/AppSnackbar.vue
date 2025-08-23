<template>
  <v-snackbar v-model="visible" :color="color" location="bottom right" rounded="pill" :timeout="timeout">
    {{ message }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSnackbarStore } from '@/stores/snackbar';

const snackbarStore = useSnackbarStore();
const { message, color, visible, timeout } = storeToRefs(snackbarStore);
</script>
