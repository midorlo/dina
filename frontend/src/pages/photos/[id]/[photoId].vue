<template>
  <v-container>
    <v-row>
      <v-col>
        <v-skeleton-loader v-if="loading" type="image, article, actions" />
        <v-card v-else-if="photo">
          <v-img
            :alt="`Photo ${photo.id}`"
            :aspect-ratio="photo.aspectRatio"
            cover
            :lazy-src="photo.lazySrc"
            :src="photo.src"
          >
            <template #placeholder>
              <v-row align="center" class="fill-height ma-0" justify="center">
                <v-progress-circular indeterminate />
              </v-row>
            </template>
          </v-img>
          <v-card-title>Photo {{ photo.id }}</v-card-title>
          <v-card-text>This is the detail page for photo {{ photo.id }}.</v-card-text>
          <v-card-actions>
            <v-btn :to="`/photos/${galleryId}`">Back to Gallery</v-btn>
          </v-card-actions>
        </v-card>
        <v-empty-state v-else icon="mdi-image-off-outline" title="Photo not found" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchPhoto } from '@/services/photos';
import { useAuthStore } from '@/stores/auth';
import { type GalleryItem, Role } from '@/types';

definePage({
  meta: { roles: [Role.User], layout: 'default' }
});

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const galleryId = computed(() => (route.params as any).id as string);
const photoId = computed(() => (route.params as any).photoId as string);
const loading = ref(true);
const photo = ref<GalleryItem | null>(null);

onMounted(async () => {
  if (galleryId.value !== authStore.currentUser?.id) {
    router.replace('/error/403');
    return;
  }
  try {
    photo.value = (await fetchPhoto(Number(photoId.value))) || null;
  } finally {
    loading.value = false;
  }
});
</script>
