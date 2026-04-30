import baseApi from '@/app/api/baseApi/baseApi'
import type {
  ApiSuccessResponse,
  MessageResponse,
  PaginatedApiSuccessResponse,
  TeamFilters,
  TeamFormRequest,
  TeamMember,
} from '@/app/api/baseApi/type'

export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeam: builder.query<PaginatedApiSuccessResponse<TeamMember[]>, TeamFilters | void>(
      {
        query: (params) => ({
          url: '/team',
          params: params ?? undefined,
        }),
        providesTags: ['team'],
      }
    ),
    getTeamMember: builder.query<ApiSuccessResponse<TeamMember>, string>({
      query: (id) => `/team/${id}`,
      providesTags: ['team'],
    }),
    createTeamMember: builder.mutation<
      ApiSuccessResponse<TeamMember>,
      TeamFormRequest
    >({
      query: (body) => ({
        url: '/team',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['team'],
    }),
    updateTeamMember: builder.mutation<
      ApiSuccessResponse<Partial<TeamMember>>,
      { id: string; body: TeamFormRequest }
    >({
      query: ({ id, body }) => ({
        url: `/team/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['team'],
    }),
    deleteTeamMember: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/team/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['team'],
    }),
  }),
})

export const {
  useGetTeamQuery,
  useGetTeamMemberQuery,
  useCreateTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useDeleteTeamMemberMutation,
} = teamApi
