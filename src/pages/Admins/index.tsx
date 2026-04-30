import { type FormEvent, useState } from 'react'

import { Pencil, Plus, Save } from 'lucide-react'
import { Navigate } from 'react-router'
import { toast } from 'sonner'

import {
  getUserFromMeResponse,
  useCreateAdminMutation,
  useDeleteAdminMutation,
  useGetAdminsQuery,
  useMeQuery,
  useUpdateAdminMutation,
} from '@/app/api/auth'
import type { Admin, AdminFormRequest } from '@/app/api/baseApi/type'
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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
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
  formatDate,
  PageHeader,
  TableSkeleton,
} from '../components/dashboard-ui'

const initialForm: AdminFormRequest = {
  fullName: '',
  email: '',
  password: '',
}

const AdminFormDialog = ({
  admin,
  trigger,
}: {
  admin?: Admin
  trigger: React.ReactNode
}) => {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<AdminFormRequest>(
    admin
      ? { fullName: admin.fullName, email: admin.email, password: '' }
      : initialForm
  )
  const [createAdmin, createState] = useCreateAdminMutation()
  const [updateAdmin, updateState] = useUpdateAdminMutation()
  const error = createState.error ?? updateState.error
  const isLoading = createState.isLoading || updateState.isLoading

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      if (admin) {
        await updateAdmin({ id: admin._id, body: form }).unwrap()
        toast.success('Admin yangilandi')
      } else {
        await createAdmin({
          fullName: form.fullName,
          email: form.email,
          password: form.password ?? '',
        }).unwrap()
        toast.success('Admin yaratildi')
        setForm(initialForm)
      }
      setOpen(false)
    } catch (submitError) {
      toast.error(getApiErrorMessage(submitError, 'Admin saqlanmadi'))
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{admin ? 'Adminni tahrirlash' : 'Admin yaratish'}</DialogTitle>
          <DialogDescription>
            Superuser faqat admin hisoblarini boshqaradi.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field data-invalid={Boolean(error)}>
              <FieldLabel htmlFor="fullName">Full name</FieldLabel>
              <Input
                id="fullName"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    fullName: event.target.value,
                  }))
                }
                required
                value={form.fullName}
              />
            </Field>
            <Field data-invalid={Boolean(error)}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                required
                type="email"
                value={form.email}
              />
            </Field>
            <Field data-invalid={Boolean(error)}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                minLength={admin ? undefined : 6}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                required={!admin}
                type="password"
                value={form.password ?? ''}
              />
              {error ? (
                <FieldDescription>
                  {getApiErrorMessage(error, 'Form maʼlumotlarini tekshiring')}
                </FieldDescription>
              ) : null}
            </Field>
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

const AdminsPage = () => {
  const { data: meData, isLoading: isMeLoading } = useMeQuery()
  const user = meData ? getUserFromMeResponse(meData) : null
  const isSuperuser = user?.role === 'superuser'
  const { data, error, isLoading } = useGetAdminsQuery(undefined, {
    skip: !isSuperuser,
  })
  const [deleteAdmin, deleteState] = useDeleteAdminMutation()
  const admins = data?.data ?? []

  const handleDelete = async (id: string) => {
    try {
      await deleteAdmin(id).unwrap()
      toast.success('Admin oʼchirildi')
    } catch (deleteError) {
      toast.error(getApiErrorMessage(deleteError, 'Admin oʼchirilmadi'))
    }
  }

  if (isMeLoading) {
    return <TableSkeleton />
  }

  if (!isSuperuser) {
    return <Navigate replace to="/" />
  }

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        action={
          <AdminFormDialog
            trigger={
              <Button>
                <Plus data-icon="inline-start" />
                Admin
              </Button>
            }
          />
        }
        description="Superuser admin hisoblarini yaratadi, tahrirlaydi va o'chiradi."
        title="Admin management"
      />

      {error ? <ErrorAlert error={error} fallback="Adminlar olinmadi" /> : null}

      <Card>
        <CardHeader>
          <CardTitle>Admins</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? <TableSkeleton /> : null}
          {!isLoading && admins.length === 0 ? (
            <EmptyList
              description="Hali admin hisoblari topilmadi."
              title="Admin yo'q"
            />
          ) : null}
          {admins.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin._id}>
                    <TableCell className="font-medium">
                      {admin.fullName}
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{admin.role}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(admin.created_at)}</TableCell>
                    <TableCell>{formatDate(admin.updated_at)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <AdminFormDialog
                          admin={admin}
                          trigger={
                            <Button size="sm" variant="outline">
                              <Pencil data-icon="inline-start" />
                              Edit
                            </Button>
                          }
                        />
                        <DeleteAction
                          description={`${admin.fullName} admin hisobi o'chiriladi.`}
                          disabled={deleteState.isLoading}
                          label="Adminni o'chirish"
                          onConfirm={() => void handleDelete(admin._id)}
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

export default AdminsPage
