import { randomUUID } from 'node:crypto'
import { extname, resolve } from 'node:path'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

import { FastifyInstance } from 'fastify'
import { PutObjectCommand } from '@aws-sdk/client-s3'

import { s3 } from '../lib/s3'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    const upload = await request.file({
      limits: {
        // fileSize: 5_242_880, // 5mb
        fileSize: 1 * 1024 * 1024, // 1mb
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

    // Amazon S3
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: upload.filename,
      ACL: 'public-read',
      Body: await upload.toBuffer(),
      ContentType: upload.mimetype,
    })

    await s3.send(putObjectCommand)

    // Local
    const writeStream = createWriteStream(
      resolve(__dirname, '../', '../tmp', './uploads', fileName),
    )

    await pump(upload.file, writeStream)

    const fullUrl = request.protocol.concat('://').concat(request.hostname)
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()

    return { fileUrl }
  })
}
