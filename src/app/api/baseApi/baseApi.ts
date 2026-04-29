import {
  clearAuthTokens,
  getAuthToken,
  getRefreshToken,
  setAuthTokens,
} from '@/lib/auth'
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import type { LoginResponse } from './type'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers) => {
    headers.set('Accept', 'application/json')

    const token = getAuthToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  },
})

const baseQueryWithRefresh: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status === 401) {
    const refreshToken = getRefreshToken()

    if (!refreshToken) {
      clearAuthTokens()
      return result
    }

    const refreshResult = await rawBaseQuery(
      {
        url: '/auth/refresh-token',
        method: 'POST',
        body: { refresh_token: refreshToken },
      },
      api,
      extraOptions
    )

    const refreshData = refreshResult.data as LoginResponse | undefined

    if (refreshData?.success && refreshData.access_token) {
      setAuthTokens({
        access_token: refreshData.access_token,
        refresh_token: refreshData.refresh_token,
      })
      result = await rawBaseQuery(args, api, extraOptions)
    } else {
      clearAuthTokens()
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithRefresh,
  tagTypes: ['admin', 'user', 'category', 'news', 'team'],
  keepUnusedDataFor: 60,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
})

export default baseApi
