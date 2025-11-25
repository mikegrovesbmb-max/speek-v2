export interface Rile {
  id?: string
  position: number
  text: string
  template: 'text' | 'audio' | 'recording'
  audioPath?: string
  audioType?: string
  recording?: string
  audioGain?: number
  icon?: string
  category?: string
  createdAt?: number
  updatedAt?: number
}

export interface VoiceSettings {
  pitch: number
  rate: number
  volume: number
  provider: 'native' | 'deepgram' | 'speechify'
  selectedVoice?: string
}

export interface HistoryItem {
  text: string
  count: number
  lastSpoken: number
}

export type TTSProvider = 'native' | 'deepgram' | 'speechify's