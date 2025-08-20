<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="8" md="10">
        <v-skeleton-loader v-if="loading" type="image, article, actions" />
        <template v-else-if="post">
          <div class="mb-10 d-flex justify-space-between">
            <v-btn
              prepend-icon="mdi-arrow-left"
              :to="`/blogs/${blogId}-${slugify(post.blogName)}`"
              variant="text"
            >
              Zurück zu {{ post.blogName }}
            </v-btn>
            <v-btn
              v-if="canEdit"
              prepend-icon="mdi-pencil"
              :to="`/blogs/${blogId}-${slugify(post.blogName)}/posts/${postId}-${slugify(post.title)}/edit`"
              variant="text"
            >
              Bearbeiten
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
            <router-link class="mr-4" :to="`/profiles/${post.author}`">
              <v-avatar>
                <v-img :src="post.authorAvatarUrl" />
              </v-avatar>
            </router-link>
            <div>
              <router-link class="text-decoration-none" :to="`/profiles/${post.author}`">
                <div class="font-weight-bold">{{ post.author }}</div>
              </router-link>
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
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchBlogPost } from '@/services/blogs'
import { useAuthStore } from '@/stores/auth'
import { type Post, Role } from '@/types'
import { slugify } from '@/utils/slug'

const route = useRoute()
const blogId = computed(() => (route.params as any).id as string)
const postId = computed(() => (route.params as any).postId as string)

definePage({
  meta: { roles: [Role.Any], layout: 'default' },
})

const post = ref<Post | null>(null)
const loading = ref(true)
const authStore = useAuthStore()
const { currentUser } = storeToRefs(authStore)

onMounted(async () => {
  try {
    post.value = (await fetchBlogPost(blogId.value, postId.value)) || null
  } finally {
    loading.value = false
  }
})

const canEdit = computed(
  () => currentUser.value?.username?.toLowerCase() === post.value?.author.toLowerCase()
)
</script>

<route lang="yaml">
path: /blogs/:id-:blogSlug/posts/:postId-:postSlug
alias:
  - /blogs/:id-:blogSlug?/posts/:postId-:postSlug?
</route>
