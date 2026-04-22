import type { Response } from 'express'

interface ApiErrorBody {
  code: string
  message: string
  details?: unknown
}

export function sendSuccess<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({
    success: true,
    data,
  })
}

export function sendError(
  res: Response,
  status: number,
  code: string,
  message: string,
  details?: unknown,
) {
  const error: ApiErrorBody = { code, message }
  if (details !== undefined) {
    error.details = details
  }

  return res.status(status).json({
    success: false,
    data: null,
    error,
  })
}
