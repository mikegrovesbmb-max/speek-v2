<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Sidebar -->
    <div class="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50">
      <div class="p-4 border-b">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-black rounded-full flex items-center justify-center mr-3">
            <span v-if="!userStore.username" class="text-white text-lg">?</span>
            <span v-else class="text-white text-lg">{{ userStore.username.charAt(0).toUpperCase() }}</span>
          </div>
          <div>
            <div class="font-bold text-lg">
              <span v-if="userStore.isAuthenticated">{{ userStore.displayName || 'User' }}</span>
              <span v-else class="text-gray-500">Not logged in</span>
            </div>
          </div>
        </div>
      </div>

      <nav class="p-4">
        <ul class="space-y-2">
          <li>
            <NuxtLink to="/" class="flex items-center p-2 rounded hover:bg-gray-100">
              <UIcon name="i-heroicons-home" class="mr-3" />
              Home
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/speek" class="flex items-center p-2 rounded hover:bg-gray-100">
              <UIcon name="i-heroicons-microphone" class="mr-3" />
              Speek
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/speek2" class="flex items-center p-2 rounded hover:bg-gray-100">
              <UIcon name="i-heroicons-microphone" class="mr-3" />
              Speek2
            </NuxtLink>
          </li>
          <li>
            <button @click="historyDialog = true" class="flex items-center p-2 rounded hover:bg-gray-100 w-full text-left">
              <UIcon name="i-heroicons-clock" class="mr-3" />
              History
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
    </template>

