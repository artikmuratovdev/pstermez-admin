import baseApi from '@/app/api/baseApi/baseApi'
import type {
  Admin,
  AdminFormRequest,
  AuthUser,
  ApiSuccessResponse,
  LoginRequest,
  LoginResponse,
  MeResponse,
  MessageResponse,
  RefreshTokenRequest,
  UpdateMeRequest,
  UpdatePasswordRequest,
} from '@/app/api/baseApi/type'

export const getUserFromMeResponse = (response: MeResponse): AuthUser => {
  return response.data
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['user'],
    }),
    me: builder.query<MeResponse, void>({
      query: () => '/auth/me',
      providesTags: ['user'],
    }),
    refreshToken: builder.mutation<LoginResponse, RefreshTokenRequest>({
      query: (body) => ({
        url: '/auth/refresh-token',
        method: 'POST',
        body,
      }),
    }),
    updateMe: builder.mutation<MessageResponse, UpdateMeRequest>({
      query: (body) => ({
        url: '/auth/update-me',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['user'],
    }),
    updatePassword: builder.mutation<
      MessageResponse,
      UpdatePasswordRequest
    >({
      query: (body) => ({
        url: '/auth/update-password',
        method: 'PATCH',
        body,
      }),
    }),
    getAdmins: builder.query<ApiSuccessResponse<Admin[]>, void>({
      query: () => '/auth/admins',
      providesTags: ['admin'],
    }),
    getAdmin: builder.query<ApiSuccessResponse<Admin>, string>({
      query: (id) => `/auth/admins/${id}`,
      providesTags: ['admin'],
    }),
    createAdmin: builder.mutation<MessageResponse, Required<AdminFormRequest>>({
      query: (body) => ({
        url: '/auth/admins',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['admin'],
    }),
    updateAdmin: builder.mutation<
      MessageResponse,
      { id: string; body: AdminFormRequest }
    >({
      query: ({ id, body }) => ({
        url: `/auth/admins/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['admin'],
    }),
    deleteAdmin: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/auth/admins/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['admin'],
    }),
  }),
})

export const {
  useLoginMutation,
  useMeQuery,
  useRefreshTokenMutation,
  useUpdateMeMutation,
  useUpdatePasswordMutation,
  useGetAdminsQuery,
  useGetAdminQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} = authApi
