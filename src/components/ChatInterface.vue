<template>
  <div class="flex flex-col h-[calc(100vh-12rem)]">
    <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index">
        <MessageBubble :message="message" />
      </div>
      <div v-if="isLoading" class="flex items-center space-x-2">
        <div class="animate-bounce">●</div>
        <div class="animate-bounce delay-100">●</div>
        <div class="animate-bounce delay-200">●</div>
      </div>
    </div>

    <div class="border-t border-gray-200 p-4">
      <ChatInput 
        @send-message="sendMessage" 
        :is-loading="isLoading"
        :current-language="currentLanguage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import MessageBubble from './MessageBubble.vue'
import ChatInput from './ChatInput.vue'
import { sendMessage as sendToAPI } from '../services/chatService'

const messages = ref([
  {
    text: 'Welcome to Chatspace! How can I help you today?',
    sender: 'bot',
    timestamp: new Date()
  }
])

const isLoading = ref(false)
const messagesContainer = ref(null)
const currentLanguage = ref('en')

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch(messages, scrollToBottom, { deep: true })

const sendMessage = async (text) => {
  if (!text.trim()) return

  messages.value.push({
    text,
    sender: 'user',
    timestamp: new Date()
  })

  isLoading.value = true

  try {
    const response = await sendToAPI(text, currentLanguage.value)
    
    messages.value.push({
      text: response,
      sender: 'bot',
      timestamp: new Date()
    })
  } catch (error) {
    const errorMessage = currentLanguage.value === 'en'
      ? error.message || 'Sorry, I encountered an error. Please try again.'
      : 'Kechirasiz, xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.'
    
    messages.value.push({
      text: errorMessage,
      sender: 'bot',
      timestamp: new Date(),
      isError: true
    })
  } finally {
    isLoading.value = false
  }
}

const updateLanguage = (lang) => {
  currentLanguage.value = lang
}

defineExpose({
  updateLanguage
})
</script> 