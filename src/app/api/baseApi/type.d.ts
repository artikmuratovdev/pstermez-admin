export type LoginRequest = {
  email: string
  password: string
}

export type MessageResponse = {
  success: true
  message: string
}

export type ApiSuccessResponse<TData> = {
  success: true
  data: TData
}

export type ApiErrorResponse = {
  success: false
  error: {
    statusCode: number
    statusMsg: string
    msg: string
  }
}

export type LoginResponse = {
  success: true
  access_token: string
  refresh_token: string
}

export type RefreshTokenRequest = {
  refresh_token: string
}

export type AuthUser = {
  _id: string
  fullName: string
  email: string
  role: string
  created_at: string
  updated_at: string
  name?: string
  avatar?: string
}

export type MeResponse = ApiSuccessResponse<AuthUser>

export type UpdateMeRequest = {
  fullName: string
  email: string
}

export type UpdatePasswordRequest = {
  old_password: string
  new_password: string
}

export type Admin = {
  _id: string
  fullName: string
  email: string
  role: string
  created_at?: string
  updated_at?: string
}

export type AdminFormRequest = {
  fullName: string
  email: string
  password?: string
}

export type Category = {
  _id: string
  name: string
  slug: string
  type: string
  isActive: boolean
  created_at?: string
  updated_at?: string
}

export type CategoryFilters = {
  type?: string
  isActive?: boolean | string
}

export type CategoryFormRequest = {
  name: string
  slug: string
  type: string
  isActive: boolean
}

export type NewsMediaType = 'image' | 'video'

export type NewsMedia = {
  type: NewsMediaType
  url: string
  thumbnail?: string
  duration?: number
  size?: number
  mimeType?: string
}

export type NewsAuthor = {
  _id: string
  fullName: string
  email: string
  role: string
}

export type NewsCategory = {
  _id: string
  name: string
  slug?: string
}

export type NewsItem = {
  _id: string
  title: string
  slug: string
  type: string
  category: string | NewsCategory
  description: string
  content: string
  media?: NewsMedia[]
  views?: number
  createdBy?: string | NewsAuthor
  created_at?: string
  updated_at?: string
}

export type NewsFilters = {
  category?: string
  type?: string
}

export type NewsFormRequest = {
  title: string
  slug: string
  type: string
  category: string
  description: string
  content: string
  media: NewsMedia[]
}

export type TeamMember = {
  _id: string
  name: string
  email: string
  avatar?: string
  role: string
  subject?: string
  international: boolean
  country?: string
  created_at?: string
  updated_at?: string
}

export type TeamFilters = {
  role?: string
  international?: boolean | string
}

export type TeamFormRequest = {
  name: string
  email: string
  avatar?: string
  role: string
  subject?: string
  international: boolean
  country?: string
}

export type UploadFileResponse = {
  success: true
  file_path: string
}

export type UploadFilesResponse = {
  success: true
  file_paths: string[]
}
