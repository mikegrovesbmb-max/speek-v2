<!-- app/pages/index.vue -->
<template>
  <NuxtLayout name="app">
    <div class="container mx-auto p-4">
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Header -->
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
            Speek
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            Accessible speech and communication app
          </p>
        </div>

        <!-- Speech Input Section (placeholder) -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Text to Speak</h2>
          </template>
          
          <UTextarea
            v-model="text"
            placeholder="Enter text to speak..."
            :rows="5"
          />
          
          <template #footer>
            <UButton
              block
              size="xl"
              color="primary"
            >
              <Icon name="i-heroicons-speaker-wave" class="mr-2" />
              Speek It
            </UButton>
          </template>
        </UCard>

        <!-- Riles Grid Section (placeholder) -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Quick Phrases</h2>
          </template>
          
          <div class="grid grid-cols-3 gap-3">
            <UButton
              v-for="i in 6"
              :key="i"
              variant="outline"
              class="h-20"
            >
              Tile {{ i }}
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const text = ref('')

useHead({
  title: 'Speek - Accessible Speech App',
  meta: [
    { name: 'description', content: 'Accessible speech and TTS communication app' }
  ]
})
</script>