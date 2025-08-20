<template>
  <v-container>
    <template v-if="loading">
      <v-row justify="center">
        <v-col cols="12" lg="8" md="10">
          <v-skeleton-loader class="mb-6" type="avatar, heading, text, chip" />
          <v-skeleton-loader v-for="n in 3" :key="n" class="mb-6" type="article, actions" />
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <!-- Blog Header -->
      <v-row justify="center">
        <v-col class="text-center" cols="12" lg="8" md="10">
          <v-avatar class="mb-4 elevation-4" size="120">
            <v-img :src="currentBlog?.authorAvatarUrl" />
          </v-avatar>
          <h1 class="text-h3 font-weight-bold">{{ currentBlog?.name }}</h1>
          <p class="text-h6 text-medium-emphasis font-weight-regular mt-2">
            {{ currentBlog?.description }}
          </p>
          <div class="mt-4">
            <v-chip class="mr-2">{{ currentBlog?.postCount }} Beiträge</v-chip>
            <v-chip>Erstellt am {{ currentBlog?.createdAt }}</v-chip>
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-10" />

      <!-- List of Posts -->
      <v-row justify="center">
        <v-col cols="12" lg="8" md="10">
          <h2 class="text-h5 mb-6">Neueste Beiträge</h2>
          <v-card
            v-for="post in posts"
            :key="post.id"
            border
            class="mb-6 pa-2"
            flat
            rounded="xl"
            :to="{
              name: '/blogs/[id]/posts/[postId]',
              params: { id: currentBlog?.id, postId: String(post.id) },
            }"
          >
            <v-card-title>{{ post.title }}</v-card-title>
            <v-card-subtitle>{{ post.createdAt }}</v-card-subtitle>
            <v-card-text>{{ post.excerpt }}</v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn append-icon="mdi-arrow-right" color="primary" variant="text">
                Beitrag lesen
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import type { Blog, PostItem } from '@/types'
import { computed, onMounted, ref } from 'vue'
import { fetchBlog, fetchBlogPosts } from '@/services/blogs'

const route = useRoute('/blogs/[id]/')
const blogId = computed(() => route.params.id as string)

const blog = ref<Blog | null>(null)
const posts = ref<PostItem[]>([])
const loading = ref(true)

onMounted(async () => {
  blog.value = (await fetchBlog(blogId.value)) || null
  posts.value = await fetchBlogPosts(blogId.value)
  loading.value = false
})

const currentBlog = computed(() => blog.value)
</script>
