/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineStore } from 'pinia'
import { piniaPluginPersistedstate } from '#imports'
interface Rile {
  position: number;
  text: string;
  template: 'text' | 'audio' | 'recording'; // Type of Rile template
  audioPath?: string; // Path to audio file (for uploaded or recorded audio)
  audioType?: string; // MIME type of the audio
  recording?: string; // Base64 encoded recording data or recording ID
  audioGain?: number; // Audio gain boost (0.1 to 5.0, default: 1.0)
  [key: string]: any;
}

export const useBoardStore = defineStore('boards', {
  state: () => {
    return {
      // for initially empty lists
      // userList: [] as UserInfo[],
      // // for data that is not yet loaded
      riles: [] as Rile[], // 0 = GPT-3.5, 1 = GPT-4
      betaStream: 0, // 0 = disabled, 1 = enabled
    }
  },
  getters: {
    sortedRiles: (state) => {
      return [...state.riles].sort((a, b) => {
        return a.position - b.position
      })
    }
  },
  actions: {
    addRile(rile: Rile): boolean {
      // Check if a rile with the same text already exists
      const textExists = this.riles.some(r => r.text === rile.text)
      if (textExists) {
        return false // Text is not unique
      }

      // Check if a rile with the same position already exists
      const positionExists = this.riles.some(r => r.position === rile.position)
      if (positionExists) {
        // Shift all riles with position >= rile.position up by 1
        this.riles.forEach(r => {
          if (r.position >= rile.position) {
            r.position += 1
          }
        })
      }

      this.riles.push(rile)
      return true // Successfully added
    },
    editRile(rile: Rile): boolean {
      // Find the index of the rile to edit by position
      if (!rile.text){
        this.removeRile(this.riles.findIndex(r => r.position === rile.position))
        return true
      }
      const index = this.riles.findIndex(r => r.position === rile.position)
      if (index === -1) {
        return false // Rile not found
      }

      // Check if the new text is unique (excluding the current rile)
      const textExists = this.riles.some((r, i) => i !== index && r.text === rile.text)
      if (textExists) {
        return false // Text is not unique
      }

      // Get the original position
      const originalPosition = this.riles[index].position

      // If position is being changed and the new position is already taken
      if (rile.position !== originalPosition) {
        const positionExists = this.riles.some((r, i) => i !== index && r.position === rile.position)
        if (positionExists) {
          // Shift all riles with position >= rile.position up by 1
          this.riles.forEach(r => {
            if (r.position >= rile.position && r.position !== originalPosition) {
              r.position += 1
            }
          })
        }
      }

      // Update the rile
      this.riles[index] = rile
      return true // Successfully updated
    },
    removeRile(index: number) {
      this.riles.splice(index, 1)
    },
    // Optionally, you can add edit methods here
  },
  persist: [
    {
      storage: piniaPluginPersistedstate.localStorage(),
    },
    {
      storage: piniaPluginPersistedstate.sessionStorage(),
    },
  ],
  // //persist: {

    // storage: piniaPluginPersistedstate.cookies(),
  // },
})

interface Boards {
  riles: Rile[]
  betaStream: number
}
