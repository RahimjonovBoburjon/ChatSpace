<template>
  <div class="flex space-x-4">
    <input
      v-model="message"
      @keyup.enter="sendMessage"
      type="text"
      class="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      :placeholder="placeholder"
    />
    <button
      @click="sendMessage"
      class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Send
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['send-message'])
const message = ref('')
const placeholder = ref('Type your message...')

const sendMessage = () => {
  if (message.value.trim()) {
    emit('send-message', message.value)
    message.value = ''
  }
}
</script>