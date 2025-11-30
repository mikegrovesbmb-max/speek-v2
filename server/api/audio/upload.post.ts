import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    if (!formData || formData.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
    }

    const file = formData.find(part => part.name === 'audioFile')
    if (!file || !file.filename) {
      throw createError({ statusCode: 400, statusMessage: 'Audio file is required' })
    }

    const validMimeTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/webm'] as const
    type ValidAudioType = typeof validMimeTypes[number]
    if (!file.type || !validMimeTypes.includes(file.type as ValidAudioType)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid file type. Only audio files (MP3, WAV, WebM) are allowed.' })
    }

    const fileId = randomUUID()
    const mimeToExt: Record<string, string> = {
      'audio/mpeg': '.mp3',
      'audio/mp3': '.mp3',
      'audio/wav': '.wav',
      'audio/x-wav': '.wav',
      'audio/webm': '.webm'
    }
    const extension = file.type ? mimeToExt[file.type] || '.mp3' : '.mp3'
    const filename = `${fileId}${extension}`
    const blobPath = `audio/${filename}`

    try {
      const blobClient = hubBlob()
      const blob = await blobClient.put(blobPath, file.data, { contentType: file.type || 'audio/mpeg' })
      return {
        success: true,
        fileId,
        fileName: filename,
        filePath: `/api/_hub/blob/${blobPath}`,
        fileType: file.type,
        fileSize: file.data.length,
        blobUrl: blob.url
      }
    } catch (e) {
      console.error('Error uploading audio to hub blob:', e)
      throw createError({ statusCode: 500, statusMessage: 'Failed to upload audio file' })
    }
  } catch (error: unknown) {
    console.error('Upload handler error:', error)
    const e = error as { statusCode?: number; statusMessage?: string }
    throw createError({ statusCode: e.statusCode || 500, statusMessage: e.statusMessage || 'Failed to upload audio file' })
  }
})
