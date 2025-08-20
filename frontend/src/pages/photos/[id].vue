<template>
  <v-container>
    <v-row>
      <v-col>
        <v-skeleton-loader v-if="loading" type="image, article, actions" />
        <v-card v-else-if="photo">
          <v-img :aspect-ratio="photo.aspectRatio" cover :lazy-src="photo.lazySrc" :src="photo.src">
            <template #placeholder>
              <v-row align="center" class="fill-height ma-0" justify="center">
                <v-progress-circular indeterminate />
              </v-row>
            </template>
          </v-img>
          <v-card-title>Photo {{ photo.id }}</v-card-title>
          <v-card-text>This is the detail page for photo {{ photo.id }}.</v-card-text>
          <v-card-actions>
            <v-btn to="/photos">Back to Gallery</v-btn>
          </v-card-actions>
        </v-card>
        <v-empty-state v-else icon="mdi-image-off-outline" title="Photo not found" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { GalleryItem } from '@/types'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPhoto } from '@/services/photos'

interface PhotoRouteParams {
  id: string
}

const route = useRoute()
const photoId = computed(() => (route.params as PhotoRouteParams).id)
const loading = ref(true)
const photo = ref<GalleryItem | null>(null)

onMounted(async () => {
  try {
    photo.value = (await fetchPhoto(Number(photoId.value))) || null
  } finally {
    loading.value = false
  }
})
</script>
