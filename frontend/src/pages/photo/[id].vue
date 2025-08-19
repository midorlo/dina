<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-img :src="`https://picsum.photos/id/${$route.params.id}/800/600`" />
          <v-card-title>Photo {{ $route.params.id }}</v-card-title>
          <v-card-text>
            This is the detail page for photo {{ $route.params.id }}.
            <br>
            <br>
            NOTE: The original content of this file was overwritten by mistake. Please check the content and restore it if necessary.
          </v-card-text>
          <v-card-actions>
            <v-btn to="/gallery">Back to Gallery</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
//
</script>
