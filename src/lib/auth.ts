const AUTH_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

interface AuthTokens {
  access_token: string
  refresh_token: string
}

export const setAuthTokens = (tokens: AuthTokens): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, tokens.access_token)
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token)
    } catch (error) {
      console.error('Failed to store auth tokens:', error)
    }
  }
}

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  } catch (error) {
    console.error('Failed to get auth token:', error)
    return null
  }
}

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  } catch (error) {
    console.error('Failed to get refresh token:', error)
    return null
  }
}

export const clearAuthTokens = (): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
    } catch (error) {
      console.error('Failed to clear auth tokens:', error)
    }
  }
}

export const isAuthenticated = (): boolean => {
  const token = getAuthToken()
  const refreshToken = getRefreshToken()
  return Boolean(token?.length || refreshToken?.length)
}
