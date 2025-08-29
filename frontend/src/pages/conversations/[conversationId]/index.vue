<template>
  <v-container>
    <template v-if="loading">
      <v-skeleton-loader type="heading, text, text, text" />
    </template>
    <template v-else-if="conversation">
      <h1 class="text-h4 mb-4">Conversation with {{ conversation.partner }}</h1>
      <v-list>
        <v-list-item
          v-for="msg in conversation.messages"
          :key="msg.id"
          :to="`/conversations/${conversation.id}/${msg.id}`"
        >
          <v-list-item-title>{{ msg.sender }}: {{ msg.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
    <v-empty-state v-else icon="mdi-message-off" title="Conversation not found" />
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useConversation } from '@/services/messages';
import { type ConversationId, Role } from '@/types';

definePage({
  meta: { roles: [Role.User], layout: 'default' }
});

const route = useRoute();
const conversationId = computed(() => (route.params as any).conversationId as ConversationId);

const { data: conversation, isLoading: loading } = useConversation(conversationId.value);
</script>
