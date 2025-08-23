<template>
  <v-container fluid>
    <v-toolbar color="transparent">
      <v-spacer />
      <v-btn-toggle v-model="density" mandatory rounded="pill">
        <v-btn icon="mdi-view-grid-outline" value="large" />
        <v-btn icon="mdi-view-grid-compact" value="medium" />
        <v-btn icon="mdi-view-module-outline" value="small" />
      </v-btn-toggle>
    </v-toolbar>

    <div v-if="loading" class="masonry-container" :style="{ 'column-count': columnCount }">
      <div v-for="n in 12" :key="n" class="masonry-item">
        <v-skeleton-loader class="rounded-lg" type="image" />
      </div>
    </div>
    <div v-else-if="items.length > 0" class="masonry-container" :style="{ 'column-count': columnCount }">
      <div v-for="item in items" :key="item.id" class="masonry-item">
        <router-link :to="`/photos/${galleryId}/${item.id}`">
          <v-img
            :aspect-ratio="item.aspectRatio"
            class="bg-grey-lighten-2 rounded-lg"
            cover
            :lazy-src="item.lazySrc"
            :src="item.src"
          >
            <template #placeholder>
              <v-row align="center" class="fill-height ma-0" justify="center">
                <v-progress-circular color="grey-lighten-5" indeterminate />
              </v-row>
            </template>
          </v-img>
        </router-link>
      </div>
    </div>
    <v-empty-state v-else icon="mdi-image-off-outline" title="Keine Fotos gefunden" />
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';
import { fetchPhotos } from '@/services/photos';
import { useAuthStore } from '@/stores/auth';
import { type GalleryItem, Role } from '@/types';

definePage({
  meta: { roles: [Role.User], layout: 'default' }
});

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const galleryId = computed(() => (route.params as any).id as string);

const { name } = useDisplay();
const density = ref('medium'); // 'large', 'medium', 'small'

const columnCount = computed(() => {
  switch (name.value) {
    case 'xs': {
      return density.value === 'large' ? 1 : 2;
    }
    case 'sm': {
      if (density.value === 'large') return 2;
      if (density.value === 'medium') return 3;
      return 4;
    }
    default: {
      if (density.value === 'large') return 2;
      if (density.value === 'medium') return 3;
      return 6;
    }
  }
});

const items = ref<GalleryItem[]>([]);
const loading = ref(true);

onMounted(async () => {
  if (galleryId.value !== authStore.currentUser?.id) {
    router.replace('/error/403');
    return;
  }
  try {
    items.value = await fetchPhotos();
  } finally {
    loading.value = false;
  }
});
</script>
<style scoped>
.masonry-container {
  column-gap: 16px;
}
.masonry-item {
  display: inline-block;
  vertical-align: top;
  width: 100%;
  margin-bottom: 16px;
}
</style>
