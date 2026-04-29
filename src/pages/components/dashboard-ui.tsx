/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { AlertCircle, Inbox, Trash2 } from 'lucide-react'

import { getApiErrorMessage } from '@/app/api/baseApi'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

type Option = {
  label: string
  value: string
}

export const formatDate = (value?: string) => {
  if (!value) return '-'

  return new Date(value).toLocaleDateString('uz-UZ')
}

export const PageHeader = ({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) => {
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setContainer(document.getElementById('dashboard-navbar-header'))
  }, [])

  if (!container) return null

  return createPortal(
    <>
      <div className="flex min-w-0 flex-col gap-0.5">
        <h2 className="truncate text-lg font-semibold tracking-normal md:text-xl">
          {title}
        </h2>
        <p className="line-clamp-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </>,
    container
  )
}

export const ErrorAlert = ({
  error,
  fallback,
}: {
  error: unknown
  fallback: string
}) => (
  <Alert variant="destructive">
    <AlertCircle data-icon="inline-start" />
    <AlertTitle>Xatolik</AlertTitle>
    <AlertDescription>{getApiErrorMessage(error, fallback)}</AlertDescription>
  </Alert>
)

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="flex flex-col gap-2">
    {Array.from({ length: rows }).map((_, index) => (
      <Skeleton className="h-10" key={index} />
    ))}
  </div>
)

export const EmptyList = ({
  title,
  description,
}: {
  title: string
  description: string
}) => (
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <Inbox />
      </EmptyMedia>
      <EmptyTitle>{title}</EmptyTitle>
      <EmptyDescription>{description}</EmptyDescription>
    </EmptyHeader>
  </Empty>
)

export const DeleteAction = ({
  label,
  description,
  disabled,
  onConfirm,
}: {
  label: string
  description: string
  disabled?: boolean
  onConfirm: () => void
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button disabled={disabled} size="sm" variant="destructive">
        <Trash2 data-icon="inline-start" />
        Delete
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{label}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} variant="destructive">
          O'chirish
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)

export const FilterSelect = ({
  label,
  value,
  options,
  onValueChange,
}: {
  label: string
  value: string
  options: Option[]
  onValueChange: (value: string) => void
}) => (
  <Select onValueChange={onValueChange} value={value}>
    <SelectTrigger className="w-full md:w-44">
      <SelectValue placeholder={label} />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
)
