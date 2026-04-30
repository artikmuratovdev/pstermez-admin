import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import type { ApiErrorResponse } from './type'

const isApiErrorResponse = (data: unknown): data is ApiErrorResponse => {
  if (!data || typeof data !== 'object') {
    return false
  }

  const response = data as Partial<ApiErrorResponse>

  return (
    response.success === false &&
    typeof response.error?.statusCode === 'number' &&
    typeof response.error.statusMsg === 'string' &&
    typeof response.error.msg === 'string'
  )
}

const PAYLOAD_TOO_LARGE_MESSAGE = 'Fayl hajmi juda katta'

const isPayloadTooLargeError = (error: unknown) => {
  const queryError = error as FetchBaseQueryError

  if (queryError.status === 413) return true

  const data = queryError.data
  if (!data || typeof data !== 'object') return false

  const response = data as Partial<ApiErrorResponse> & {
    status?: unknown
    statusCode?: unknown
  }

  return (
    response.status === 413 ||
    response.statusCode === 413 ||
    response.error?.statusCode === 413
  )
}

export const getApiErrorResponse = (
  error: unknown
): ApiErrorResponse | null => {
  const queryError = error as FetchBaseQueryError

  if (isApiErrorResponse(queryError.data)) {
    return queryError.data
  }

  return null
}

export const getApiErrorMessage = (
  error: unknown,
  fallback = 'Server bilan ulanishda xatolik yuz berdi.'
) => {
  if (isPayloadTooLargeError(error)) return PAYLOAD_TOO_LARGE_MESSAGE

  const apiErrorMessage = getApiErrorResponse(error)?.error.msg
  if (apiErrorMessage) return apiErrorMessage

  const queryError = error as FetchBaseQueryError
  const data = queryError.data

  if (typeof data === 'string') return data
  if (!data || typeof data !== 'object') return fallback

  const response = data as { message?: unknown; msg?: unknown }

  if (typeof response.message === 'string') return response.message
  if (typeof response.msg === 'string') return response.msg

  return fallback
}
