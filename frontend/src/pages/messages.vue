<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" lg="8" md="10">
        <v-card class="pa-6 d-flex flex-column" flat rounded="xl" style="height: calc(100vh - 96px);">
          <v-card-title class="text-h4 font-weight-bold mb-4">Messages</v-card-title>
          <v-card-subtitle class="mb-6">Your private conversations</v-card-subtitle>

          <v-row class="flex-grow-1">
            <!-- Conversation List (Left Pane) -->
            <v-col class="d-flex flex-column" cols="12" md="4">
              <v-sheet class="pa-4 flex-grow-1 d-flex flex-column" rounded="lg">
                <v-card-title class="text-h6 font-weight-bold mb-4">Conversations</v-card-title>
                <v-list class="flex-grow-1" style="overflow-y: auto;">
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
                  {{ selectedConversation ? selectedConversation.partner : 'Select a conversation' }}
                </v-card-title>

                <div ref="messageArea" class="message-area flex-grow-1" style="border: 1px solid #eee; padding: 16px; border-radius: 8px; overflow-y: auto;">
                  <div v-if="selectedConversation">
                    <div v-for="message in selectedConversation.messages" :key="message.id" class="mb-2">
                      <div :class="{'text-right': message.sender === 'You'}">
                        <span class="pa-2 rounded-lg d-inline-block" :class="{'bg-primary text-white': message.sender === 'You', 'bg-grey-lighten-2': message.sender !== 'You'}">
                          {{ message.text }}
                        </span>
                        <div class="text-caption text-medium-emphasis mt-1">
                          {{ message.sender }} - {{ message.time }}
                          <v-icon v-if="message.sender === 'You'" :color="message.read ? 'primary' : 'grey-darken-1'" size="small">
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
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { nextTick, ref, watch } from 'vue'

  const conversations = ref([
    {
      id: 1,
      partner: 'Alice',
      lastMessage: 'Hey, how are you? Long time no see!',
      time: '10:30 AM',
      unreadCount: 2, // Alice has unread messages
      messages: [
        { id: 1, sender: 'Alice', text: 'Hi there!', time: '10:28 AM' },
        { id: 2, sender: 'You', text: 'Hey, how are you?', time: '10:30 AM' },
        { id: 3, sender: 'Alice', text: 'I\'m doing great, thanks! How about you?', time: '10:32 AM' },
        { id: 4, sender: 'You', text: 'All good here. Just busy with work.', time: '10:35 AM' },
        { id: 5, sender: 'Alice', text: 'Same here! We should catch up soon.', time: '10:40 AM' },
      ],
    },
    {
      id: 2,
      partner: 'Bob',
      lastMessage: 'See you tomorrow for the project meeting!',
      time: 'Yesterday',
      unreadCount: 0,
      messages: [
        { id: 6, sender: 'Bob', text: 'Are you free tomorrow for the project meeting?', time: 'Yesterday 3:00 PM' },
        { id: 7, sender: 'You', text: 'Yes, I am. What time?', time: 'Yesterday 3:05 PM' },
        { id: 8, sender: 'Bob', text: 'At 10 AM. See you then!', time: 'Yesterday 3:10 PM' },
        { id: 9, sender: 'You', text: 'Got it. See you tomorrow!', time: 'Yesterday 3:15 PM' },
      ],
    },
    {
      id: 3,
      partner: 'Charlie',
      lastMessage: 'Don\'t forget the report deadline is Friday.',
      time: '2 days ago',
      unreadCount: 1, // Charlie has unread messages
      messages: [
        { id: 10, sender: 'Charlie', text: 'Hi, just a reminder about the report.', time: '2 days ago 9:00 AM' },
        { id: 11, sender: 'You', text: 'Thanks for the reminder!', time: '2 days ago 9:05 AM' },
        { id: 12, sender: 'Charlie', text: 'No problem. The deadline is Friday.', time: '2 days ago 9:10 AM' },
      ],
    },
    {
      id: 4,
      partner: 'David',
      lastMessage: 'Sounds good! Let me know if you need anything else.',
      time: 'Last week',
      unreadCount: 0,
      messages: [
        { id: 13, sender: 'You', text: 'Can you send me the updated figures?', time: 'Last week' },
        { id: 14, sender: 'David', text: 'Sure, I\'ll send them over.', time: 'Last week' },
        { id: 15, sender: 'You', text: 'Thanks!', time: 'Last week' },
        { id: 16, sender: 'David', text: 'Sounds good! Let me know if you need anything else.', time: 'Last week' },
      ],
    },
    {
      id: 5,
      partner: 'Eve',
      lastMessage: 'Are you coming to the team lunch?',
      time: 'Just now',
      unreadCount: 3, // Eve has unread messages
      messages: [
        { id: 17, sender: 'Eve', text: 'Hey, are you free for a quick chat?', time: 'Just now' },
        { id: 18, sender: 'Eve', text: 'I wanted to ask about the new feature.', time: 'Just now' },
        { id: 19, sender: 'Eve', text: 'Are you coming to the team lunch?', time: 'Just now' },
      ],
    },
  ])

  const selectedConversation = ref(conversations.value[0])
  const newMessage = ref('')
  const messageArea = ref<HTMLElement | null>(null) // Added ref for message area

  function selectConversation (conversation: any) {
    selectedConversation.value = conversation
    conversation.unreadCount = 0 // Clear unread count when selected
  }

  function sendMessage () {
    if (newMessage.value.trim() === '') return

    if (selectedConversation.value) {
      selectedConversation.value.messages.push({
        id: selectedConversation.value.messages.length + 1,
        sender: 'You',
        text: newMessage.value,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false, // New message is initially unread by recipient
      })
      selectedConversation.value.lastMessage = newMessage.value
      newMessage.value = ''
    }
  }

  watch(selectedConversation, () => {
    nextTick(() => {
      if (messageArea.value) {
        messageArea.value.scrollTop = messageArea.value.scrollHeight
      }
    })
  }, { deep: true }) // Watch for changes in selectedConversation and its messages

  watch(newMessage, () => { // Watch for new messages being typed
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
