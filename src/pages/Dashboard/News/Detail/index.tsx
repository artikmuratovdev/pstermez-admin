import { Link, useParams } from 'react-router'

import { ArrowLeft, Eye, ImageIcon } from 'lucide-react'

import type { NewsMedia } from '@/app/api/baseApi/type'
import { useGetNewsByIdQuery } from '@/app/api/news'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorAlert, formatDate } from '../../components/dashboard-ui'

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

const NewsDetailPage = () => {
  const { newsId = '' } = useParams()
  const { data, error, isLoading } = useGetNewsByIdQuery(newsId, {
    skip: !newsId,
  })
  const news = data?.data
  const primaryMedia = getPrimaryMedia(news?.media)

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div>
        <Button asChild variant="outline">
          <Link to="/news">
            <ArrowLeft data-icon="inline-start" />
            News
          </Link>
        </Button>
      </div>
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

          {primaryMedia ? (
            <figure className="flex flex-col gap-3">
              <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10">
                {primaryMedia.url ? (
                  primaryMedia.type === 'video' ? (
                    <video
                      className="size-full object-cover"
                      controls
                      poster={primaryMedia.thumbnail}
                      preload="metadata"
                      src={primaryMedia.url}
                    />
                  ) : (
                    <img
                      alt={news.title}
                      className="size-full object-cover"
                      src={getMediaPreviewUrl(primaryMedia)}
                    />
                  )
                ) : (
                  <ImageIcon className="text-muted-foreground" />
                )}
              </div>
              {primaryMedia.type === 'video' ? (
                <figcaption className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span>{primaryMedia.mimeType ?? 'video'}</span>
                  <span>{formatDuration(primaryMedia.duration)}</span>
                  <span>{formatBytes(primaryMedia.size)}</span>
                </figcaption>
              ) : null}
            </figure>
          ) : null}

          {news.media && news.media.length > 1 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {news.media.map((media) => (
                <div
                  className="flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-muted"
                  key={media.url}
                >
                  {media.type === 'video' ? (
                    <video
                      className="size-full object-cover"
                      controls
                      poster={media.thumbnail}
                      preload="metadata"
                      src={media.url}
                    />
                  ) : (
                    <img
                      alt={news.title}
                      className="size-full object-cover"
                      loading="lazy"
                      src={media.url}
                    />
                  )}
                </div>
              ))}
            </div>
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
