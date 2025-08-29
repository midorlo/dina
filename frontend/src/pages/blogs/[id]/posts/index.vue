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
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useBlogPosts } from '@/services/blogs.ts';
import { Role } from '@/types';
import { slugify } from '@/utils/slug';

const route = useRoute();
const blogId = computed(() => (route.params as Record<string, string>).id);
const blogSlug = computed(() => (route.params as Record<string, string>).slug as string | undefined);

definePage({
  meta: { roles: [Role.Any], layout: 'default', breadcrumb: 'Beiträge' }
});

const { data: posts, isLoading: loading } = useBlogPosts(blogId.value);

const page = ref(1);
const pageSize = 5;

const pagedPosts = computed(() => {
  const allPosts = posts.value || []; // Guard against undefined initial value
  const start = (page.value - 1) * pageSize;
  return allPosts.slice(start, start + pageSize);
});

const pageCount = computed(() => Math.ceil((posts.value?.length || 0) / pageSize));
</script>
