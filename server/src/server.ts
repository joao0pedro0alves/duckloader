import 'dotenv/config'

import { resolve } from 'node:path'
import fastify from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'

import { apiRoutes } from './routes'

const app = fastify({
  logger: true,
})

// Middlewares
app.register(multipart)

app.register(cors, {
  origin: true,
})

app.register(require('@fastify/static'), {
  root: resolve(__dirname, '../tmp', './uploads'),
  prefix: '/uploads',
})

// Routes
app.register(apiRoutes, { prefix: 'api/v1' })

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server is running on port http://localhost:3333')
  })
