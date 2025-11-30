import { defineEventHandler, readBody } from 'h3'
import { promises as fs } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { audioData, fileType = 'audio/webm' } = body

    if (!audioData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No audio data provided'
      })
    }

    // Convert base64 to buffer
    const base64Data = audioData.replace(/^data:audio\/[^;]+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    // Validate file size (10MB max for recordings)
    const maxSize = 10 * 1024 * 1024
    if (buffer.length > maxSize) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Recording too large. Maximum size is 10MB.'
      })
    }

    // Generate unique filename
    const fileId = randomUUID()
    const fileExtension = fileType.split('/')[1] || 'webm'
    const filename = `${fileId}.${fileExtension}`

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'audio')
    try {
      await fs.access(uploadDir)
    } catch {
      await fs.mkdir(uploadDir, { recursive: true })
    }

    // Save file
    const filePath = join(uploadDir, filename)
    await fs.writeFile(filePath, buffer)

    return {
      success: true,
      fileId,
      filePath: `/audio/${filename}`,
      fileType,
      fileSize: buffer.length
    }
  } catch (error) {
    console.error('Audio recording save error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save audio recording'
    })
  }
})
