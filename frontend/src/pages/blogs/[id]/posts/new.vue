<template>
  <v-container>
    <v-form @submit.prevent="create">
      <v-text-field v-model="post.title" class="mb-4" label="Title" />
      <v-textarea v-model="post.excerpt" class="mb-4" label="Excerpt" />
      <v-btn color="primary" type="submit">Create</v-btn>
    </v-form>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { Role } from '@/types';

definePage({
  meta: { roles: [Role.User], layout: 'default' }
});

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const blogId = computed(() => (route.params as any).id as string);
const blogSlug = computed(() => (route.params as any).slug as string | undefined);
const post = reactive({ title: '', excerpt: '' });

function create() {
  if (blogId.value !== auth.currentUser?.id) {
    router.replace('/error/403');
    return;
  }
  console.log('Creating post', post);
  router.push(`/blogs/${blogId.value}${blogSlug.value ? `-${blogSlug.value}` : ''}/posts`);
}
</script>

<route lang="yaml">
path: /blogs/:id-:slug?/posts/new
</route>
