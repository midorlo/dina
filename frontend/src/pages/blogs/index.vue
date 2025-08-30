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
            class="d-flex flex-column"
            height="100%"
            hover
            rounded="xl"
            @click="router.push(`/blogs/${blog.id}/${slugify(blog.name)}`)"
          >
            <v-card-item>
              <template #prepend>
                <v-avatar>
                  <v-img :src="blog.authorAvatarUrl" />
                </v-avatar>
              </template>
              <v-card-title>{{ blog.name }}</v-card-title>
              <v-card-subtitle>@{{ blog.authorHandle }}</v-card-subtitle>
            </v-card-item>

            <v-card-text class="text-body-2 flex-grow-1">
              {{ blog.description }}
            </v-card-text>

            <v-divider class="my-2" />

            <v-card-actions class="pt-0">
              <v-chip size="small" variant="tonal">
                <v-icon icon="mdi-post-outline" start />
                {{ blog.postCount }} Beiträge
              </v-chip>
              <v-chip v-if="blog.lastPostAt" size="small" variant="tonal">
                <v-icon icon="mdi-clock-outline" start />
                Letzter Beitrag {{ timeAgo(blog.lastPostAt) }}
              </v-chip>
              <v-spacer />
              <v-btn color="primary" :to="`/blogs/${blog.id}/${slugify(blog.name)}`" variant="text">
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
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBlogs } from '@/services/blogs';
import { Role } from '@/types';
import { slugify } from '@/utils/slug';
import { timeAgo } from '@/utils/time';

definePage({
  meta: {
    roles: [Role.Any],
    layout: 'default',
    breadcrumb: 'Übersicht'
  }
});

const router = useRouter();
const { data, isLoading: loading } = useBlogs();
const blogs = computed(() => data.value ?? []);
</script>

<style scoped>
.v-card-title {
  line-height: 1.2rem;
}
</style>
