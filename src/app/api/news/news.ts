import baseApi from '@/app/api/baseApi/baseApi'
import type {
  ApiSuccessResponse,
  MessageResponse,
  NewsFilters,
  NewsFormRequest,
  NewsItem,
} from '@/app/api/baseApi/type'

export const newsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNews: builder.query<ApiSuccessResponse<NewsItem[]>, NewsFilters | void>(
      {
        query: (params) => ({
          url: '/news',
          params: params ?? undefined,
        }),
        providesTags: ['news'],
      }
    ),
    getNewsById: builder.query<ApiSuccessResponse<NewsItem>, string>({
      query: (id) => `/news/${id}`,
      providesTags: ['news'],
    }),
    createNews: builder.mutation<ApiSuccessResponse<NewsItem>, NewsFormRequest>(
      {
        query: (body) => ({
          url: '/news',
          method: 'POST',
          body,
        }),
        invalidatesTags: ['news'],
      }
    ),
    updateNews: builder.mutation<
      ApiSuccessResponse<Partial<NewsItem>>,
      { id: string; body: NewsFormRequest }
    >({
      query: ({ id, body }) => ({
        url: `/news/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['news'],
    }),
    deleteNews: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/news/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['news'],
    }),
  }),
})

export const {
  useGetNewsQuery,
  useGetNewsByIdQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} = newsApi
