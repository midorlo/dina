<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" lg="8" md="10">
        <v-card
          class="pa-6 d-flex flex-column"
          flat
          rounded="xl"
          style="height: calc(100vh - 96px)"
        >
          <v-card-title class="text-h4 font-weight-bold mb-4">Messages</v-card-title>
          <v-card-subtitle class="mb-6">Your private conversations</v-card-subtitle>

          <template v-if="loading">
            <v-row class="flex-grow-1">
              <v-col cols="12" md="4">
                <v-skeleton-loader
                  v-for="n in 5"
                  :key="n"
                  class="mb-2"
                  type="list-item-avatar-two-line"
                />
              </v-col>
              <v-col class="d-flex flex-column" cols="12" md="8">
                <v-skeleton-loader class="mb-4" type="heading" />
                <v-skeleton-loader v-for="n in 6" :key="n" class="mb-2" type="text" />
              </v-col>
            </v-row>
          </template>

          <template v-else>
            <v-row class="flex-grow-1">
              <!-- Conversation List (Left Pane) -->
              <v-col class="d-flex flex-column" cols="12" md="4">
                <v-sheet class="pa-4 flex-grow-1 d-flex flex-column" rounded="lg">
                  <v-card-title class="text-h6 font-weight-bold mb-4">Conversations</v-card-title>
                  <v-list class="flex-grow-1" style="overflow-y: auto">
                    <v-list-item
                      v-for="conversation in conversations"
                      :key="conversation.id"
                      class="mb-2"
                      link
                      prepend-avatar="https://cdn.vuetifyjs.com/images/john-smirk.png"
                      rounded="lg"
                      :subtitle="conversation.lastMessage"
                      :title="conversation.partner"
                      @click="selectConversation(conversation)"
                    >
                      <template #append>
                        <v-badge
                          v-if="conversation.unreadCount > 0"
                          class="mr-2"
                          color="primary"
                          :content="conversation.unreadCount"
                          inline
                        />
                        <span class="text-caption">{{ conversation.time }}</span>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-sheet>
              </v-col>

              <!-- Message View (Right Pane) -->
              <v-col class="d-flex flex-column" cols="12" md="8">
                <v-sheet class="pa-4 flex-grow-1 d-flex flex-column" rounded="lg">
                  <v-card-title class="text-h6 font-weight-bold mb-4">
                    <v-avatar class="mr-2" size="40">
                      <v-img src="https://cdn.vuetifyjs.com/images/john-smirk.png" />
                    </v-avatar>
                    {{
                      selectedConversation ? selectedConversation.partner : 'Select a conversation'
                    }}
                  </v-card-title>

                  <div
                    ref="messageArea"
                    class="message-area flex-grow-1"
                    style="
                      border: 1px solid #eee;
                      padding: 16px;
                      border-radius: 8px;
                      overflow-y: auto;
                    "
                  >
                    <div v-if="selectedConversation">
                      <div
                        v-for="message in selectedConversation.messages"
                        :key="message.id"
                        class="mb-2"
                      >
                        <div :class="{ 'text-right': message.sender === 'You' }">
                          <span
                            class="pa-2 rounded-lg d-inline-block"
                            :class="{
                              'bg-primary text-white': message.sender === 'You',
                              'bg-grey-lighten-2': message.sender !== 'You',
                            }"
                          >
                            {{ message.text }}
                          </span>
                          <div class="text-caption text-medium-emphasis mt-1">
                            {{ message.sender }} - {{ message.time }}
                            <v-icon
                              v-if="message.sender === 'You'"
                              :color="message.read ? 'primary' : 'grey-darken-1'"
                              size="small"
                            >
                              {{ message.read ? 'mdi-check-all' : 'mdi-check' }}
                            </v-icon>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-center text-medium-emphasis">
                      No conversation selected.
                    </div>
                  </div>

                  <v-text-field
                    v-model="newMessage"
                    append-inner-icon="mdi-send"
                    class="mt-4"
                    density="comfortable"
                    label="Type your message..."
                    prepend-inner-icon="mdi-message-text-outline"
                    rounded="pill"
                    variant="outlined"
                    @click:append-inner="sendMessage"
                    @keyup.enter="sendMessage"
                  />
                </v-sheet>
              </v-col>
            </v-row>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import { fetchConversations } from '@/services/messages'
import { type Conversation, Role } from '@/types'

definePage({
  meta: { roles: [Role.User], layout: 'default' },
})

const conversations = ref<Conversation[]>([])
const selectedConversation = ref<Conversation | null>(null)
const newMessage = ref('')
const messageArea = ref<HTMLElement | null>(null)
const loading = ref(true)

onMounted(async () => {
  conversations.value = await fetchConversations()
  selectedConversation.value = conversations.value[0] ?? null
  loading.value = false
})

function selectConversation(conversation: Conversation) {
  selectedConversation.value = conversation
  conversation.unreadCount = 0
}

function sendMessage() {
  if (newMessage.value.trim() === '' || !selectedConversation.value) return

  selectedConversation.value.messages.push({
    id: selectedConversation.value.messages.length + 1,
    sender: 'You',
    text: newMessage.value,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    read: false,
  })
  selectedConversation.value.lastMessage = newMessage.value
  newMessage.value = ''
}

watch(
  selectedConversation,
  () => {
    nextTick(() => {
      if (messageArea.value) {
        messageArea.value.scrollTop = messageArea.value.scrollHeight
      }
    })
  },
  { deep: true }
)

watch(newMessage, () => {
  nextTick(() => {
    if (messageArea.value) {
      messageArea.value.scrollTop = messageArea.value.scrollHeight
    }
  })
})
</script>

<style scoped>
/* Add any specific styles for messages page here if needed */
</style>
