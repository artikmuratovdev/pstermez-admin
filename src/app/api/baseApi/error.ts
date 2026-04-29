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
) => getApiErrorResponse(error)?.error.msg ?? fallback
