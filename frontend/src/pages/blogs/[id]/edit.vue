<template>
  <v-container>
    <v-skeleton-loader v-if="loading" type="article" />
    <v-form v-else @submit.prevent="save">
      <v-text-field v-model="blog.name" class="mb-4" label="Name" />
      <v-textarea v-model="blog.description" class="mb-4" label="Description" />
      <v-btn color="primary" type="submit">Save</v-btn>
    </v-form>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchBlog } from '@/services/blogs'
import { useAuthStore } from '@/stores/auth'
import { Role } from '@/types'

definePage({
  meta: { roles: [Role.User], layout: 'default' },
})

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const blogId = computed(() => (route.params as any).id as string)
const loading = ref(true)
const blog = reactive({ name: '', description: '' })

onMounted(async () => {
  if (blogId.value !== auth.currentUser?.id) {
    router.replace('/error/403')
    return
  }
  const data = await fetchBlog(blogId.value)
  if (data) Object.assign(blog, data)
  loading.value = false
})

async function save() {
  // placeholder save
  console.log('Saving blog', blog)
  router.push(`/blogs/${blogId.value}`)
}
</script>
