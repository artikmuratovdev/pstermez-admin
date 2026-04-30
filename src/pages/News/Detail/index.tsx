import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import { Eye, ImageIcon } from 'lucide-react'

import type { NewsMedia } from '@/app/api/baseApi/type'
import { useGetNewsQuery } from '@/app/api/news'
import { Badge } from '@/components/ui/badge'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BackButton,
  ErrorAlert,
  PageHeader,
  formatDate,
} from '../../components/dashboard-ui'

const getCategoryName = (category: string | { name: string }) =>
  typeof category === 'string' ? category : category.name

const formatBytes = (bytes?: number) => {
  if (!bytes) return '-'

  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

const formatDuration = (seconds?: number) => {
  if (!seconds) return '-'

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const getMediaPreviewUrl = (media: NewsMedia) =>
  media.type === 'video' ? media.thumbnail || media.url : media.url

const getPrimaryMedia = (media?: NewsMedia[]) => media?.[0]

const NewsMediaCarousel = ({
  media,
  title,
}: {
  media: NewsMedia[]
  title: string
}) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return

    const updateCurrent = () => setCurrent(api.selectedScrollSnap())

    updateCurrent()
    api.on('select', updateCurrent)

    return () => {
      api.off('select', updateCurrent)
    }
  }, [api])

  return (
    <div className="flex flex-col gap-4">
      <Carousel className="w-full" opts={{ loop: media.length > 1 }} setApi={setApi}>
        <CarouselContent>
          {media.map((item) => (
            <CarouselItem key={item.url}>
              <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10">
                {item.url ? (
                  item.type === 'video' ? (
                    <video
                      className="size-full object-cover"
                      controls
                      poster={item.thumbnail}
                      preload="metadata"
                      src={item.url}
                    />
                  ) : (
                    <img
                      alt={title}
                      className="size-full object-cover"
                      src={getMediaPreviewUrl(item)}
                    />
                  )
                ) : (
                  <ImageIcon className="text-muted-foreground" />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {media.length > 1 ? (
          <>
            <CarouselPrevious className="left-3" />
            <CarouselNext className="right-3" />
          </>
        ) : null}
      </Carousel>

      {media.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {media.map((item, index) => (
            <button
              className={
                current === index
                  ? 'h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 border-primary bg-muted'
                  : 'h-16 w-24 shrink-0 overflow-hidden rounded-md border bg-muted opacity-70 transition-opacity hover:opacity-100'
              }
              key={item.url}
              onClick={() => api?.scrollTo(index)}
              type="button"
            >
              {item.type === 'video' ? (
                item.thumbnail ? (
                  <img
                    alt={title}
                    className="size-full object-cover"
                    src={item.thumbnail}
                  />
                ) : (
                  <video
                    className="size-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                    src={item.url}
                  />
                )
              ) : (
                <img
                  alt={title}
                  className="size-full object-cover"
                  loading="lazy"
                  src={item.url}
                />
              )}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

const NewsDetailPage = () => {
  const { newsId = '' } = useParams()
  const { data, error, isLoading } = useGetNewsQuery({ page: 1, limit: 1000 })
  const news = data?.data.find((item) => item._id === newsId)
  const primaryMedia = getPrimaryMedia(news?.media)

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <PageHeader
        action={<BackButton fallback="/news">News</BackButton>}
        actionPlacement="start"
        description="News detail va media ko'rish."
        title="News detail"
      />
      {error ? <ErrorAlert error={error} fallback="News detail olinmadi" /> : null}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-24" />
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="h-56" />
        </div>
      ) : null}

      {news ? (
        <article className="flex flex-col gap-6">
          <header className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">{getCategoryName(news.category)}</Badge>
              <Badge variant="outline">
                {news.media?.length ? `${news.media.length} media` : '-'}
              </Badge>
              <span className="flex items-center gap-1">
                <Eye />
                {news.views ?? 0}
              </span>
              <span>{formatDate(news.created_at)}</span>
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal">
              {news.title}
            </h1>
            <p className="max-w-3xl text-xl leading-8 text-muted-foreground">
              {news.description}
            </p>
          </header>

          {news.media?.length ? (
            <figure className="flex flex-col gap-3">
              <NewsMediaCarousel media={news.media} title={news.title} />
              {primaryMedia?.type === 'video' ? (
                <figcaption className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span>{primaryMedia.mimeType ?? 'video'}</span>
                  <span>{formatDuration(primaryMedia.duration)}</span>
                  <span>{formatBytes(primaryMedia.size)}</span>
                </figcaption>
              ) : null}
            </figure>
          ) : null}

          <Separator />

          <div className="whitespace-pre-wrap text-lg leading-8 text-foreground">
            {news.content}
          </div>
        </article>
      ) : null}
    </section>
  )
}

export default NewsDetailPage
