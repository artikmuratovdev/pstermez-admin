import baseApi from '@/app/api/baseApi/baseApi'
import type {
  ApiSuccessResponse,
  MessageResponse,
  PaginatedApiSuccessResponse,
  Recommendation,
  RecommendationFilters,
  RecommendationFormRequest,
} from '@/app/api/baseApi/type'

export const recommendationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecommendations: builder.query<
      PaginatedApiSuccessResponse<Recommendation[]>,
      RecommendationFilters | void
    >({
      query: (params) => ({
        url: '/recommendations',
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((recommendation) => ({
                type: 'recommendation' as const,
                id: recommendation._id,
              })),
              { type: 'recommendation' as const, id: 'LIST' },
            ]
          : [{ type: 'recommendation' as const, id: 'LIST' }],
    }),
    getRecommendationById: builder.query<ApiSuccessResponse<Recommendation>, string>({
      query: (id) => `/recommendations/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'recommendation', id }],
    }),
    addRecommendation: builder.mutation<
      ApiSuccessResponse<Recommendation>,
      RecommendationFormRequest
    >({
      query: (body) => ({
        url: '/recommendations',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'recommendation', id: 'LIST' }],
    }),
    updateRecommendation: builder.mutation<
      ApiSuccessResponse<Partial<Recommendation>>,
      { id: string; body: RecommendationFormRequest }
    >({
      query: ({ id, body }) => ({
        url: `/recommendations/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'recommendation', id },
        { type: 'recommendation', id: 'LIST' },
      ],
    }),
    deleteRecommendation: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/recommendations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'recommendation', id },
        { type: 'recommendation', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetRecommendationsQuery,
  useGetRecommendationByIdQuery,
  useAddRecommendationMutation,
  useUpdateRecommendationMutation,
  useDeleteRecommendationMutation,
} = recommendationsApi
