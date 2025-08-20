<template>
  <v-container>
    <v-row>
      <v-col>
        <v-skeleton-loader v-if="loading" type="image, article, actions" />
        <v-card v-else>
          <v-img
            aspect-ratio="4/3"
            cover
            :lazy-src="`https://picsum.photos/id/${photoId}/10/10`"
            :src="photoSrc"
          >
            <template #placeholder>
              <v-row align="center" class="fill-height ma-0" justify="center">
                <v-progress-circular indeterminate />
              </v-row>
            </template>
          </v-img>
          <v-card-title>Photo {{ photoId }}</v-card-title>
          <v-card-text>This is the detail page for photo {{ photoId }}.</v-card-text>
          <v-card-actions>
            <v-btn to="/gallery">Back to Gallery</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

interface PhotoRouteParams {
  id: string
}

const route = useRoute()
const photoId = computed(() => (route.params as PhotoRouteParams).id)
const loading = ref(true)
const photoSrc = ref('')

onMounted(() => {
  photoSrc.value = `https://picsum.photos/id/${photoId.value}/800/600`
  const img = new Image()
  img.src = photoSrc.value
  img.addEventListener('load', () => {
    loading.value = false
  })
})
</script>
