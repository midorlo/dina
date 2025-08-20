<template>
  <v-container>
    <!-- Blog Header -->
    <v-row justify="center">
      <v-col class="text-center" cols="12" lg="8" md="10">
        <v-avatar class="mb-4 elevation-4" size="120">
          <v-img :src="currentBlog.authorAvatarUrl" />
        </v-avatar>
        <h1 class="text-h3 font-weight-bold">{{ currentBlog.name }}</h1>
        <p class="text-h6 text-medium-emphasis font-weight-regular mt-2">
          {{ currentBlog.description }}
        </p>
        <div class="mt-4">
          <v-chip class="mr-2">{{ currentBlog.postCount }} Beiträge</v-chip>
          <v-chip>Erstellt am {{ currentBlog.createdAt }}</v-chip>
        </div>
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
          :to="{
            name: '/blogs/[id]/posts/[postId]',
            params: { id: currentBlog.id, postId: String(post.id) },
          }"
        >
          <v-card-title>{{ post.title }}</v-card-title>
          <v-card-subtitle>{{ post.createdAt }}</v-card-subtitle>
          <v-card-text>{{ post.excerpt }}</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn append-icon="mdi-arrow-right" color="primary" variant="text">
              Beitrag lesen
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { Blog, PostItem } from '@/types'

const route = useRoute('/blogs/[id]/')
const blogId = computed(() => route.params.id)

// In a real app, you would fetch this data based on blogId.value
const blog = ref<Blog>({
  id: blogId.value,
  name: 'Annas Gedanken',
  description:
    'Ein Einblick in einen aufgeräumten Lebensstil und wie er zu mehr Klarheit führen kann.',
  authorAvatarUrl: 'https://randomuser.me/api/portraits/women/26.jpg',
  postCount: 3,
  createdAt: '12. Mai 2024',
})

const currentBlog = computed(() => blog.value)

const posts = ref<PostItem[]>([
  {
    id: 101,
    title: 'Mein Weg zum Minimalismus',
    createdAt: '15. August 2025',
    excerpt:
      'Es begann alles mit einer einfachen Frage: Brauche ich das wirklich? Eine Reise zu weniger Besitz und mehr Freiheit.',
  },
  {
    id: 102,
    title: 'Die 5-Minuten-Regel für mehr Ordnung',
    createdAt: '02. Juli 2025',
    excerpt:
      'Ein einfacher Trick, der mir geholfen hat, mein Zuhause dauerhaft ordentlich zu halten, ohne großen Aufwand.',
  },
  {
    id: 103,
    title: 'Digital Detox: Erfahrungen & Tipps',
    createdAt: '21. Juni 2025',
    excerpt:
      'Eine Woche ohne Smartphone. Was ich gelernt habe und wie auch du eine digitale Auszeit schaffen kannst.',
  },
])

// This is just for the demo to show a different blog based on id
if (blogId.value === '2') {
  blog.value = {
    id: '2',
    name: "Markus' Abenteuer",
    description:
      'Atemberaubende Landschaften und unvergessliche Momente auf meinen Reisen durch die Welt.',
    authorAvatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    postCount: 2,
    createdAt: '01. Januar 2024',
  }
  posts.value = [
    {
      id: 201,
      title: 'Wanderung zur Zugspitze',
      createdAt: '10. August 2025',
      excerpt:
        'Ein anstrengender Aufstieg, der mit einer unglaublichen Aussicht belohnt wurde. Mein Erfahrungsbericht.',
    },
    {
      id: 202,
      title: 'Mit dem Rucksack durch Vietnam',
      createdAt: '15. März 2025',
      excerpt:
        'Von lauten Städten bis zu stillen Reisfeldern. Eine Reise voller Kontraste und unvergesslicher Begegnungen.',
    },
  ]
}
</script>
