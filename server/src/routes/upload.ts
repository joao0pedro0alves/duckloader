import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

import { FastifyInstance } from 'fastify'
import { bucket } from '../lib/google-cloud-storage'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    // @ts-ignore
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
      //= ========= Local

      // const writeStream = createWriteStream(
      //   resolve(__dirname, '../', '../tmp', './uploads', fileName),
      // )

      // await pump(upload.file, writeStream)

      // const fullUrl = request.protocol.concat('://').concat(request.hostname)
      // const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()

      // return { fileUrl }

      //= ================ Google GCS

      const blob = bucket.file(fileName)

      const blobStream = blob.createWriteStream({
        resumable: false,
      })

      await pump(upload.file, blobStream)

      const fullUrl = 'https://storage.googleapis.com'
      const fileUrl = new URL(`/${bucket.name}/${fileName}`, fullUrl).toString()

      return { fileUrl }
    } catch (error) {
      reply.status(500).send({
        message: `Could not upload the file: ${fileName}. ${error}`,
      })
    }
  })
}
