<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Sidebar -->
    <UAside :open="drawer" @close="drawer = false" class="w-64">
      <div class="p-4 border-b">
        <div class="flex items-center">
          <UIcon name="i-heroicons-user-circle" class="w-8 h-8 mr-3" />
          <div>
            <div class="font-semibold text-lg">
              <span v-if="userStore.isAuthenticated">{{ userStore.displayName || 'User' }}</span>
              <span v-else class="text-gray-500">Not logged in</span>
            </div>
          </div>
        </div>
      </div>

      <UNavigationMenu :items="navigationItems" />

      <div class="absolute bottom-4 left-4 right-4 text-center text-sm text-gray-500">
        v{{ version }}
      </div>
    </UAside>
