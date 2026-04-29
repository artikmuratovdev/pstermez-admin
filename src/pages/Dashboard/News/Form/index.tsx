import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { ArrowLeft, ImageIcon, Save, Upload, Video, X } from 'lucide-react'
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
  useGetNewsByIdQuery,
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
import { ErrorAlert, PageHeader } from '../../components/dashboard-ui'

const getNewsPayload = (form: NewsFormRequest): NewsFormRequest => ({
  ...form,
  type: getDominantMediaType(form.media),
})

const getCategoryId = (category: NewsItem['category']) =>
  typeof category === 'string' ? category : category._id

const initialForm: NewsFormRequest = {
  title: '',
  slug: '',
  type: 'image',
  category: '',
  description: '',
  content: '',
  media: [],
}

const getMediaArray = (media?: NewsItem['media']) => media ?? []

const getDominantMediaType = (media: NewsFormRequest['media']): NewsMediaType => {
  const imageCount = media.filter((item) => item.type === 'image').length
  const videoCount = media.filter((item) => item.type === 'video').length

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

const getMaterialName = (url: string) => url.split('/').filter(Boolean).at(-1) ?? url

const MaterialPreview = ({
  material,
  primary,
  disabled,
  onThumbnailChange,
  onThumbnailUpload,
}: {
  material: NewsMedia
  primary: boolean
  disabled?: boolean
  onThumbnailChange: (url: string) => void
  onThumbnailUpload: (file: File | undefined) => void
}) => (
  <div className="group flex min-w-0 flex-col overflow-hidden rounded-lg border bg-background">
    <div className="flex aspect-video w-full items-center justify-center overflow-hidden bg-muted">
      {material.type === 'video' ? (
        <video
          className="size-full object-cover"
          controls
          poster={material.thumbnail}
          preload="metadata"
          src={material.url}
        />
      ) : (
        <img
          alt={getMaterialName(material.url)}
          className="size-full object-cover"
          loading="lazy"
          src={material.url}
        />
      )}
    </div>
    <div className="flex w-full items-center justify-between gap-2 p-2 text-sm">
      <span className="flex min-w-0 items-center gap-2">
        {material.type === 'video' ? <Video /> : <ImageIcon />}
        <span className="truncate">{getMaterialName(material.url)}</span>
      </span>
      {primary ? <span className="shrink-0 text-primary">Birinchi</span> : null}
    </div>
    {material.type === 'video' ? (
      <div className="flex flex-col gap-2 border-t p-2">
        <FieldLabel htmlFor={`thumbnail-${material.url}`}>Thumbnail</FieldLabel>
        <Input
          id={`thumbnail-${material.url}`}
          onChange={(event) => onThumbnailChange(event.target.value)}
          placeholder="Thumbnail URL"
          value={material.thumbnail ?? ''}
        />
        <Input
          accept="image/*"
          disabled={disabled}
          onChange={(event) => onThumbnailUpload(event.target.files?.[0])}
          type="file"
        />
      </div>
    ) : null}
  </div>
)

const NewsFormPage = () => {
  const navigate = useNavigate()
  const { newsId = '' } = useParams()
  const isEdit = Boolean(newsId)
  const { data: categoriesData } = useGetCategoriesQuery({ type: 'news' })
  const {
    data,
    error: loadError,
    isLoading: isNewsLoading,
  } = useGetNewsByIdQuery(newsId, { skip: !isEdit })
  const news = data?.data
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

  useEffect(() => {
    if (news && loadedNewsId !== news._id) {
      setLoadedNewsId(news._id)
      setForm(getInitialForm(news))
    }
  }, [loadedNewsId, news])

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
      const uploaded = response.file_paths.map((url, index) => ({
        type: getMaterialType(files[index]),
        url,
        size: files[index].size,
        mimeType: files[index].type,
      }))

      files.forEach((file) => {
        options?.onProgress(file, 100)
        options?.onSuccess(file)
      })
      setForm((current) => ({
        ...current,
        media: [...current.media, ...uploaded],
        type: getDominantMediaType([...current.media, ...uploaded]),
      }))
      toast.success(
        uploaded.length > 1 ? `${uploaded.length} ta file yuklandi` : 'File yuklandi'
      )
    } catch (uploadError) {
      files.forEach((file) =>
        options?.onError(
          file,
          uploadError instanceof Error ? uploadError : new Error('Upload failed')
        )
      )
      toast.error(getApiErrorMessage(uploadError, 'Filelar yuklanmadi'))
    }
  }

  const updateMediaItem = (url: string, patch: Partial<NewsMedia>) => {
    setForm((current) => ({
      ...current,
      media: current.media.map((item) =>
        item.url === url ? { ...item, ...patch } : item
      ),
    }))
  }

  const handleThumbnailUpload = async (mediaUrl: string, file: File | undefined) => {
    if (!file) return

    try {
      const response = await uploadFile(file).unwrap()
      updateMediaItem(mediaUrl, {
        thumbnail: response.file_path,
      })
      toast.success('Thumbnail yuklandi')
    } catch (uploadError) {
      toast.error(getApiErrorMessage(uploadError, 'Thumbnail yuklanmadi'))
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = getNewsPayload(form)

    try {
      if (isEdit) {
        await updateNews({ id: newsId, body: payload }).unwrap()
        toast.success('News yangilandi')
      } else {
        await createNews(payload).unwrap()
        toast.success('News yaratildi')
      }
      navigate('/news')
    } catch (submitError) {
      toast.error(getApiErrorMessage(submitError, 'News saqlanmadi'))
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        action={
          <Button asChild variant="outline">
            <Link to="/news">
              <ArrowLeft data-icon="inline-start" />
              News
            </Link>
          </Button>
        }
        description="News ma'lumotlari, category va media."
        title={isEdit ? 'News tahrirlash' : 'News yaratish'}
      />

      {loadError ? <ErrorAlert error={loadError} fallback="News olinmadi" /> : null}
      {isNewsLoading ? <Skeleton className="h-80" /> : null}

      {!isNewsLoading ? (
        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? 'News tahrirlash' : 'Yangi news'}</CardTitle>
            <CardDescription>Formani to'ldirib saqlang.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <FieldGroup>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field data-invalid={Boolean(error)}>
                    <FieldLabel htmlFor="news-title">Title</FieldLabel>
                    <Input
                      id="news-title"
                      onChange={(event) =>
                        setForm((current) => ({ ...current, title: event.target.value }))
                      }
                      required
                      value={form.title}
                    />
                  </Field>
                  <Field data-invalid={Boolean(error)}>
                    <FieldLabel htmlFor="news-slug">Slug</FieldLabel>
                    <Input
                      id="news-slug"
                      onChange={(event) =>
                        setForm((current) => ({ ...current, slug: event.target.value }))
                      }
                      required
                      value={form.slug}
                    />
                  </Field>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                <Field data-invalid={Boolean(error)}>
                  <FieldLabel htmlFor="news-description">Description</FieldLabel>
                  <Textarea
                    id="news-description"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    required
                    value={form.description}
                  />
                </Field>
                <Field data-invalid={Boolean(error)}>
                  <FieldLabel htmlFor="news-content">Content</FieldLabel>
                  <Textarea
                    id="news-content"
                    onChange={(event) =>
                      setForm((current) => ({ ...current, content: event.target.value }))
                    }
                    required
                    value={form.content}
                  />
                </Field>
                </div>
                <Field data-invalid={Boolean(error)}>
                  <FieldLabel>Category</FieldLabel>
                  <Select
                    onValueChange={(value) =>
                      setForm((current) => ({ ...current, category: value }))
                    }
                    value={form.category}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Category" />
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
                  <FieldDescription>Yangilik uchun kategoriya tanlang</FieldDescription>
                </Field>
                <Field data-invalid={Boolean(error)}>
                  <FieldLabel>Materiallar</FieldLabel>
                  <FileUpload
                    accept="image/*,video/*"
                    className="w-full"
                    disabled={uploadState.isLoading || uploadFilesState.isLoading}
                    maxFiles={10}
                    multiple
                    onFileReject={(file, message) =>
                      toast.error(message, {
                        description: `"${file.name}" yuklanmadi`,
                      })
                    }
                    onUpload={(files, options) => handleUploadFiles(files, options)}
                    onValueChange={setUploadQueue}
                    value={uploadQueue}
                  >
                    <FileUploadDropzone className="border-primary/25 bg-primary/10 hover:bg-primary/15 data-dragging:bg-primary/15">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="rounded-lg bg-primary/15 p-3">
                          <Upload className="size-8 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Rasm yoki video yuklang
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Fayllarni tashlang yoki tanlang
                          </p>
                        </div>
                      </div>
                      <FileUploadTrigger asChild>
                        <Button className="mt-3" size="sm">
                          Fayl tanlash
                        </Button>
                      </FileUploadTrigger>
                    </FileUploadDropzone>
                    <FileUploadList>
                      {uploadQueue.map((file) => (
                        <FileUploadItem key={`${file.name}-${file.lastModified}`} value={file}>
                          <FileUploadItemPreview />
                          <FileUploadItemMetadata />
                          <FileUploadItemProgress />
                          <FileUploadItemDelete asChild>
                            <Button size="icon" variant="ghost">
                              <X />
                            </Button>
                          </FileUploadItemDelete>
                        </FileUploadItem>
                      ))}
                    </FileUploadList>
                  </FileUpload>
                  <FieldDescription>
                    Bir yoki bir nechta rasm/video yuklang. Birinchi media asosiy media
                    sifatida ishlatiladi, umumiy type esa ko'pchilik media turidan
                    aniqlanadi.
                  </FieldDescription>
                </Field>
                {form.media.length > 0 ? (
                  <Field>
                    <FieldLabel>Yuklangan materiallar</FieldLabel>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {form.media.map((material, index) => (
                        <MaterialPreview
                          disabled={uploadState.isLoading}
                          key={material.url}
                          material={material}
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
                    <FieldDescription>
                      Birinchi material asosiy media sifatida ko'rsatiladi.
                    </FieldDescription>
                  </Field>
                ) : null}
                {error ? (
                  <FieldDescription>
                    {getApiErrorMessage(error, 'Form ma\'lumotlarini tekshiring')}
                  </FieldDescription>
                ) : null}
              </FieldGroup>
              <div className="flex justify-end">
                <Button disabled={isLoading || uploadState.isLoading} type="submit">
                  <Save data-icon="inline-start" />
                  Saqlash
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}
    </section>
  )
}

export default NewsFormPage
