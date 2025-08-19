<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" sm="10">
        <v-sheet class="pa-2" rounded="xl">
          <v-skeleton-loader
            v-if="loading"
            :aspect-ratio="16/9"
            class="rounded-lg"
            type="image"
          />
          <v-img
            v-show="!loading"
            aspect-ratio="16/9"
            class="rounded-lg"
            :src="imageUrl"
          />
        </v-sheet>
        <div class="d-flex justify-space-between align-center mt-4">
          <v-btn prepend-icon="mdi-arrow-left" to="/gallery" variant="text">
            Back to Gallery
          </v-btn>
          <h1 class="text-h5 font-weight-bold">Photo {{ photoId }}</h1>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const loading = ref(true)

  const photoId = computed(() => route.params.id)
  const imageUrl = computed(() => `https://picsum.photos/1280/720?image=${photoId.value}`)

  watch(imageUrl, newUrl => {
    loading.value = true
    const img = new Image()
    img.addEventListener('load', () => {
      loading.value = false
    })
    img.addEventListener('error', () => {
      // Handle error, maybe show a placeholder or error message
      loading.value = false
    })
    img.src = newUrl
  }, { immediate: true })

</script>
