import { Storage } from '@google-cloud/storage'

const storage = new Storage({
  credentials: {
    type: process.env.GOOGLE_CLOUD_CREDENCIALS_TYPE,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY,
    client_id: process.env.GOOGLE_CLOUD_CLIENT_ID,
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
  },
})

const bucket = storage.bucket(process.env.BUCKET_NAME!)

export { storage, bucket }
