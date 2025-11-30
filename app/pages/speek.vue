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
          <!-- Speek2 removed: experimental page deleted -->
          <li>
            <button @click="historyDialog = true" class="flex items-center p-2 rounded hover:bg-gray-100 w-full text-left">
              <UIcon name="i-heroicons-clock" class="mr-3" />
              History
            </button>
          </li>
        </ul>
      </nav>
      </div>
    <div class="pl-72 pr-4 pt-8">
      <div class="max-w-3xl mx-auto">
        <div class="mb-4">
          <UTextarea v-model="text" placeholder="Enter text to speak" :rows="5" />
        </div>
        <div class="mb-4">
          <div class="flex items-center gap-3">
            <input type="file" ref="fileInput" accept="audio/*" @change="handleFileChange" />
            <UButton :loading="isUploading" @click="uploadFile" :disabled="!audioFile">Upload Audio</UButton>
            <UButton variant="outline" @click="clearUpload">Clear</UButton>
          </div>
        </div>
        <div class="flex gap-3">
          <UButton :loading="isLoading" color="primary" @click="speakNative" :disabled="!text">Speek It</UButton>
          <UButton variant="outline" @click="clearText">Clear</UButton>
        </div>
      </div>
      <div class="mt-6">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="text-lg font-semibold">Quick Phrases</div>
              <UButton size="sm" @click="openRileDialog">Add Rile</UButton>
            </div>
          </template>
          <div class="grid grid-cols-3 gap-3 p-3">
            <div v-for="r in boardStore.sortedRiles" :key="r.position" class="bg-white rounded p-3 shadow hover:shadow-lg">
              <div class="mb-2 text-sm" v-if="r.template === 'text'">{{ r.text }}</div>
              <div v-else class="text-sm">{{ r.text || 'Audio' }}</div>
              <div class="flex gap-2">
                <UButton size="sm" @click="triggerRile(r)">Play</UButton>
                <UButton size="sm" variant="outline" @click="editRile(r)">Edit</UButton>
                <UButton size="sm" variant="text" color="danger" @click="removeRile(r.position)">Delete</UButton>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <UModal v-model:show="rileDialogOpen">
        <div class="p-4 space-y-4">
          <div class="flex items-center gap-3">
            <label class="font-semibold">Template</label>
            <select v-model="newRile.template">
              <option value="text">Text</option>
              <option value="audio">Upload Audio</option>
              <option value="recording">Record Audio</option>
            </select>
          </div>
          <div v-if="newRile.template === 'text'">
            <UTextarea v-model="newRile.text" placeholder="Rile text" />
          </div>
          <div v-else-if="newRile.template === 'audio'">
            <div class="flex gap-2">
              <input type="file" accept="audio/*" @change="rileFileChange" />
              <UButton :loading="isRileUploading" @click="rileUpload" :disabled="!rileFile">Upload</UButton>
            </div>
            <div v-if="newRile.audioPath" class="text-sm mt-2">Uploaded: {{ newRile.audioPath }}</div>
          </div>
          <div v-else-if="newRile.template === 'recording'">
            <div class="flex gap-2">
              <UButton @click="toggleRileRecording">{{ isRileRecording ? 'Stop' : 'Record' }}</UButton>
              <UButton @click="playRileRecording" :disabled="!newRile.audioPath">Play</UButton>
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <UButton variant="outline" @click="closeRileDialog">Cancel</UButton>
            <UButton color="primary" @click="saveRile">Save</UButton>
          </div>
        </div>
      </UModal>
    </div>
  </div>
