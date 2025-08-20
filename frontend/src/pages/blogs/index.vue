<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Community-Blogs</h1>
        <p class="text-medium-emphasis mb-8">Entdecke die persönlichen Blogs unserer Mitglieder.</p>
      </v-col>
    </v-row>

    <v-row>
      <template v-if="loading">
        <v-col v-for="n in 3" :key="n" cols="12" lg="4" md="6">
          <v-skeleton-loader type="card" />
        </v-col>
      </template>
      <template v-else>
        <v-col v-for="blog in blogs" :key="blog.id" cols="12" lg="4" md="6">
          <v-card
            border
            class="pa-3"
            flat
            height="100%"
            rounded="xl"
            @click="$router.push(`/blogs/${blog.id}`)"
          >
            <div class="d-flex align-center mb-3">
              <v-avatar>
                <v-img :src="blog.authorAvatarUrl" />
              </v-avatar>
              <div class="ml-4">
                <div class="v-card-title pa-0">{{ blog.name }}</div>
                <div class="v-card-subtitle pa-0">@{{ blog.authorHandle }}</div>
              </div>
            </div>

            <v-card-text class="pb-0">
              {{ blog.description }}
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" :to="`/blogs/${blog.id}`" variant="text"> Blog ansehen </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { Blog } from '@/types'
import { onMounted, ref } from 'vue'
import { fetchBlogs } from '@/services/blogs'

const blogs = ref<Blog[]>([])
const loading = ref(true)

onMounted(async () => {
  blogs.value = await fetchBlogs()
  loading.value = false
})
</script>

<style scoped>
.v-card {
  transition: all 0.2s ease-in-out;
}
.v-card:hover {
  transform: translateY(-4px);
  border-color: rgba(var(--v-theme-primary), 0.6) !important;
}
.v-card-title {
  line-height: 1.2rem;
}
</style>
