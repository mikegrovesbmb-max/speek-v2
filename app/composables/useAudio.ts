import { ref, onMounted } from 'vue'

export function useAudio() {
  const audioPlayer = ref<HTMLAudioElement | null>(null)
  const audioContext = ref<AudioContext | null>(null)

  const initializeAudio = () => {
    if (typeof window === 'undefined') return
    audioPlayer.value = new Audio()
    if ((window as any).AudioContext || (window as any).webkitAudioContext) {
      audioContext.value = new ((window as any).AudioContext || (window as any).webkitAudioContext)()
    }
  }

  const playAudio = (audioPath: string, gainBoost = 1.0) => {
    if (!audioPath) return
    if (gainBoost === 1.0) {
      if (!audioPlayer.value) return
      audioPlayer.value.pause()
      audioPlayer.value.currentTime = 0
      audioPlayer.value.src = audioPath
      audioPlayer.value.play()
      return
    }
    if (!audioContext.value) return
    const audio = new Audio(audioPath)
    const source = audioContext.value.createMediaElementSource(audio)
    const gainNode = audioContext.value.createGain()
    gainNode.gain.value = Math.max(0.1, Math.min(5.0, gainBoost))
    source.connect(gainNode)
    gainNode.connect(audioContext.value.destination)
    audio.play().catch(error => {
      console.error('Error playing audio with gain boost:', error)
    })
  }

  const playAlarm = () => {
    if (typeof window === 'undefined') return
    const audio = new Audio('/ding.mp3')
    audio.play().catch(() => {})
  }

  const playSwoosh = () => {
    if (typeof window === 'undefined') return
    const audio = new Audio('/swoosh.mp3')
    audio.play().catch(() => {})
  }

  if (process.client) onMounted(initializeAudio)

  return {
    audioPlayer,
    audioContext,
    playAudio,
    playAlarm,
    playSwoosh,
    initializeAudio
  }
}
