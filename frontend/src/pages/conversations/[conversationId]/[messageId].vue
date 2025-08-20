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

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchMessage } from '@/services/messages'
import { Role } from '@/types'

definePage({
  meta: { roles: [Role.User] },
})

const route = useRoute()
const conversationId = computed(() => (route.params as any).conversationId as string)
const messageId = computed(() => (route.params as any).messageId as string)
const message = ref<any | null>(null)
const loading = ref(true)

onMounted(async () => {
  message.value = (await fetchMessage(conversationId.value, messageId.value)) || null
  loading.value = false
})
</script>
