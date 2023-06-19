import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'
import { FastifyInstance } from 'fastify'

import { Storage, StorageType } from '../services/storage'
import { prisma } from '../lib/prisma'

const storage = new Storage(process.env.STORAGE_TYPE as StorageType)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    const upload = await request.file({
      limits: {
        fileSize: 5_242_880, // 5mb
      },
    })

    if (!upload) {
      return reply.status(400).send()
    }

    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)

    if (!isValidFileFormat) {
      return reply.status(400).send()
    }

    const fileId = randomUUID()
    const extension = extname(upload.filename)

    const fileName = fileId.concat(extension)

    try {
      const fullUrl = request.protocol.concat('://').concat(request.hostname)
      const { fileUrl } = await storage.upload(fileName, upload.file, fullUrl)

      // Save file on db
      await prisma.file.create({
        data: {
          fileName,
          fileUrl,
          originalName: upload.filename,
          size: upload.file.bytesRead,
        },
      })

      return { fileUrl }
    } catch (error) {
      reply.status(500).send({
        message: `Could not upload the file: ${fileName}. ${error}`,
      })
    }
  })
}
