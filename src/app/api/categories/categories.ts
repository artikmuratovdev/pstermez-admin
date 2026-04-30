import baseApi from '@/app/api/baseApi/baseApi'
import type {
  ApiSuccessResponse,
  Category,
  CategoryFilters,
  CategoryFormRequest,
  MessageResponse,
  PaginatedApiSuccessResponse,
} from '@/app/api/baseApi/type'

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<
      PaginatedApiSuccessResponse<Category[]>,
      CategoryFilters | void
    >({
      query: (params) => ({
        url: '/categories',
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((category) => ({
                type: 'category' as const,
                id: category._id,
              })),
              { type: 'category' as const, id: 'LIST' },
            ]
          : [{ type: 'category' as const, id: 'LIST' }],
    }),
    getCategory: builder.query<ApiSuccessResponse<Category>, string>({
      query: (id) => `/categories/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'category', id }],
    }),
    createCategory: builder.mutation<
      ApiSuccessResponse<Category>,
      CategoryFormRequest
    >({
      query: (body) => ({
        url: '/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'category', id: 'LIST' }],
    }),
    updateCategory: builder.mutation<
      ApiSuccessResponse<Category>,
      { id: string; body: CategoryFormRequest }
    >({
      query: ({ id, body }) => ({
        url: `/categories/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'category', id },
        { type: 'category', id: 'LIST' },
        'news',
      ],
    }),
    deleteCategory: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'category', id },
        { type: 'category', id: 'LIST' },
        'news',
      ],
    }),
  }),
})

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi
