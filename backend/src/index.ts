import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { type AuthenticatedRequest, validateBearerToken } from './auth.js'
import { sendError, sendSuccess } from './response.js'

const app = express()
const port = Number(process.env.PORT ?? 3001)
const frontendOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173'

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

app.use(
  cors({
    origin: frontendOrigin,
  }),
)
app.use(express.json())

app.get('/api/health', (_req, res) => {
  sendSuccess(res, { status: 'ok' })
})

app.get('/api/profile', validateBearerToken, (req: AuthenticatedRequest, res) => {
  const user = req.user

  if (!user) {
    sendError(res, 401, 'UNAUTHORIZED', 'User not available after authentication.')
    return
  }

  // Backend payload uses snake_case; frontend maps this shape in APIMapper.
  sendSuccess(res, {
    id: user.sub,
    display_name: user.name,
    tenant_id: user.tid,
  })
})

app.get('/api/me', validateBearerToken, (req: AuthenticatedRequest, res) => {
  const user = req.user

  if (!user) {
    sendError(res, 401, 'UNAUTHORIZED', 'User not available after authentication.')
    return
  }

  sendSuccess(res, {
    id: user.sub,
    display_name: user.name,
    email: user.email,
    tenant_id: user.tid,
  })
})

app.get('/api/mock-data', validateBearerToken, (_req, res) => {
  const items = Array.from({ length: 8 }, (_, index) => ({
    id: `item-${index + 1}`,
    label: `Mock Item ${index + 1}`,
    score: randomInt(10, 99),
    isActive: Math.random() > 0.5,
    created_at: new Date(Date.now() - randomInt(0, 7) * 86400000).toISOString(),
  }))

  sendSuccess(res, items)
})

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`)
})
