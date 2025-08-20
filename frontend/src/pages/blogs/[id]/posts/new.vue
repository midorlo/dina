<template>
  <v-container>
    <v-form @submit.prevent="create">
      <v-text-field v-model="post.title" class="mb-4" label="Title" />
      <v-textarea v-model="post.excerpt" class="mb-4" label="Excerpt" />
      <v-btn color="primary" type="submit">Create</v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Role } from '@/types'

definePage({
  meta: { roles: [Role.User] },
})

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const blogId = computed(() => (route.params as any).id as string)
const post = reactive({ title: '', excerpt: '' })

function create() {
  if (blogId.value !== auth.currentUser?.id) {
    router.replace('/error/403')
    return
  }
  console.log('Creating post', post)
  router.push(`/blogs/${blogId.value}/posts`)
}
</script>
