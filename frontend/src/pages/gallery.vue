<template>
  <v-container fluid>
    <v-toolbar color="transparent">
      <v-spacer />
      <v-btn-toggle v-model="density" mandatory rounded="pill">
        <v-btn icon="mdi-view-grid-outline" value="large" />
        <v-btn icon="mdi-view-grid-compact" value="medium" />
        <v-btn icon="mdi-view-module-outline" value="small" />
      </v-btn-toggle>
    </v-toolbar>

    <div class="masonry-container" :style="{ 'column-count': columnCount }">
      <div v-for="item in items" :key="item.id" class="masonry-item">
        <router-link :to="`/photo/${item.id}`">
          <v-img
            :aspect-ratio="item.aspectRatio"
            class="bg-grey-lighten-2 rounded-lg"
            cover
            :lazy-src="item.lazySrc"
            :src="item.src"
          >
            <template #lazy-content>
              <v-row
                align="center"
                class="fill-height ma-0"
                justify="center"
              >
                <v-progress-circular
                  color="grey-lighten-5"
                  indeterminate
                />
              </v-row>
            </template>
          </v-img>
        </router-link>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useDisplay } from 'vuetify'

  const { name } = useDisplay()
  const density = ref('medium') // 'large', 'medium', 'small'

  const columnCount = computed(() => {
    switch (name.value) {
      case 'xs': {
        return density.value === 'large' ? 1 : 2
      }
      case 'sm': {
        if (density.value === 'large') return 2
        if (density.value === 'medium') return 3
        return 4
      }
      default: {
        if (density.value === 'large') return 2
        if (density.value === 'medium') return 3
        return 6
      }
    }
  })

  const items = ref([
    {
      id: 15,
      src: 'https://picsum.photos/500/300?image=15',
      lazySrc: 'https://picsum.photos/10/6?image=15',
      aspectRatio: 500 / 300,
    },
    {
      id: 25,
      src: 'https://picsum.photos/400/600?image=25',
      lazySrc: 'https://picsum.photos/8/12?image=25',
      aspectRatio: 400 / 600,
    },
    {
      id: 35,
      src: 'https://picsum.photos/600/400?image=35',
      lazySrc: 'https://picsum.photos/12/8?image=35',
      aspectRatio: 600 / 400,
    },
    {
      id: 45,
      src: 'https://picsum.photos/300/500?image=45',
      lazySrc: 'https://picsum.photos/6/10?image=45',
      aspectRatio: 300 / 500,
    },
    {
      id: 55,
      src: 'https://picsum.photos/700/500?image=55',
      lazySrc: 'https://picsum.photos/14/10?image=55',
      aspectRatio: 700 / 500,
    },
    {
      id: 65,
      src: 'https://picsum.photos/500/700?image=65',
      lazySrc: 'https://picsum.photos/10/14?image=65',
      aspectRatio: 500 / 700,
    },
    {
      id: 11,
      src: 'https://picsum.photos/500/300?image=11',
      lazySrc: 'https://picsum.photos/10/6?image=11',
      aspectRatio: 500 / 300,
    },
    {
      id: 22,
      src: 'https://picsum.photos/400/600?image=22',
      lazySrc: 'https://picsum.photos/8/12?image=22',
      aspectRatio: 400 / 600,
    },
    {
      id: 33,
      src: 'https://picsum.photos/600/400?image=33',
      lazySrc: 'https://picsum.photos/12/8?image=33',
      aspectRatio: 600 / 400,
    },
    {
      id: 44,
      src: 'https://picsum.photos/300/500?image=44',
      lazySrc: 'https://picsum.photos/6/10?image=44',
      aspectRatio: 300 / 500,
    },
    {
      id: 51,
      src: 'https://picsum.photos/700/500?image=51',
      lazySrc: 'https://picsum.photos/14/10?image=51',
      aspectRatio: 700 / 500,
    },
    {
      id: 62,
      src: 'https://picsum.photos/500/700?image=62',
      lazySrc: 'https://picsum.photos/10/14?image=62',
      aspectRatio: 500 / 700,
    },
  ])
</script>

<style scoped>
.masonry-container {
  column-gap: 16px;
}
.masonry-item {
  display: inline-block;
  vertical-align: top;
  width: 100%;
  margin-bottom: 16px;
}
</style>
