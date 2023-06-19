import { resolve } from 'node:path'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

import { bucket } from '../lib/google-cloud-storage'
import { MultipartFile } from '@fastify/multipart'

const pump = promisify(pipeline)

type StorageType = 'local' | 'gs'
type File = string | MultipartFile['file']

export class Storage {
  upload: (
    fileName: string,
    file: File,
    baseUrl?: string,
  ) => Promise<{ fileUrl: string }>

  constructor(storageType: StorageType) {
    this.upload = this[storageType]
  }

  /** Upload on local disc  */
  private async local(fileName: string, file: File, baseUrl?: string) {
    const writeStream = createWriteStream(
      resolve(__dirname, '../', '../tmp', './uploads', fileName),
    )

    await pump(file, writeStream)

    const fileUrl = new URL(`/uploads/${fileName}`, baseUrl).toString()

    return { fileUrl }
  }

  /** Upload on Google Cloud Storage */
  private async gs(fileName: string, file: File) {
    const baseUrl = 'https://storage.googleapis.com'
    const blob = bucket.file(fileName)

    const blobStream = blob.createWriteStream({
      resumable: false,
    })

    await pump(file, blobStream)

    const fileUrl = new URL(`/${bucket.name}/${fileName}`, baseUrl).toString()

    return { fileUrl }
  }
}
