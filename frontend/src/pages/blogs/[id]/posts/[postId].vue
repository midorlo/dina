<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="8" md="10">
        <v-skeleton-loader v-if="loading" type="image, article, actions" />
        <template v-else-if="post">
          <div class="mb-10">
            <v-btn prepend-icon="mdi-arrow-left" :to="`/blogs/${blogId}`" variant="text">
              Zurück zu {{ post.blogName }}
            </v-btn>
          </div>

          <div class="text-center mb-10">
            <v-chip class="mb-4" color="primary" variant="flat">
              {{ post.category }}
            </v-chip>
            <h1 class="text-h3 font-weight-bold">{{ post.title }}</h1>
            <p class="text-h6 text-medium-emphasis font-weight-regular mt-4">
              Veröffentlicht von {{ post.author }} am {{ post.date }}
            </p>
          </div>

          <v-img class="rounded-xl mb-10" cover height="400px" :src="post.imageUrl" />

          <div class="text-body-1" style="line-height: 1.8">
            <p v-for="(p, i) in post.content" :key="i" class="mb-6">
              {{ p }}
            </p>
          </div>

          <v-divider class="my-10" />

          <div class="d-flex align-center">
            <v-avatar>
              <v-img :src="post.authorAvatarUrl" />
            </v-avatar>
            <div class="ml-4">
              <div class="font-weight-bold">{{ post.author }}</div>
              <div class="text-caption text-medium-emphasis">Autor</div>
            </div>
          </div>
        </template>
        <v-empty-state v-else icon="mdi-post-outline" title="Post not found" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import type { Post } from '@/types'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchBlogPost } from '@/services/blogs'

const route = useRoute()
const blogId = computed(() => (route.params as any).id as string)
const postId = computed(() => (route.params as any).postId as string)

const post = ref<Post | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    post.value = (await fetchBlogPost(blogId.value, postId.value)) || null
  } finally {
    loading.value = false
  }
})
</script>
