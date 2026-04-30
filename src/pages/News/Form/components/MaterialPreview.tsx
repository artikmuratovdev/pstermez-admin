import { ImageIcon, Trash2, Upload, Video, X } from 'lucide-react'
import { useRef } from 'react'

import type { NewsMedia } from '@/app/api/baseApi/type'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const getMaterialName = (url: string) => url.split('/').filter(Boolean).at(-1) ?? url

const ThumbnailUploadZone = ({
  thumbnail,
  disabled,
  onThumbnailChange,
  onThumbnailUpload,
}: {
  thumbnail?: string
  disabled?: boolean
  onThumbnailChange: (url: string) => void
  onThumbnailUpload: (file: File | undefined) => void
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]

    if (file?.type.startsWith('image/')) {
      onThumbnailUpload(file)
    }
  }

  return (
    <div className="flex flex-col gap-2 border-t p-3">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Video muqovasi
      </p>

      {thumbnail ? (
        <div className="group/thumbnail relative aspect-video overflow-hidden rounded-lg border bg-muted">
          <img alt="Thumbnail" className="size-full object-cover" src={thumbnail} />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-foreground/55 opacity-0 transition-opacity group-hover/thumbnail:opacity-100">
            <Button
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
              size="sm"
              type="button"
              variant="secondary"
            >
              <Upload data-icon="inline-start" />
              Almashtirish
            </Button>
            <Button
              onClick={() => onThumbnailChange('')}
              size="sm"
              type="button"
              variant="destructive"
            >
              <X data-icon="inline-start" />
              O'chirish
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              inputRef.current?.click()
            }
          }}
          role="button"
          tabIndex={0}
        >
          <div className="rounded-full bg-muted p-2">
            <ImageIcon className="text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">Muqova rasm tanlang</p>
            <p className="text-xs text-muted-foreground">
              Bosing yoki tashlang. PNG, JPG, WEBP
            </p>
          </div>
        </div>
      )}

      <Input
        accept="image/*"
        className="hidden"
        disabled={disabled}
        onChange={(event) => onThumbnailUpload(event.target.files?.[0])}
        ref={inputRef}
        type="file"
      />
    </div>
  )
}

const MaterialPreview = ({
  material,
  primary,
  disabled,
  onRemove,
  onThumbnailChange,
  onThumbnailUpload,
}: {
  material: NewsMedia
  primary: boolean
  disabled?: boolean
  onRemove: () => void
  onThumbnailChange: (url: string) => void
  onThumbnailUpload: (file: File | undefined) => void
}) => {
  const isVideo = material.type === 'video'
  const name = getMaterialName(material.url)

  return (
    <div className="group flex min-w-0 flex-col overflow-hidden rounded-xl border bg-background shadow-sm transition-shadow hover:shadow-md">
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-muted">
        {isVideo ? (
          <video
            className="size-full object-cover"
            controls
            poster={material.thumbnail}
            preload="metadata"
            src={material.url}
          />
        ) : (
          <img alt={name} className="size-full object-cover" loading="lazy" src={material.url} />
        )}

        <div className="absolute left-2 top-2 flex gap-1">
          <Badge className="gap-1 bg-background/80 text-[10px] backdrop-blur-sm" variant="secondary">
            {isVideo ? <Video /> : <ImageIcon />}
            {isVideo ? 'Video' : 'Rasm'}
          </Badge>
          {primary ? <Badge className="text-[10px] backdrop-blur-sm">Asosiy</Badge> : null}
        </div>

        <button
          className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-destructive/90 text-destructive-foreground opacity-0 shadow-sm transition-opacity hover:bg-destructive disabled:cursor-not-allowed group-hover:opacity-100"
          disabled={disabled}
          onClick={onRemove}
          title="Mediani o'chirish"
          type="button"
        >
          <Trash2 />
        </button>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 text-sm">
        {isVideo ? (
          <Video className="shrink-0 text-muted-foreground" />
        ) : (
          <ImageIcon className="shrink-0 text-muted-foreground" />
        )}
        <span className="truncate text-muted-foreground" title={name}>
          {name}
        </span>
      </div>

      {isVideo ? (
        <ThumbnailUploadZone
          disabled={disabled}
          onThumbnailChange={onThumbnailChange}
          onThumbnailUpload={onThumbnailUpload}
          thumbnail={material.thumbnail}
        />
      ) : null}
    </div>
  )
}

export default MaterialPreview
