<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="8" md="10">
        <div class="mb-10">
          <v-btn prepend-icon="mdi-arrow-left" :to="`/blogs/${blogId}`" variant="text">
            Zurück zu {{ currentPost.blogName }}
          </v-btn>
        </div>

        <div class="text-center mb-10">
          <v-chip class="mb-4" color="primary" variant="flat">
            {{ currentPost.category }}
          </v-chip>
          <h1 class="text-h3 font-weight-bold">{{ currentPost.title }}</h1>
          <p class="text-h6 text-medium-emphasis font-weight-regular mt-4">
            Veröffentlicht von {{ currentPost.author }} am {{ currentPost.date }}
          </p>
        </div>

        <v-img class="rounded-xl mb-10" cover height="400px" :src="currentPost.imageUrl" />

        <div class="text-body-1" style="line-height: 1.8">
          <p v-for="(p, i) in currentPost.content" :key="i" class="mb-6">
            {{ p }}
          </p>
        </div>

        <v-divider class="my-10" />

        <div class="d-flex align-center">
          <v-avatar>
            <v-img :src="currentPost.authorAvatarUrl" />
          </v-avatar>
          <div class="ml-4">
            <div class="font-weight-bold">{{ currentPost.author }}</div>
            <div class="text-caption text-medium-emphasis">Autor</div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

interface PostRouteParams {
  id: string;
  postId: string;
}

const route = useRoute()
const blogId = computed(() => (route.params as PostRouteParams).id)
const postId = computed(() => (route.params as PostRouteParams).postId)

// In a real app, you would fetch this data based on blogId and postId
const post = ref<{
  id: string;
  blogId: string;
  blogName: string;
  title: string;
  author: string;
  authorAvatarUrl: string;
  date: string;
  category: string;
  imageUrl: string;
  content: string[];
}>({ id: postId.value,
  blogId: blogId.value,
  blogName: 'Annas Gedanken',
  title: 'Mein Weg zum Minimalismus',
  author: 'Anna',
  authorAvatarUrl: 'https://randomuser.me/api/portraits/women/26.jpg',
  date: '15. August 2025',
  category: 'Lebensstil',
  imageUrl:
    'https://images.unsplash.com/photo-1484981138541-3d074aa97716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  content: [
    'Es begann alles mit einer einfachen Frage: Brauche ich das wirklich? Eine Reise zu weniger Besitz und mehr Freiheit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.',
    'Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh.',
  ],
})

const currentPost = computed(() => post.value)

// Demo logic to show a different post
if (postId.value === '201') {
  post.value.blogName = "Markus' Abenteuer"
  post.value.title = 'Wanderung zur Zugspitze'
  post.value.author = 'Markus'
  post.value.authorAvatarUrl = 'https://randomuser.me/api/portraits/men/32.jpg'
  post.value.imageUrl =
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
}
</script>
