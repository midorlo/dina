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
          <router-link :to="`/profiles/${currentBlog?.authorHandle}`">
            <v-avatar class="mb-4 elevation-4" size="120">
              <v-img :src="currentBlog?.authorAvatarUrl" />
            </v-avatar>
          </router-link>
          <h1 class="text-h3 font-weight-bold">{{ currentBlog?.name }}</h1>
          <p class="text-h6 text-medium-emphasis font-weight-regular mt-2">
            {{ currentBlog?.description }}
          </p>
          <div class="mt-4">
            <v-chip class="mr-2">{{ currentBlog?.postCount }} Beiträge</v-chip>
            <v-chip>Erstellt am {{ currentBlog?.createdAt }}</v-chip>
          </div>
          <v-btn
            v-if="canEdit"
            class="mt-4"
            color="primary"
            prepend-icon="mdi-pencil"
            :to="`/blogs/${currentBlog?.id}/${slugify(currentBlog?.name ?? '')}/edit`"
            variant="text"
          >
            Blog bearbeiten
          </v-btn>
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
            :to="`/blogs/${currentBlog?.id}/${slugify(currentBlog?.name ?? '')}/posts/${post.id}-${slugify(post.title)}`"
          >
            <v-card-title>{{ post.title }}</v-card-title>
            <v-card-subtitle>{{ post.createdAt }}</v-card-subtitle>
            <v-card-text>{{ post.excerpt }}</v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn append-icon="mdi-arrow-right" color="primary" variant="text"> Beitrag lesen </v-btn>
            </v-card-actions>
          </v-card>
          <v-btn
            block
            class="mt-4"
            color="primary"
            :to="`/blogs/${currentBlog?.id}/${slugify(currentBlog?.name ?? '')}/posts`"
            variant="text"
          >
            Alle Beiträge anzeigen
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchBlog, fetchBlogPosts } from '@/services/blogs';
import { useAuthStore } from '@/stores/auth';
import { type Blog, type PostItem, Role } from '@/types';
import { slugify } from '@/utils/slug';

const route = useRoute();
const blogId = computed(() => (route.params as Record<string, string>).id);

definePage({
  meta: { roles: [Role.Any], layout: 'default' }
});

const blog = ref<Blog | null>(null);
const posts = ref<PostItem[]>([]);
const loading = ref(true);
const authStore = useAuthStore();
const { currentUser } = storeToRefs(authStore);

onMounted(async () => {
  blog.value = (await fetchBlog(blogId.value)) || null;
  posts.value = (await fetchBlogPosts(blogId.value)).slice(0, 3);
  loading.value = false;
});

const currentBlog = computed(() => blog.value);

const canEdit = computed(() => !!currentBlog.value && currentUser.value?.username === currentBlog.value?.authorHandle);
</script>

<route lang="yaml">
path: /blogs/:id/:slug?
</route>
