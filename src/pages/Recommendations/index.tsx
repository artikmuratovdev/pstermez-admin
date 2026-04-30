import { type FormEvent, type ReactNode, useState } from 'react'

import { ExternalLink, Pencil, Plus, Save } from 'lucide-react'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/app/api/baseApi'
import type {
  Recommendation,
  RecommendationFormRequest,
} from '@/app/api/baseApi/type'
import {
  useAddRecommendationMutation,
  useDeleteRecommendationMutation,
  useGetRecommendationsQuery,
  useUpdateRecommendationMutation,
} from '@/app/api/recommendations'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DeleteAction,
  EmptyList,
  ErrorAlert,
  PageHeader,
  PaginationControls,
  TableSkeleton,
  formatDate,
} from '../components/dashboard-ui'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 20

const initialForm: RecommendationFormRequest = {
  title: '',
  href: '',
  source: '',
}

const getInitialForm = (
  recommendation?: Recommendation
): RecommendationFormRequest =>
  recommendation
    ? {
        title: recommendation.title,
        href: recommendation.href,
        source: recommendation.source,
      }
    : initialForm

const isHttpsUrl = (value: string) => {
  try {
    const url = new URL(value)

    return url.protocol === 'https:'
  } catch {
    return false
  }
}

const RecommendationFormDialog = ({
  recommendation,
  trigger,
}: {
  recommendation?: Recommendation
  trigger: ReactNode
}) => {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<RecommendationFormRequest>(() =>
    getInitialForm(recommendation)
  )
  const [hrefError, setHrefError] = useState('')
  const [addRecommendation, addState] = useAddRecommendationMutation()
  const [updateRecommendation, updateState] = useUpdateRecommendationMutation()
  const error = addState.error ?? updateState.error
  const isLoading = addState.isLoading || updateState.isLoading

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)

    if (nextOpen) {
      setForm(getInitialForm(recommendation))
      setHrefError('')
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = {
      title: form.title.trim(),
      href: form.href.trim(),
      source: form.source.trim(),
    }

    if (!isHttpsUrl(payload.href)) {
      setHrefError('Href to\'liq https:// URL bo\'lishi kerak.')
      return
    }

    try {
      if (recommendation) {
        await updateRecommendation({
          id: recommendation._id,
          body: payload,
        }).unwrap()
        toast.success('Recommendation yangilandi')
      } else {
        await addRecommendation(payload).unwrap()
        toast.success('Recommendation yaratildi')
      }
      setOpen(false)
      setForm(initialForm)
    } catch (submitError) {
      toast.error(getApiErrorMessage(submitError, 'Recommendation saqlanmadi'))
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {recommendation ? 'Recommendation tahrirlash' : 'Recommendation yaratish'}
          </DialogTitle>
          <DialogDescription>
            Href backendga to'liq https:// URL sifatida yuboriladi.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field data-invalid={Boolean(error)}>
              <FieldLabel htmlFor="recommendation-title">Title</FieldLabel>
              <Input
                id="recommendation-title"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                required
                value={form.title}
              />
            </Field>
            <Field data-invalid={Boolean(hrefError || error)}>
              <FieldLabel htmlFor="recommendation-href">Href</FieldLabel>
              <Input
                id="recommendation-href"
                onChange={(event) => {
                  setHrefError('')
                  setForm((current) => ({
                    ...current,
                    href: event.target.value,
                  }))
                }}
                placeholder="https://example.com/admission"
                required
                type="url"
                value={form.href}
              />
              {hrefError ? <FieldDescription>{hrefError}</FieldDescription> : null}
            </Field>
            <Field data-invalid={Boolean(error)}>
              <FieldLabel htmlFor="recommendation-source">Source</FieldLabel>
              <Input
                id="recommendation-source"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    source: event.target.value,
                  }))
                }
                required
                value={form.source}
              />
            </Field>
            {error ? (
              <FieldDescription>
                {getApiErrorMessage(error, 'Form ma\'lumotlarini tekshiring')}
              </FieldDescription>
            ) : null}
          </FieldGroup>
          <DialogFooter>
            <Button disabled={isLoading} type="submit">
              <Save data-icon="inline-start" />
              Saqlash
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const RecommendationsPage = () => {
  const [page, setPage] = useState(DEFAULT_PAGE)
  const { data, error, isLoading } = useGetRecommendationsQuery({
    page,
    limit: DEFAULT_LIMIT,
  })
  const [deleteRecommendation, deleteState] = useDeleteRecommendationMutation()
  const recommendations = data?.data ?? []

  const handleDelete = async (id: string) => {
    try {
      await deleteRecommendation(id).unwrap()
      toast.success('Recommendation o\'chirildi')
    } catch (deleteError) {
      toast.error(getApiErrorMessage(deleteError, 'Recommendation o\'chirilmadi'))
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        action={
          <RecommendationFormDialog
            trigger={
              <Button>
                <Plus data-icon="inline-start" />
                Recommendation
              </Button>
            }
          />
        }
        description="Public recommendation linklari va manbalari."
        title="Recommendations"
      />

      {error ? <ErrorAlert error={error} fallback="Recommendations olinmadi" /> : null}

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>Title, source va external href.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? <TableSkeleton /> : null}
          {!isLoading && recommendations.length === 0 ? (
            <EmptyList
              description="Hozircha recommendation mavjud emas."
              title="Recommendation yo'q"
            />
          ) : null}
          {recommendations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Href</TableHead>
                  <TableHead>Created at</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recommendations.map((recommendation) => (
                  <TableRow key={recommendation._id}>
                    <TableCell className="max-w-80">
                      <span className="block truncate font-medium">
                        {recommendation.title}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{recommendation.source}</Badge>
                    </TableCell>
                    <TableCell className="max-w-80">
                      <a
                        className="inline-flex max-w-full items-center gap-2 truncate underline-offset-4 hover:underline"
                        href={recommendation.href}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span className="truncate">{recommendation.href}</span>
                        <ExternalLink data-icon="inline-end" />
                      </a>
                    </TableCell>
                    <TableCell>{formatDate(recommendation.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <RecommendationFormDialog
                          recommendation={recommendation}
                          trigger={
                            <Button size="sm" variant="outline">
                              <Pencil data-icon="inline-start" />
                              Edit
                            </Button>
                          }
                        />
                        <DeleteAction
                          description={`${recommendation.title} recommendation o'chiriladi.`}
                          disabled={deleteState.isLoading}
                          label="Recommendation o'chirish"
                          onConfirm={() => void handleDelete(recommendation._id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
          {data ? (
            <PaginationControls
              next={data.next}
              onPageChange={setPage}
              page={data.page}
              prev={data.prev}
              totalPages={data.totalPages}
            />
          ) : null}
        </CardContent>
      </Card>
    </section>
  )
}

export default RecommendationsPage
