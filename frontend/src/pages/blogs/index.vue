<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Community-Blogs</h1>
        <p class="text-medium-emphasis mb-8">
          Entdecke die persönlichen Blogs unserer Mitglieder.
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="blog in blogs"
        :key="blog.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card
          flat
          class="pa-3"
          rounded="xl"
          border
          height="100%"
          @click="$router.push(`/blogs/${blog.id}`)"
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
            <v-btn
              variant="text"
              color="primary"
              :to="`/blogs/${blog.id}`"
            >
              Blog ansehen
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// This now represents a list of blogs, identified by a user/author.
const blogs = ref([
  { id: 1, name: 'Annas Gedanken', authorHandle: 'anna', authorAvatarUrl: 'https://randomuser.me/api/portraits/women/26.jpg', description: 'Ein Einblick in einen aufgeräumten Lebensstil und wie er zu mehr Klarheit führen kann.' },
  { id: 2, name: 'Markus\' Abenteuer', authorHandle: 'markus', authorAvatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg', description: 'Atemberaubende Landschaften und unvergessliche Momente auf meinen Reisen durch die Welt.' },
  { id: 3, name: 'Julias Küche', authorHandle: 'julia', authorAvatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg', description: 'Einfache Rezepte, die immer gelingen. Entdecke die Freude am Kochen, Schritt für Schritt.' },
  { id: 4, name: 'Toms grüner Daumen', authorHandle: 'tom', authorAvatarUrl: 'https://randomuser.me/api/portraits/men/51.jpg', description: 'Wie du auch ohne Garten frisches Gemüse und Kräuter anbauen kannst.' },
  { id: 5, name: 'Celinas Sternenbilder', authorHandle: 'celina', authorAvatarUrl: 'https://randomuser.me/api/portraits/women/65.jpg', description: 'Die Sterne fotografieren: Welche Ausrüstung du brauchst und die besten Tipps für den Anfang.' },
])
</script>

<style scoped>
.v-card {
  transition: all 0.2s ease-in-out;
}
.v-card:hover {
  transform: translateY(-4px);
  border-color: rgba(var(--v-theme-primary), 0.6) !important;
}
.v-card-title {
  line-height: 1.2rem;
}
</style>