</template>

  <script setup lang="ts">
  import { ref } from 'vue'
  import { useAudio } from '~/composables/useAudio'
  import { useUserStore } from '~/stores/user'
  import { useBoardStore } from '~/stores/board'
  const userStore = useUserStore()
  const { playAudio } = useAudio()
  const boardStore = useBoardStore()
  const text = ref('')
  const isLoading = ref(false)
  const historyDialog = ref(false)
  const audioFile = ref<File | null>(null)
  const isUploading = ref(false)
  const fileInput = ref<HTMLInputElement | null>(null)
  // Rile modal
  const rileDialogOpen = ref(false)
  const newRile = ref<any>({ position: 0, text: '', template: 'text', audioPath: '', audioGain: 1.0 })
  const isEditingRile = ref(false)

  const clearText = () => {
    text.value = ''
  }

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0] || null
    audioFile.value = file
  }

  const clearUpload = () => {
    audioFile.value = null
    if (fileInput.value) fileInput.value.value = ''
  }

  const uploadFile = async () => {
    if (!audioFile.value) return
    isUploading.value = true
    try {
      const form = new FormData()
      form.append('audioFile', audioFile.value)
      const res = await fetch('/api/audio/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (data?.success) {
        console.log('Uploaded file:', data)
      } else {
        console.error('Upload failed', data)
      }
    } catch (e) {
      console.error('Upload error', e)
    } finally {
      isUploading.value = false
    }
  }

  const speakNative = async () => {
    if (!text.value) return
    isLoading.value = true
    try {
      const res = await fetch('/api/tts/deepgram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.value })
      })
      if (!res.ok) throw new Error('TTS request failed')
      const arrayBuffer = await res.arrayBuffer()
      const contentType = res.headers.get('content-type') || 'audio/wav'
      const blob = new Blob([arrayBuffer], { type: contentType })
      const url = URL.createObjectURL(blob)
      playAudio(url)
    } catch (e) {
      console.error('Failed to speak:', e)
    } finally {
      isLoading.value = false
    }
  }

  const openRileDialog = () => {
      newRile.value = { position: boardStore.riles.length + 1, text: '', template: 'text', audioPath: '', audioGain: 1.0 }
      rileDialogOpen.value = true
    }

    const saveRile = async () => {
      // Validate
      if (!newRile.value.text && newRile.value.template === 'text') return
      const ok = isEditingRile.value ? boardStore.editRile({ ...newRile.value }) : boardStore.addRile({ ...newRile.value })
      if (!ok) {
        // position or text duplicate
        alert('Rile text or position already exists')
        return
      }
      rileDialogOpen.value = false
      isEditingRile.value = false
    }

    const editRile = (r) => {
      newRile.value = { ...r }
      isEditingRile.value = true
      rileDialogOpen.value = true
    }

    const removeRile = (position: number) => {
      const index = boardStore.riles.findIndex(rr => rr.position === position)
      if (index !== -1) boardStore.removeRile(index)
    }

    const triggerRile = (r: any) => {
      if (r.template === 'text') {
        // set textarea and speak
        text.value = r.text
        speakNative()
      } else if (r.template === 'audio' || r.template === 'recording') {
        if (r.audioPath) playAudio(r.audioPath, r.audioGain || 1.0)
      }
    }
  // Rile file upload & recording shared state
  const rileFile = ref<File | null>(null)
  const isRileUploading = ref(false)
  const isRileRecording = ref(false)
  let rileRecorder: MediaRecorder | null = null
  let rileChunks: Blob[] = []

  const rileFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    rileFile.value = target.files?.[0] || null
  }

  const rileUpload = async () => {
    if (!rileFile.value) return
    isRileUploading.value = true
    try {
      const form = new FormData()
      form.append('audioFile', rileFile.value)
      const res = await fetch('/api/audio/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (data?.success) {
        newRile.value.audioPath = data.filePath || data.blobUrl || data.filePath
      } else {
        console.error('Rile upload failed', data)
      }
    } catch (e) {
      console.error('Rile upload error', e)
    } finally {
      isRileUploading.value = false
    }
  }

  const toggleRileRecording = async () => {
    if (isRileRecording.value) {
      // stop
      if (rileRecorder && rileRecorder.state !== 'inactive') rileRecorder.stop()
      isRileRecording.value = false
    } else {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Recording not supported in this browser')
        return
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        rileRecorder = new MediaRecorder(stream)
        rileChunks = []
        rileRecorder.ondataavailable = (evt) => rileChunks.push(evt.data)
        rileRecorder.onstop = async () => {
          const blob = new Blob(rileChunks, { type: 'audio/webm' })
          const reader = new FileReader()
          reader.onload = async () => {
            const base64 = String(reader.result)
            // POST to server to store the recording
            try {
              const res = await fetch('/api/audio/record', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audioData: base64, fileType: 'audio/webm' })
              })
              const rdata = await res.json()
              if (rdata?.success) {
                newRile.value.audioPath = rdata.filePath
              }
            } catch (e) {
              console.error('Record save error', e)
            }
          }
          reader.readAsDataURL(blob)
        }
        rileRecorder.start()
        isRileRecording.value = true
      } catch (e) {
        console.error('Recording error', e)
      }
    }
  }

  const playRileRecording = () => {
    if (!newRile.value.audioPath) return
    playAudio(newRile.value.audioPath, newRile.value.audioGain || 1.0)
  }
  
  const closeRileDialog = () => {
    rileDialogOpen.value = false
    isEditingRile.value = false
  }

  </script>

