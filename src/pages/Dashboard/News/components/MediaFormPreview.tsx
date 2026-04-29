import type { NewsMedia } from '@/app/api/baseApi/type'

const MediaFormPreview = ({ media }: { media?: NewsMedia }) => {
  if (!media?.url) return null

  return (
    <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-muted">
      {media.type === 'video' ? (
        <video
          className="size-full object-cover"
          controls
          preload="metadata"
          src={media.url}
        />
      ) : (
        <img
          alt="Media preview"
          className="size-full object-cover"
          loading="lazy"
          src={media.url}
        />
      )}
    </div>
  )
}

export default MediaFormPreview
