<template>
  <v-container>
    <v-divider />

    <v-card class="pa-6 rounded-xl">
      <v-card-title class="text-h5">Cropper Test Page</v-card-title>
      <avatar-cropper
        :aspect-ratio-c-s-s="1"
        :export-mime-type="'image/png'"
        :export-quality="0.92"
        :image-height="420"
        :initial-coverage="0.9"
        @cropped="onCropped"
        @error="onError"
      />
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
function onCropped(p: { blob: Blob; dataUrl: string; width: number; height: number }) {
  // direkt hochladen oder weiterverarbeiten
  console.log(p.width, p.height, p.blob);
}
function onError(p: { message: string }) {
  console.warn('Fehler:', p.message);
}
</script>
