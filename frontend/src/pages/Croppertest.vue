<template>
  <v-container>
    <v-card class="pa-6 rounded-xl">
      <v-card-title class="text-h5">Cropper Test Page</v-card-title>
      <v-card-text>
        <p>This page demonstrates the Cropper component.</p>
        <Cropper />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Cropper from '@/components/Cropper.vue'

const avatarUrl = ref<string | null>(null)

function handleCropped(payload: { blob: Blob; dataUrl: string }) {
  avatarUrl.value = payload.dataUrl
  console.log('Cropped image blob:', payload.blob)
}
</script>

<style scoped>
/* Add any specific styles for this page here */
</style>
