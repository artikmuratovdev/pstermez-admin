import { type FormEvent, type ReactNode, useState } from 'react'

import { Plus, Save } from 'lucide-react'
import { toast } from 'sonner'

import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from '@/app/api/categories'
import type { Category, CategoryFormRequest } from '@/app/api/baseApi/type'
import { getApiErrorMessage } from '@/app/api/baseApi'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
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
  FilterSelect,
  PageHeader,
  TableSkeleton,
} from '../components/dashboard-ui'

const categoryTypeOptions = [
  { label: 'News', value: 'news' },
  { label: 'Team', value: 'team' },
  { label: 'General', value: 'general' },
]

const initialForm: CategoryFormRequest = {
  name: '',
  slug: '',
  type: 'news',
  isActive: true,
}

const CategoryFormDialog = ({
  category,
  trigger,
}: {
  category?: Category
  trigger: ReactNode
}) => {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<CategoryFormRequest>(
    category
      ? {
          name: category.name,
          slug: category.slug,
          type: category.type,
          isActive: category.isActive,
        }
      : initialForm
  )
  const [createCategory, createState] = useCreateCategoryMutation()
  const [updateCategory, updateState] = useUpdateCategoryMutation()
  const error = createState.error ?? updateState.error
  const isLoading = createState.isLoading || updateState.isLoading

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      if (category) {
        await updateCategory({ id: category._id, body: form }).unwrap()
        toast.success('Category yangilandi')
      } else {
        await createCategory(form).unwrap()
        toast.success('Category yaratildi')
        setForm(initialForm)
      }
      setOpen(false)
    } catch (submitError) {
      toast.error(getApiErrorMessage(submitError, 'Category saqlanmadi'))
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? 'Category tahrirlash' : 'Category yaratish'}
          </DialogTitle>
          <DialogDescription>
            Category news va boshqa content filterlarida ishlatiladi.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field data-invalid={Boolean(error)}>
              <FieldLabel htmlFor="category-name">Name</FieldLabel>
              <Input
                id="category-name"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                required
                value={form.name}
              />
            </Field>
            <Field data-invalid={Boolean(error)}>
              <FieldLabel htmlFor="category-slug">Slug</FieldLabel>
              <Input
                id="category-slug"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    slug: event.target.value,
                  }))
                }
                required
                value={form.slug}
              />
            </Field>
            <Field data-invalid={Boolean(error)}>
              <FieldLabel>Type</FieldLabel>
              <Select
                onValueChange={(value) =>
                  setForm((current) => ({ ...current, type: value }))
                }
                value={form.type}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categoryTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field orientation="horizontal">
              <Switch
                checked={form.isActive}
                onCheckedChange={(checked) =>
                  setForm((current) => ({ ...current, isActive: checked }))
                }
              />
              <FieldLabel>Active</FieldLabel>
            </Field>
            {error ? (
              <FieldDescription>
                {getApiErrorMessage(error, 'Form maʼlumotlarini tekshiring')}
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

const CategoriesPage = () => {
  const [typeFilter, setTypeFilter] = useState('all')
  const [activeFilter, setActiveFilter] = useState('all')
  const filters = {
    ...(typeFilter !== 'all' ? { type: typeFilter } : {}),
    ...(activeFilter !== 'all' ? { isActive: activeFilter } : {}),
  }
  const { data, error, isLoading } = useGetCategoriesQuery(filters)
  const [deleteCategory, deleteState] = useDeleteCategoryMutation()
  const categories = data?.data ?? []

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id).unwrap()
      toast.success('Category oʼchirildi')
    } catch (deleteError) {
      toast.error(getApiErrorMessage(deleteError, 'Category oʼchirilmadi'))
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        action={
          <CategoryFormDialog
            trigger={
              <Button>
                <Plus data-icon="inline-start" />
                Category
              </Button>
            }
          />
        }
        description="Category CRUD va public GET filterlarini boshqarish."
        title="Categories"
      />

      <div className="flex flex-col gap-2 md:flex-row">
        <FilterSelect
          label="Type"
          onValueChange={setTypeFilter}
          options={[{ label: 'All types', value: 'all' }, ...categoryTypeOptions]}
          value={typeFilter}
        />
        <FilterSelect
          label="Active"
          onValueChange={setActiveFilter}
          options={[
            { label: 'All statuses', value: 'all' },
            { label: 'Active', value: 'true' },
            { label: 'Inactive', value: 'false' },
          ]}
          value={activeFilter}
        />
      </div>

      {error ? <ErrorAlert error={error} fallback="Category olinmadi" /> : null}

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? <TableSkeleton /> : null}
          {!isLoading && categories.length === 0 ? (
            <EmptyList
              description="Filter bo'yicha category topilmadi."
              title="Category yo'q"
            />
          ) : null}
          {categories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{category.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.isActive ? 'secondary' : 'outline'}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <CategoryFormDialog
                          category={category}
                          trigger={
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          }
                        />
                        <DeleteAction
                          description={`${category.name} category o'chiriladi.`}
                          disabled={deleteState.isLoading}
                          label="Category o'chirish"
                          onConfirm={() => void handleDelete(category._id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </CardContent>
      </Card>
    </section>
  )
}

export default CategoriesPage
