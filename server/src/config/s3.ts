import { S3ClientConfigType } from '@aws-sdk/client-s3'

export const s3Config: S3ClientConfigType = {
  region: process.env.AWS_REGION,
}
