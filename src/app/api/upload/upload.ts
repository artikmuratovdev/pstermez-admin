import baseApi from '@/app/api/baseApi/baseApi'
import type {
  UploadFileResponse,
  UploadFilesResponse,
} from '@/app/api/baseApi/type'

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<UploadFileResponse, File>({
      query: (file) => {
        const body = new FormData()
        body.append('file', file)

        return {
          url: '/upload/file',
          method: 'POST',
          body,
        }
      },
    }),
    uploadFiles: builder.mutation<UploadFilesResponse, File[]>({
      query: (files) => {
        const body = new FormData()
        files.forEach((file) => body.append('files', file))

        return {
          url: '/upload/files',
          method: 'POST',
          body,
        }
      },
    }),
  }),
})

export const { useUploadFileMutation, useUploadFilesMutation } = uploadApi
