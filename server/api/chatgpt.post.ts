import { defineEventHandler, readBody } from 'h3'
import { $fetch } from 'ofetch'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { text, model = 'gpt-3.5-turbo', temperature = 0.7, max_tokens = 200 } = body

  if (!text) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Text is required'
    })
  }

  const apiKey = process.env.NUXT_OPENAI_API_KEY
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'OpenAI API key not configured'
    })
  }

  try {
    const response = await $fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides text correction suggestions for people with disabilities who have difficulty typing accurately. When given text that appears to have typos or unclear content, suggest what the user might have meant to type. Provide 2-3 possible corrections if the original text is ambiguous. Only return the corrected text suggestions, no explanations.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature,
        max_tokens
      })
    })

    const suggestions = response.choices[0]?.message?.content?.split('\n').filter(s => s.trim()) || []

    return {
      suggestions: suggestions.slice(0, 3) // Limit to 3 suggestions
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get AI suggestions'
    })
  }
})
