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
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePhoto } from '@/services/photos';
import { useAuthStore } from '@/stores/auth';
import { Role } from '@/types';

definePage({
  meta: { roles: [Role.User] }
});

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const galleryId = computed(() => (route.params as any).id as string | undefined);
const photoId = computed(() => (route.params as any).photoId as string | undefined);

const { data: photo, isLoading: loading } = usePhoto(photoId.value || '');

// Authorization check
watch(
  galleryId,
  id => {
    if (id && id !== authStore.currentUser?.id) {
      router.replace('/error/403');
    }
  },
  { immediate: true }
);
</script>
