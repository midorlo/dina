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
        <v-col v-if="blogs.length === 0" cols="12">
          <v-empty-state icon="mdi-book-open-variant-outline" title="Keine Blogs gefunden" />
        </v-col>
        <v-col v-for="blog in blogs" v-else :key="blog.id" cols="12" lg="4" md="6">
          <v-card
            border
            class="pa-3"
            flat
            height="100%"
            rounded="xl"
            @click="router.push(`/blogs/${blog.id}-${slugify(blog.name)}`)"
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
              <v-btn color="primary" :to="`/blogs/${blog.id}-${slugify(blog.name)}`" variant="text">
                Blog ansehen
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchBlogs } from '@/services/blogs'
import { type Blog, Role } from '@/types'
import { slugify } from '@/utils/slug'

definePage({
  meta: {
    roles: [Role.Any],
    layout: 'default',
    breadcrumb: 'Übersicht',
  },
})

const blogs = ref<Blog[]>([])
const loading = ref(true)
const router = useRouter()

onMounted(async () => {
  blogs.value = await fetchBlogs()
  loading.value = false
})
</script>

<style scoped>
.v-card-title {
  line-height: 1.2rem;
}
</style>
