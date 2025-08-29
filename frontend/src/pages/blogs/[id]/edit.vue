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
import { computed, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBlog } from '@/services/blogs';
import { useAuthStore } from '@/stores/auth';
import { Role } from '@/types';
import { slugify } from '@/utils/slug';

definePage({
  meta: { roles: [Role.User], layout: 'default' }
});

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const blogId = computed(() => (route.params as any).id as string);

// Use the query hook
const { data: blogData, isLoading: loading } = useBlog(blogId.value);

const blog = reactive({ name: '', description: '' });

// Watch for the data to come in from the query
watch(blogData, newData => {
  if (newData) {
    // Check for authorization before updating the form
    if (newData.authorId !== auth.currentUser?.id) {
      router.replace('/error/403');
      return;
    }
    Object.assign(blog, { name: newData.name, description: newData.description });
  }
});

async function save() {
  // placeholder save
  console.log('Saving blog', blog);
  router.push(`/blogs/${blogId.value}/${slugify(blog.name)}`);
}
</script>

<route lang="yaml">
path: /blogs/:id-:slug?/edit
</route>
