<template>
  <v-container>
    <template v-if="loading">
      <v-skeleton-loader type="article" />
    </template>
    <template v-else-if="message">
      <h1 class="text-h5 mb-2">{{ message.sender }}</h1>
      <p class="text-subtitle-1 mb-4">{{ message.time }}</p>
      <p>{{ message.text }}</p>
    </template>
    <v-empty-state v-else icon="mdi-email-off-outline" title="Message not found" />
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useMessage } from '@/services/messages';
import { Role } from '@/types';

definePage({
  meta: { roles: [Role.User], layout: 'default' }
});

const route = useRoute();
const conversationId = computed(() => (route.params as any).conversationId as string);
const messageId = computed(() => (route.params as any).messageId as string);

const { data: message, isLoading: loading } = useMessage(conversationId.value, messageId.value);
</script>
