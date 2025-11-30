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

        <!-- Login Section -->
        <UCard v-if="!userStore.isAuthenticated">
          <template #header>
            <h2 class="text-xl font-semibold">Login</h2>
          </template>

          <UInput v-model="username" placeholder="Username" class="mb-3" />
          <UInput v-model="password" type="password" placeholder="Password" class="mb-3" />
          <div class="flex gap-3">
            <UButton :loading="loading" color="primary" @click="login">Login</UButton>
            <UButton variant="text" @click="clear">Clear</UButton>
          </div>
          <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
        </UCard>

        <UCard v-else>
          <template #header>
            <h2 class="text-xl font-semibold">Welcome</h2>
          </template>
          <div class="text-gray-800">Welcome, {{ userStore.displayName || userStore.username }}!</div>
          <div class="mt-3 flex gap-3">
            <UButton color="secondary" @click="router.push('/speek')">Go to Speek</UButton>
            <UButton variant="outline" @click="logout">Logout</UButton>
          </div>
        </UCard>

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
import { useRouter } from 'vue-router'
import { useUserStore } from '~/stores/user'
const userStore = useUserStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const clear = () => {
  username.value = ''
  password.value = ''
  error.value = ''
}

const login = async () => {
  error.value = ''
  loading.value = true
  try {
    const res = await $fetch('/api/auth-cookie', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    })
    if (res?.success) {
      userStore.setUser(res.username, res.displayName)
      userStore.setAuthCookie('1')
      router.push('/speek')
    } else {
      error.value = res?.error || 'Login failed.'
      userStore.setAuthCookie('')
    }
  } catch (e) {
    error.value = 'Server error'
  } finally {
    loading.value = false
  }
}

const logout = async () => {
  await $fetch('/api/auth-cookie', { method: 'POST', body: { username: '', password: '' } })
  userStore.clearUser()
  userStore.setAuthCookie('')
}

const text = ref('')

useHead({
  title: 'Speek - Accessible Speech App',
  meta: [
    { name: 'description', content: 'Accessible speech and TTS communication app' }
  ]
})
</script>