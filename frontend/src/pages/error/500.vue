<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" sm="8">
        <v-card class="pa-6" flat rounded="xl">
          <h1 class="text-h1 font-weight-bold text-center primary-text mb-4">500</h1>
          <h2 class="text-h5 text-center mb-3">Internal Server Error</h2>
          <p class="text-subtitle-1 text-center mb-6">Something went wrong on our side.</p>
          <v-btn block color="primary" rounded="pill" size="large" to="/">Go to Home</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
definePage({
  meta: { layout: 'empty' }
});
</script>
