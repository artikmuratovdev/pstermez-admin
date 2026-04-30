import { type FormEvent, type ReactNode, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { FileText, ImageIcon, Info, Save, Tag, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/app/api/baseApi'
import type {
  NewsFormRequest,
  NewsItem,
  NewsMedia,
  NewsMediaType,
} from '@/app/api/baseApi/type'
import { useGetCategoriesQuery } from '@/app/api/categories'
import {
  useCreateNewsMutation,
  useGetNewsQuery,
  useUpdateNewsMutation,
} from '@/app/api/news'
import { useUploadFileMutation, useUploadFilesMutation } from '@/app/api/upload'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
} from '@/components/ui/file-upload'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { BackButton, ErrorAlert, PageHeader } from '../../components/dashboard-ui'
import MaterialPreview from './components/MaterialPreview'

const initialForm: NewsFormRequest = {
  title: '',
  slug: '',
  type: 'image',
  category: '',
  description: '',
  content: '',
  media: [],
}

const getCategoryId = (category: NewsItem['category']) =>
  typeof category === 'string' ? category : category._id

const getMediaArray = (media?: NewsItem['media']) => media ?? []

const getDominantMediaType = (media: NewsFormRequest['media']): NewsMediaType => {
  const videoCount = media.filter((item) => item.type === 'video').length
  const imageCount = media.filter((item) => item.type === 'image').length

  return videoCount > imageCount ? 'video' : 'image'
}

const getInitialForm = (news?: NewsItem): NewsFormRequest =>
  news
    ? {
        title: news.title,
        slug: news.slug,
        type: getDominantMediaType(getMediaArray(news.media)),
        category: getCategoryId(news.category),
        description: news.description,
        content: news.content,
        media: getMediaArray(news.media),
      }
    : initialForm

const getMaterialType = (file: File): NewsMediaType =>
  file.type.startsWith('video/') ? 'video' : 'image'

const getNewsPayload = (form: NewsFormRequest): NewsFormRequest => ({
  ...form,
  type: getDominantMediaType(form.media),
})

const toSlug = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

const NewsFormPage = () => {
  const navigate = useNavigate()
  const { newsId = '' } = useParams()
  const isEdit = Boolean(newsId)
  const { data: categoriesData } = useGetCategoriesQuery({
    type: 'news',
    page: 1,
    limit: 100,
  })
  const {
    data,
    error: loadError,
    isLoading: isNewsLoading,
  } = useGetNewsQuery({ page: 1, limit: 1000 }, { skip: !isEdit })
  const news = data?.data.find((item) => item._id === newsId)
  const [form, setForm] = useState<NewsFormRequest>(() => getInitialForm(news))
  const [uploadQueue, setUploadQueue] = useState<File[]>([])
  const [loadedNewsId, setLoadedNewsId] = useState('')
  const [createNews, createState] = useCreateNewsMutation()
  const [updateNews, updateState] = useUpdateNewsMutation()
  const [uploadFile, uploadState] = useUploadFileMutation()
  const [uploadFiles, uploadFilesState] = useUploadFilesMutation()
  const categories = categoriesData?.data ?? []
  const error = createState.error ?? updateState.error
  const isLoading = createState.isLoading || updateState.isLoading
  const isUploading = uploadState.isLoading || uploadFilesState.isLoading
  const videosWithoutThumbnail = form.media.filter(
    (item) => item.type === 'video' && !item.thumbnail
  ).length

  useEffect(() => {
    if (news && loadedNewsId !== news._id) {
      setLoadedNewsId(news._id)
      setForm(getInitialForm(news))
    }
  }, [loadedNewsId, news])

  const handleTitleChange = (value: string) => {
    setForm((current) => ({
      ...current,
      title: value,
      ...(isEdit ? {} : { slug: toSlug(value) }),
    }))
  }

  const handleUploadFiles = async (
    files: File[],
    options?: {
      onProgress: (file: File, progress: number) => void
      onSuccess: (file: File) => void
      onError: (file: File, error: Error) => void
    }
  ) => {
    if (files.length === 0) return

    try {
      const response =
        files.length === 1
          ? { file_paths: [(await uploadFile(files[0]).unwrap()).file_path] }
          : await uploadFiles(files).unwrap()
      const uploaded: NewsMedia[] = response.file_paths.map((url, index) => ({
        type: getMaterialType(files[index]),
        url,
        size: files[index].size,
        mimeType: files[index].type,
      }))

      files.forEach((file) => {
        options?.onProgress(file, 100)
        options?.onSuccess(file)
      })
      setForm((current) => {
        const media = [...current.media, ...uploaded]

        return {
          ...current,
          media,
          type: getDominantMediaType(media),
        }
      })
      toast.success(
        uploaded.length > 1 ? `${uploaded.length} ta fayl yuklandi` : 'Fayl yuklandi',
        uploaded.some((item) => item.type === 'video')
          ? { description: 'Video uchun muqova rasmini qo`shing.' }
          : undefined
      )
    } catch (uploadError) {
      files.forEach((file) =>
        options?.onError(
          file,
          uploadError instanceof Error ? uploadError : new Error('Upload failed')
        )
      )
      toast.error(getApiErrorMessage(uploadError, 'Fayllar yuklanmadi'))
    }
  }

  const updateMediaItem = (url: string, patch: Partial<NewsMedia>) => {
    setForm((current) => {
      const media = current.media.map((item) =>
        item.url === url ? { ...item, ...patch } : item
      )

      return {
        ...current,
        media,
        type: getDominantMediaType(media),
      }
    })
  }

  const removeMediaItem = (url: string) => {
    setForm((current) => {
      const media = current.media.filter((item) => item.url !== url)

      return {
        ...current,
        media,
        type: getDominantMediaType(media),
      }
    })
  }

  const handleThumbnailUpload = async (mediaUrl: string, file: File | undefined) => {
    if (!file) return

    try {
      const response = await uploadFile(file).unwrap()
      updateMediaItem(mediaUrl, { thumbnail: response.file_path })
      toast.success('Muqova yuklandi')
    } catch (uploadError) {
      toast.error(getApiErrorMessage(uploadError, 'Muqova yuklanmadi'))
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = getNewsPayload(form)

    try {
      if (isEdit) {
        await updateNews({ id: newsId, body: payload }).unwrap()
        toast.success('Yangilik yangilandi')
      } else {
        await createNews(payload).unwrap()
        toast.success('Yangilik yaratildi')
      }
      navigate('/news')
    } catch (submitError) {
      toast.error(getApiErrorMessage(submitError, 'Yangilik saqlanmadi'))
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        action={
          <BackButton fallback="/news">Yangiliklar</BackButton>
        }
        actionPlacement="start"
        description={
          isEdit
            ? 'Yangilik ma`lumotlarini tahrirlang va saqlang.'
            : 'Yangi yangilik yarating: matn, kategoriya va media.'
        }
        title={isEdit ? 'Yangilikni tahrirlash' : 'Yangilik yaratish'}
      />

      {loadError ? <ErrorAlert error={loadError} fallback="Yangilik olinmadi" /> : null}
      {isNewsLoading ? <Skeleton className="h-96" /> : null}

      {!isNewsLoading ? (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <NewsFormCard
            description="Yangilik sarlavhasi, slug va matni."
            icon={<FileText />}
            title="Asosiy ma'lumotlar"
          >
            <FieldGroup>
              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="news-title">Sarlavha *</FieldLabel>
                  <Input
                    id="news-title"
                    onChange={(event) => handleTitleChange(event.target.value)}
                    placeholder="Yangilik sarlavhasini kiriting"
                    required
                    value={form.title}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="news-slug">Slug *</FieldLabel>
                  <Input
                    id="news-slug"
                    onChange={(event) =>
                      setForm((current) => ({ ...current, slug: event.target.value }))
                    }
                    placeholder="url-uchun-slug"
                    required
                    value={form.slug}
                  />
                  {!isEdit ? (
                    <FieldDescription>Sarlavhadan avtomatik yaratiladi.</FieldDescription>
                  ) : null}
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="news-description">Qisqa tavsif *</FieldLabel>
                  <Textarea
                    id="news-description"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Yangilik haqida qisqacha..."
                    required
                    rows={4}
                    value={form.description}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="news-content">To'liq matn *</FieldLabel>
                  <Textarea
                    id="news-content"
                    onChange={(event) =>
                      setForm((current) => ({ ...current, content: event.target.value }))
                    }
                    placeholder="Yangilik to'liq matni..."
                    required
                    rows={4}
                    value={form.content}
                  />
                </Field>
              </div>
            </FieldGroup>
          </NewsFormCard>

          <NewsFormCard
            description="Yangilik uchun kategoriya tanlang."
            icon={<Tag />}
            title="Kategoriya"
          >
            <Field>
              <FieldLabel>Kategoriya *</FieldLabel>
              <Select
                onValueChange={(value) =>
                  setForm((current) => ({ ...current, category: value }))
                }
                value={form.category}
              >
                <SelectTrigger className="w-full md:w-72">
                  <SelectValue placeholder="Kategoriya tanlang..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </NewsFormCard>

          <NewsFormCard
            description="Rasm yoki video yuklang. Birinchi media asosiy sifatida ishlatiladi."
            icon={<ImageIcon />}
            title="Media"
          >
            <div className="flex flex-col gap-6">
              {videosWithoutThumbnail > 0 ? (
                <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                  <Info className="mt-0.5 shrink-0" />
                  <span>
                    <strong>{videosWithoutThumbnail} ta video</strong> muqovasiz,
                    quyida qo'shing.
                  </span>
                </div>
              ) : null}

              <Field>
                <FileUpload
                  accept="image/*,video/*"
                  className="w-full"
                  disabled={isUploading}
                  maxFiles={10}
                  multiple
                  onFileReject={(file, message) =>
                    toast.error(message, { description: `"${file.name}" yuklanmadi` })
                  }
                  onUpload={(files, options) => handleUploadFiles(files, options)}
                  onValueChange={setUploadQueue}
                  value={uploadQueue}
                >
                  <FileUploadDropzone className="border-primary/20 bg-primary/5 hover:bg-primary/10 data-dragging:border-primary/50 data-dragging:bg-primary/10">
                    <div className="flex flex-col items-center gap-3 py-4 text-center">
                      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                        <Upload className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Rasm yoki video tashlang</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          PNG, JPG, WEBP, MP4, MOV. Bir vaqtda 10 tagacha.
                        </p>
                      </div>
                      <FileUploadTrigger asChild>
                        <Button size="sm" type="button" variant="outline">
                          Fayl tanlash
                        </Button>
                      </FileUploadTrigger>
                    </div>
                  </FileUploadDropzone>

                  {uploadQueue.length > 0 ? (
                    <FileUploadList className="mt-3">
                      {uploadQueue.map((file) => (
                        <FileUploadItem key={`${file.name}-${file.lastModified}`} value={file}>
                          <FileUploadItemPreview />
                          <FileUploadItemMetadata />
                          <FileUploadItemProgress />
                          <FileUploadItemDelete asChild>
                            <Button size="icon" type="button" variant="ghost">
                              <X />
                            </Button>
                          </FileUploadItemDelete>
                        </FileUploadItem>
                      ))}
                    </FileUploadList>
                  ) : null}
                </FileUpload>
              </Field>

              {form.media.length > 0 ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">
                      Yuklangan medialar ({form.media.length})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Birinchi media asosiy bo'ladi
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {form.media.map((material, index) => (
                      <MaterialPreview
                        disabled={uploadState.isLoading}
                        key={material.url}
                        material={material}
                        onRemove={() => removeMediaItem(material.url)}
                        onThumbnailChange={(thumbnail) =>
                          updateMediaItem(material.url, { thumbnail })
                        }
                        onThumbnailUpload={(file) =>
                          void handleThumbnailUpload(material.url, file)
                        }
                        primary={index === 0}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </NewsFormCard>

          {error ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {getApiErrorMessage(error, "Form ma'lumotlarini tekshiring")}
            </p>
          ) : null}

          <div className="fixed bottom-10 right-10 z-10 flex items-center justify-end gap-3 rounded-xl border bg-background/95 px-4 py-3 shadow-lg backdrop-blur w-fit">
            <BackButton fallback="/news">Bekor qilish</BackButton>
            <Button disabled={isLoading || isUploading} type="submit">
              <Save data-icon="inline-start" />
              {isLoading
                ? 'Saqlanmoqda...'
                : isEdit
                  ? "O'zgarishlarni saqlash"
                  : 'Yangilik yaratish'}
            </Button>
          </div>
        </form>
      ) : null}
    </section>
  )
}

const NewsFormCard = ({
  title,
  description,
  icon,
  children,
}: {
  title: string
  description: string
  icon: ReactNode
  children: ReactNode
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-base">
        <span className="text-primary [&_svg]:size-4">{icon}</span>
        {title}
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
)

export default NewsFormPage
