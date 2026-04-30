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
      providesTags: ['category'],
    }),
    getCategory: builder.query<ApiSuccessResponse<Category>, string>({
      query: (id) => `/categories/${id}`,
      providesTags: ['category'],
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
      invalidatesTags: ['category'],
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
      invalidatesTags: ['category', 'news'],
    }),
    deleteCategory: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['category', 'news'],
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
