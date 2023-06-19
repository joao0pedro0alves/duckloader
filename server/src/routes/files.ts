import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function filesRoutes(app: FastifyInstance) {
  app.get('/files', async () => {
    const files = await prisma.file.findMany()
    return files
  })
}
