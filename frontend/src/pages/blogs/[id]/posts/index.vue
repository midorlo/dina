<template>
  <v-container>
    <v-skeleton-loader v-if="loading" type="article" />
    <template v-else>
      <v-card
        v-for="post in pagedPosts"
        :key="post.id"
        class="mb-4"
        :to="`/blogs/${blogId}/posts/${post.id}`"
      >
        <v-card-title>{{ post.title }}</v-card-title>
        <v-card-subtitle>{{ post.createdAt }}</v-card-subtitle>
      </v-card>
      <v-pagination v-model="page" class="mt-4" :length="pageCount" />
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchBlogPosts } from '@/services/blogs'
import { Role } from '@/types'

definePage({
  meta: { roles: [Role.User] },
})

const route = useRoute()
const blogId = computed(() => (route.params as any).id as string)
const posts = ref<any[]>([])
const page = ref(1)
const pageSize = 5
const loading = ref(true)

const pagedPosts = computed(() => {
  const start = (page.value - 1) * pageSize
  return posts.value.slice(start, start + pageSize)
})

const pageCount = computed(() => Math.ceil(posts.value.length / pageSize))

onMounted(async () => {
  posts.value = await fetchBlogPosts(blogId.value)
  loading.value = false
})
</script>
