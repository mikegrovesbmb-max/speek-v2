<!-- app/layouts/app.vue -->
<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation will go here -->
    <main class="flex-1 overflow-auto">
      <slot />
    </main>
  </div>
</template>