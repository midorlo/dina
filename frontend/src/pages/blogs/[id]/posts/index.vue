<template>
  <v-container>
    <h1 class="text-h5 mb-4">Beiträge</h1>
    <v-skeleton-loader v-if="loading" type="article" />
    <template v-else>
      <v-row>
        <v-col v-for="post in pagedPosts" :key="post.id" cols="12">
          <v-card
            border
            class="mb-4"
            flat
            rounded="xl"
            :to="`/blogs/${blogId}${blogSlug ? `-${blogSlug}` : ''}/posts/${post.id}-${slugify(post.title)}`"
          >
            <v-card-title>{{ post.title }}</v-card-title>
            <v-card-subtitle>{{ post.createdAt }}</v-card-subtitle>
            <v-card-text>{{ post.excerpt }}</v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn append-icon="mdi-arrow-right" color="primary" variant="text">Lesen</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-pagination v-model="page" class="mt-4" :length="pageCount" />
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchBlogPosts } from '@/services/blogs'
import { Role } from '@/types'
import { slugify } from '@/utils/slug'

definePage({
  meta: { roles: [Role.Any], layout: 'default' },
})

const route = useRoute()
const blogId = computed(() => (route.params as any).id as string)
const blogSlug = computed(() => (route.params as any).slug as string | undefined)
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

<route lang="yaml">
path: /blogs/:id-:slug/posts
alias:
  - /blogs/:id-:slug?/posts
</route>
