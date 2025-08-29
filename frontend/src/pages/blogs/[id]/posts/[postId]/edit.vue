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
import { computed, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBlogPost } from '@/services/blogs';
import { useAuthStore } from '@/stores/auth';
import { Role } from '@/types';
import { slugify } from '@/utils/slug';

definePage({
  meta: { roles: [Role.User], layout: 'default', breadcrumb: 'Beitrag bearbeiten' }
});

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const blogId = computed(() => (route.params as any).id as string);
const blogSlug = computed(() => (route.params as any).slug as string | undefined);
const postId = computed(() => (route.params as any).postId as string);

const { data: postData, isLoading: loading } = useBlogPost(blogId.value, postId.value);

const post = reactive({ title: '', excerpt: '' });

watch(postData, newData => {
  if (newData) {
    // Authorization check
    // This assumes the blog's authorId is available in the post data
    // If not, you'd need to fetch the blog data separately or pass authorId
    // from the parent route/component.
    const blogAuthor = newData.author; // Use 'author' property
    if (blogAuthor !== auth.currentUser?.username) {
      // Compare with username
      router.replace('/error/403');
      return;
    }
    Object.assign(post, { title: newData.title, excerpt: newData.content?.[0] || '' });
  }
});

async function save() {
  console.log('Saving post', post);
  router.push(
    `/blogs/${blogId.value}${blogSlug.value ? `-${blogSlug.value}` : ''}/posts/${postId.value}-${slugify(post.title)}`
  );
}
</script>

<route lang="yaml">
path: /blogs/:id-:slug?/posts/:postId-:postSlug?/edit
</route>
