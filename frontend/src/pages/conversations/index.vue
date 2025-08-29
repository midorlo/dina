<template>
  <v-container class="fill-height pa-0" fluid>
    <!-- Desktop Layout: Master-Detail -->
    <v-row v-if="mdAndUp" class="fill-height ma-0">
      <!-- Conversation List -->
      <v-col class="d-flex flex-column fill-height pa-0" cols="4">
        <v-sheet class="d-flex flex-column fill-height" flat>
          <div class="pa-4">
            <v-card-title class="text-h5 font-weight-bold">Messages</v-card-title>
            <v-card-subtitle>Your private conversations</v-card-subtitle>
          </div>
          <v-divider />
          <v-list class="flex-grow-1" style="overflow-y: auto">
            <v-list-item
              v-for="conversation in conversations"
              :key="conversation.id"
              :active="selectedConversation?.id === conversation.id"
              class="mx-2 mb-1"
              link
              :prepend-avatar="conversation.avatar"
              rounded="lg"
              :subtitle="conversation.lastMessage"
              :title="conversation.partner"
              @click="selectConversation(conversation)"
            >
              <template #append>
                <div class="d-flex flex-column align-end">
                  <span class="text-caption text-medium-emphasis">{{ conversation.time }}</span>
                  <v-badge
                    v-if="conversation.unreadCount > 0"
                    class="mt-1"
                    color="primary"
                    :content="conversation.unreadCount"
                    inline
                  />
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-sheet>
      </v-col>

      <v-divider vertical />

      <!-- Message View -->
      <v-col class="d-flex flex-column fill-height pa-0" cols="8">
        <v-sheet v-if="selectedConversation" class="d-flex flex-column fill-height" flat>
          <!-- Chat Header -->
          <div class="d-flex align-center pa-3">
            <v-avatar class="me-3" size="40">
              <v-img :src="selectedConversation.avatar" />
            </v-avatar>
            <div class="flex-grow-1">
              <div class="text-subtitle-1 font-weight-bold">{{ selectedConversation.partner }}</div>
              <div class="text-caption">Online</div>
            </div>
            <v-spacer />
            <v-btn icon="mdi-magnify" variant="text" />
            <v-btn icon="mdi-dots-vertical" variant="text" />
          </div>
          <v-divider />

          <!-- Message Area -->
          <div ref="messageArea" class="flex-grow-1 pa-4" style="overflow-y: auto">
            <div v-for="message in selectedConversation.messages" :key="message.id" class="d-flex my-2">
              <div
                v-if="message.sender !== 'You'"
                class="d-flex align-end"
                :class="{ 'ms-auto': message.sender === 'You' }"
              >
                <v-avatar class="me-2" size="32">
                  <v-img :src="selectedConversation.avatar" />
                </v-avatar>
                <v-sheet class="pa-3" max-width="320" rounded="lg" theme="light">
                  <p class="text-body-2">{{ message.text }}</p>
                  <div class="text-caption text-medium-emphasis text-right mt-1">{{ message.time }}</div>
                </v-sheet>
              </div>
              <div v-else class="d-flex align-end ms-auto">
                <v-sheet class="bg-primary pa-3" max-width="320" rounded="lg">
                  <p class="text-body-2">{{ message.text }}</p>
                  <div class="text-caption text-right mt-1" style="opacity: 0.8">
                    {{ message.time }}
                    <v-icon :color="message.read ? 'white' : 'transparent'" size="small"> mdi-check-all </v-icon>
                  </div>
                </v-sheet>
              </div>
            </div>
          </div>

          <!-- Message Input -->
          <v-sheet class="pa-4" flat>
            <v-text-field
              v-model="newMessage"
              append-inner-icon="mdi-send"
              auto-grow
              bg-color="surface-variant"
              density="comfortable"
              hide-details
              label="Type your message..."
              max-rows="5"
              rounded="pill"
              rows="1"
              variant="solo-filled"
              @click:append-inner="sendMessage"
              @keyup.enter="sendMessage"
            />
          </v-sheet>
        </v-sheet>
        <v-empty-state
          v-else
          class="ma-auto"
          headline="Select a conversation"
          icon="mdi-message-arrow-left-outline"
          text="Choose a conversation from the list to start chatting."
        />
      </v-col>
    </v-row>

    <!-- Mobile Layout: Single View -->
    <div v-else class="fill-height">
      <!-- Conversation List (Mobile) -->
      <v-sheet v-if="!selectedConversation" class="d-flex flex-column fill-height">
        <div class="pa-4">
          <v-card-title class="text-h5 font-weight-bold">Messages</v-card-title>
        </div>
        <v-divider />
        <v-list class="flex-grow-1" style="overflow-y: auto">
          <v-list-item
            v-for="conversation in conversations"
            :key="conversation.id"
            class="mx-2 mb-1"
            link
            :prepend-avatar="conversation.avatar"
            rounded="lg"
            :subtitle="conversation.lastMessage"
            :title="conversation.partner"
            @click="selectConversation(conversation)"
          >
            <template #append>
              <div class="d-flex flex-column align-end">
                <span class="text-caption text-medium-emphasis">{{ conversation.time }}</span>
                <v-badge
                  v-if="conversation.unreadCount > 0"
                  class="mt-1"
                  color="primary"
                  :content="conversation.unreadCount"
                  inline
                />
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-sheet>

      <!-- Message View (Mobile) -->
      <v-sheet v-if="selectedConversation" class="d-flex flex-column fill-height" flat>
        <!-- Chat Header -->
        <div class="d-flex align-center pa-2">
          <v-btn icon="mdi-arrow-left" variant="text" @click="selectedConversation = null" />
          <v-avatar class="me-2" size="36">
            <v-img :src="selectedConversation.avatar" />
          </v-avatar>
          <div class="flex-grow-1">
            <div class="text-subtitle-1 font-weight-bold">{{ selectedConversation.partner }}</div>
          </div>
          <v-btn icon="mdi-dots-vertical" variant="text" />
        </div>
        <v-divider />

        <!-- Message Area -->
        <div ref="messageArea" class="flex-grow-1 pa-4" style="overflow-y: auto">
          <div v-for="message in selectedConversation.messages" :key="message.id" class="d-flex my-2">
            <div
              v-if="message.sender !== 'You'"
              class="d-flex align-end"
              :class="{ 'ms-auto': message.sender === 'You' }"
            >
              <v-avatar class="me-2" size="32">
                <v-img :src="selectedConversation.avatar" />
              </v-avatar>
              <v-sheet class="pa-3" max-width="320" rounded="lg" theme="light">
                <p class="text-body-2">{{ message.text }}</p>
                <div class="text-caption text-medium-emphasis text-right mt-1">{{ message.time }}</div>
              </v-sheet>
            </div>
            <div v-else class="d-flex align-end ms-auto">
              <v-sheet class="bg-primary pa-3" max-width="320" rounded="lg">
                <p class="text-body-2">{{ message.text }}</p>
                <div class="text-caption text-right mt-1" style="opacity: 0.8">
                  {{ message.time }}
                  <v-icon :color="message.read ? 'white' : 'transparent'" size="small"> mdi-check-all </v-icon>
                </div>
              </v-sheet>
            </div>
          </div>
        </div>

        <!-- Message Input -->
        <v-sheet class="pa-2" flat>
          <v-text-field
            v-model="newMessage"
            append-inner-icon="mdi-send"
            auto-grow
            bg-color="surface-variant"
            density="comfortable"
            hide-details
            label="Type your message..."
            max-rows="5"
            rounded="pill"
            rows="1"
            variant="solo-filled"
            @click:append-inner="sendMessage"
            @keyup.enter="sendMessage"
          />
        </v-sheet>
      </v-sheet>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue';
