import { createRemoteJWKSet, jwtVerify } from 'jose'
import type { NextFunction, Request, Response } from 'express'
import { sendError } from './response.js'

const tenantId = process.env.AZURE_TENANT_ID
const clientId = process.env.AZURE_CLIENT_ID
const explicitAudience = process.env.AZURE_AUDIENCE
const authorityHost = process.env.AZURE_AUTHORITY_HOST || 'login.microsoftonline.com'

if (!tenantId || !clientId) {
  throw new Error('Missing AZURE_TENANT_ID or AZURE_CLIENT_ID in backend env.')
}

const acceptedIssuers = [
  `https://${authorityHost}/${tenantId}/v2.0`,
  `https://sts.windows.net/${tenantId}/`,
]
const jwks = createRemoteJWKSet(
  new URL(`https://${authorityHost}/${tenantId}/discovery/v2.0/keys`),
)
const acceptedAudiences = explicitAudience
  ? [explicitAudience, clientId]
  : [clientId, `api://${clientId}`]

export interface AuthenticatedRequest extends Request {
  user?: {
    sub: string
    name: string
    tid: string
    email: string
  }
}

export async function validateBearerToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const authorization = req.header('authorization')
    if (!authorization?.startsWith('Bearer ')) {
      sendError(res, 401, 'UNAUTHORIZED', 'Missing bearer token')
      return
    }

    const token = authorization.replace('Bearer ', '')
    const { payload } = await jwtVerify(token, jwks, {
      audience: acceptedAudiences,
      issuer: acceptedIssuers,
    })

    req.user = {
      sub: String(payload.sub),
      name: String(payload.name ?? payload.preferred_username ?? 'Unknown User'),
      tid: String(payload.tid ?? 'unknown-tenant'),
      email: String(payload.email ?? payload.preferred_username ?? ''),
    }

    next()
  } catch (error) {
    console.error('Token validation failed:', error)
    sendError(res, 401, 'UNAUTHORIZED', 'Invalid token')
  }
}
