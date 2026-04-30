import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { Save, Upload } from 'lucide-react'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/app/api/baseApi'
import type { TeamFormRequest, TeamMember } from '@/app/api/baseApi/type'
import {
  useCreateTeamMemberMutation,
  useGetTeamQuery,
  useGetTeamMemberQuery,
  useUpdateTeamMemberMutation,
} from '@/app/api/team'
import { useUploadFileMutation } from '@/app/api/upload'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { BackButton, ErrorAlert, PageHeader } from '../../components/dashboard-ui'
import { isInternationalRole, roleOptions } from '../constants'

const initialForm: TeamFormRequest = {
  name: '',
  email: '',
  avatar: '',
  role: 'teacher',
  subject: '',
  international: false,
  country: '',
}

const getInitialForm = (member?: TeamMember): TeamFormRequest =>
  member
    ? {
        name: member.name,
        email: member.email,
        avatar: member.avatar ?? '',
        role: member.role,
        subject: member.subject ?? '',
        international: isInternationalRole(member.role),
        country: isInternationalRole(member.role) ? member.country ?? '' : '',
      }
    : initialForm

const normalizeTeamForm = (form: TeamFormRequest): TeamFormRequest => {
  const international = isInternationalRole(form.role)
  const { country, ...rest } = form

  return international ? { ...rest, international, country } : { ...rest, international }
}

const TeamFormPage = () => {
  const navigate = useNavigate()
  const { teamId = '' } = useParams()
  const isEdit = Boolean(teamId)
  const { data: teamData } = useGetTeamQuery({ page: 1, limit: 100 })
  const {
    data,
    error: loadError,
    isLoading: isMemberLoading,
  } = useGetTeamMemberQuery(teamId, { skip: !isEdit })
  const member = data?.data
  const [form, setForm] = useState<TeamFormRequest>(() => getInitialForm(member))
  const [loadedMemberId, setLoadedMemberId] = useState('')
  const [createMember, createState] = useCreateTeamMemberMutation()
  const [updateMember, updateState] = useUpdateTeamMemberMutation()
  const [uploadFile, uploadState] = useUploadFileMutation()
  const error = createState.error ?? updateState.error
  const isLoading = createState.isLoading || updateState.isLoading
  const existingCeo = teamData?.data.find((teamMember) => teamMember.role === 'ceo')
  const isCeoOptionDisabled = Boolean(existingCeo && existingCeo._id !== teamId)

  useEffect(() => {
    if (member && loadedMemberId !== member._id) {
      setLoadedMemberId(member._id)
      setForm(getInitialForm(member))
    }
  }, [loadedMemberId, member])

  const handleUpload = async (file: File | undefined) => {
    if (!file) return

    try {
      const response = await uploadFile(file).unwrap()
      setForm((current) => ({ ...current, avatar: response.file_path }))
      toast.success('Avatar yuklandi')
    } catch (uploadError) {
      toast.error(getApiErrorMessage(uploadError, 'Avatar yuklanmadi'))
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = normalizeTeamForm(form)

    try {
      if (isEdit) {
        await updateMember({ id: teamId, body: payload }).unwrap()
        toast.success('Team member yangilandi')
      } else {
        await createMember(payload).unwrap()
        toast.success('Team member yaratildi')
      }
      navigate('/team')
    } catch (submitError) {
      toast.error(getApiErrorMessage(submitError, 'Team member saqlanmadi'))
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        action={
          <BackButton fallback="/team">Team</BackButton>
        }
        actionPlacement="start"
        description="Team member ma'lumotlari, role enum va avatar."
        title={isEdit ? 'Team tahrirlash' : 'Team yaratish'}
      />

      {loadError ? <ErrorAlert error={loadError} fallback="Team member olinmadi" /> : null}
      {isMemberLoading ? <Skeleton className="h-72" /> : null}

      {!isMemberLoading ? (
        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? 'Team member tahrirlash' : 'Yangi team member'}</CardTitle>
            <CardDescription>Role qiymatlari backend enum bilan mos yuboriladi.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <FieldGroup>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field data-invalid={Boolean(error)}>
                    <FieldLabel htmlFor="team-name">Name</FieldLabel>
                    <Input
                      id="team-name"
                      onChange={(event) =>
                        setForm((current) => ({ ...current, name: event.target.value }))
                      }
                      required
                      value={form.name}
                    />
                  </Field>
                  <Field data-invalid={Boolean(error)}>
                    <FieldLabel htmlFor="team-email">Email</FieldLabel>
                    <Input
                      id="team-email"
                      onChange={(event) =>
                        setForm((current) => ({ ...current, email: event.target.value }))
                      }
                      required
                      type="email"
                      value={form.email}
                    />
                  </Field>
                </div>
                <Field data-invalid={Boolean(error)}>
                  <FieldLabel htmlFor="team-avatar">Avatar</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="team-avatar"
                      readOnly
                      value={form.avatar ?? ''}
                    />
                    <InputGroupAddon>
                      <Upload />
                    </InputGroupAddon>
                  </InputGroup>
                  <Input
                    disabled={uploadState.isLoading}
                    onChange={(event) => void handleUpload(event.target.files?.[0])}
                    type="file"
                  />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field data-invalid={Boolean(error)}>
                    <FieldLabel>Role</FieldLabel>
                    <Select
                      onValueChange={(value) =>
                        setForm((current) => ({
                          ...current,
                          role: value,
                          international: isInternationalRole(value),
                          country: isInternationalRole(value) ? current.country : '',
                        }))
                      }
                      value={form.role}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {roleOptions.map((option) => (
                            <SelectItem
                              disabled={option.value === 'ceo' && isCeoOptionDisabled}
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {isCeoOptionDisabled ? (
                      <FieldDescription>
                        CEO role allaqachon boshqa team memberga biriktirilgan.
                      </FieldDescription>
                    ) : null}
                  </Field>
                  <Field data-invalid={Boolean(error)}>
                    <FieldLabel htmlFor="team-subject">Subject</FieldLabel>
                    <Input
                      id="team-subject"
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          subject: event.target.value,
                        }))
                      }
                      value={form.subject ?? ''}
                    />
                  </Field>
                </div>
                {isInternationalRole(form.role) ? (
                  <Field data-invalid={Boolean(error)}>
                    <FieldLabel htmlFor="team-country">Country</FieldLabel>
                    <Input
                      id="team-country"
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          country: event.target.value,
                        }))
                      }
                      required
                      value={form.country ?? ''}
                    />
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

export default TeamFormPage
