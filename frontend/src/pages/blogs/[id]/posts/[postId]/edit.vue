<template>
  <v-container>
    <v-skeleton-loader v-if="loading" type="article" />
    <v-form v-else @submit.prevent="save">
      <v-text-field v-model="post.title" class="mb-4" label="Title" />
      <v-textarea v-model="post.excerpt" class="mb-4" label="Excerpt" />
      <v-btn color="primary" type="submit">Save</v-btn>
    </v-form>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchBlogPost } from '@/services/blogs'
import { useAuthStore } from '@/stores/auth'
import { Role } from '@/types'

definePage({
  meta: { roles: [Role.User] },
})

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const blogId = computed(() => (route.params as any).id as string)
const postId = computed(() => (route.params as any).postId as string)
const loading = ref(true)
const post = reactive({ title: '', excerpt: '' })

onMounted(async () => {
  if (blogId.value !== auth.currentUser?.id) {
    router.replace('/error/403')
    return
  }
  const data = await fetchBlogPost(blogId.value, postId.value)
  if (data) Object.assign(post, { title: data.title, excerpt: data.content?.[0] || '' })
  loading.value = false
})

async function save() {
  console.log('Saving post', post)
  router.push(`/blogs/${blogId.value}/posts/${postId.value}`)
}
</script>
