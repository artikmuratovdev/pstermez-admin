import { ImageIcon, Play } from 'lucide-react'

import type { NewsItem } from '@/app/api/baseApi/type'

const getPrimaryMedia = (news: NewsItem) => news.media?.[0]

const getMediaPreviewUrl = (news: NewsItem) =>
  getPrimaryMedia(news)?.type === 'video'
    ? getPrimaryMedia(news)?.thumbnail || getPrimaryMedia(news)?.url
    : getPrimaryMedia(news)?.url

const NewsMediaPreview = ({
  news,
  size = 'default',
}: {
  news: NewsItem
  size?: 'default' | 'sm'
}) => {
  const previewUrl = getMediaPreviewUrl(news)
  const primaryMedia = getPrimaryMedia(news)
  const isVideo = primaryMedia?.type === 'video'

  return (
    <div
      className={
        size === 'sm'
          ? 'relative flex h-14 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted'
          : 'relative flex aspect-video w-full shrink-0 items-center justify-center overflow-hidden bg-muted'
      }
    >
      {previewUrl ? (
        isVideo && !primaryMedia?.thumbnail ? (
          <video
            className={
              size === 'sm'
                ? 'size-full object-cover'
                : 'size-full object-cover transition-transform duration-300 group-hover/card:scale-105'
            }
            muted
            playsInline
            preload="metadata"
            src={previewUrl}
          />
        ) : (
          <img
            alt={news.title}
            className={
              size === 'sm'
                ? 'size-full object-cover'
                : 'size-full object-cover transition-transform duration-300 group-hover/card:scale-105'
            }
            loading="lazy"
            src={previewUrl}
          />
        )
      ) : (
        <ImageIcon className="text-muted-foreground" />
      )}
      {isVideo ? (
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/15">
          <span className="flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm">
            <Play />
          </span>
        </div>
      ) : null}
    </div>
  )
}

export default NewsMediaPreview
