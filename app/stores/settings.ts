import { defineStore } from 'pinia'
import { piniaPluginPersistedstate } from '#imports'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    provider: 'deepgram' as 'native' | 'deepgram' | 'speechify',
    pitch: 1.0,
    rate: 1.0,
    volume: 1.0,
    selectedVoice: ''
  }),
  actions: {
    setProvider(p: 'native' | 'deepgram' | 'speechify') {
      this.provider = p
    },
    setVoice(v: string) {
      this.selectedVoice = v
    },
    setPitch(p: number) { this.pitch = p },
    setRate(r: number) { this.rate = r },
    setVolume(v: number) { this.volume = v }
  },
  persist: [
    { storage: piniaPluginPersistedstate.localStorage() },
    { storage: piniaPluginPersistedstate.sessionStorage() }
  ]
})
