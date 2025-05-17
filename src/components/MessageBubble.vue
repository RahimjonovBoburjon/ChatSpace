<template>
  <div :class="[
    'max-w-[70%] rounded-lg p-4',
    message.sender === 'user'
      ? 'ml-auto bg-blue-500 text-white'
      : message.isError
        ? 'bg-red-100 text-red-700 border border-red-200'
        : 'bg-white text-gray-900 shadow'
  ]">
    <p class="text-sm">{{ message.text }}</p>
    <span class="text-xs opacity-70 mt-1 block">
      {{ formatTime(message.timestamp) }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>