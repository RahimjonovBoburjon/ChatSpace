<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Chat Space</h1>
        <LanguageSelector />
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ChatInterface />
    </main>
  </div>
</template>

<script setup>
import LanguageSelector from './components/LanguageSelector.vue'
import ChatInterface from './components/ChatInterface.vue'
</script>

<style></style>