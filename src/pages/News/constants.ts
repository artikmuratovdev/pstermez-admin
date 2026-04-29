import type { NewsMediaType } from '@/app/api/baseApi/type'

export const mediaTypeOptions = [
  { label: 'Image', value: 'image' },
  { label: 'Video', value: 'video' },
] satisfies { label: string; value: NewsMediaType }[]
