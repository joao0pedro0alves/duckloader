import { FastifyInstance } from 'fastify'

import { filesRoutes } from './files'
import { uploadRoutes } from './upload'

export async function apiRoutes(app: FastifyInstance) {
  app.register(uploadRoutes)
  app.register(filesRoutes)
}