import { useDisplay } from 'vuetify';
import { useAutoScroll } from '@/composables/useAutoScroll';
import { useConversations } from '@/services/messages';
import { type Conversation, type Message, Role } from '@/types';

definePage({
  meta: { roles: [Role.User], layout: 'default', breadcrumb: 'Messages' }
});

const { mdAndUp } = useDisplay();

// --- Data Fetching with Vue Query ---
const { data: conversations, isLoading: loading } = useConversations();

// --- Local State ---
const selectedConversation = ref<Conversation | null>(null);
const newMessage = ref('');
const messageArea = ref<HTMLElement | null>(null);
const { scrollToBottom } = useAutoScroll(messageArea);

// --- Logic ---

// When conversations data loads, select the first one on desktop
watch(conversations, newConversations => {
  if (mdAndUp.value && !selectedConversation.value && newConversations && newConversations.length > 0) {
    selectedConversation.value = newConversations[0];
  }
});

// When switching between mobile and desktop, adjust the selected conversation
watch(mdAndUp, isDesktop => {
  if (isDesktop && !selectedConversation.value && conversations.value && conversations.value.length > 0) {
    selectedConversation.value = conversations.value[0];
  }
});

function selectConversation(conversation: Conversation) {
  selectedConversation.value = conversation;
  // In a real app, this would be part of the message marking API call
  if (conversation.unreadCount > 0) {
    conversation.unreadCount = 0;
  }
  nextTick(scrollToBottom);
}

// TODO: This should be a useMutation call to send the message to the backend
// and then invalidate the query to refetch the conversation.
function sendMessage() {
  if (newMessage.value.trim() === '' || !selectedConversation.value) return;

  const message: Message = {
    id: (selectedConversation.value.messages.length + 1).toString(),
    sender: 'You',
    text: newMessage.value,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    read: false
  };
  selectedConversation.value.messages.push(message);
  selectedConversation.value.lastMessage = newMessage.value;
  newMessage.value = '';
  nextTick(scrollToBottom);
}
</script>

<style scoped>
/* Remove default padding from v-list-item on mobile if needed */
</style>
