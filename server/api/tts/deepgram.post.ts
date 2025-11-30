import { defineEventHandler, readBody } from 'h3'
import { $fetch } from 'ofetch'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { text, voice_id, model } = body

  if (!text) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Text is required'
    })
  }

  const apiKey = process.env.DEEPGRAM_API_KEY
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Deepgram API key not configured'
    })
  }

  try {
    const response = await $fetch(`https://api.deepgram.com/v1/speak?model=${model || 'aura-asteria-en'}&encoding=linear16&container=wav&sample_rate=24000`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text
      })
    })

    // Return the audio data
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate speech'
    })
  }
})
