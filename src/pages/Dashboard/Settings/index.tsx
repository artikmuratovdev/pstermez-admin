import { type FormEvent, useEffect, useState } from 'react'

import { Save } from 'lucide-react'
import { toast } from 'sonner'

import {
  getUserFromMeResponse,
  useMeQuery,
  useUpdateMeMutation,
  useUpdatePasswordMutation,
} from '@/app/api/auth'
import { getApiErrorMessage } from '@/app/api/baseApi'
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
import { ErrorAlert, PageHeader } from '../components/dashboard-ui'

const SettingsPage = () => {
  const { data, error } = useMeQuery()
  const user = data ? getUserFromMeResponse(data) : null
  const [profile, setProfile] = useState({ fullName: '', email: '' })
  const [passwords, setPasswords] = useState({
    old_password: '',
    new_password: '',
  })
  const [updateMe, updateMeState] = useUpdateMeMutation()
  const [updatePassword, updatePasswordState] = useUpdatePasswordMutation()

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfile({ fullName: user.fullName, email: user.email })
    }
  }, [user])

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await updateMe(profile).unwrap()
      toast.success('Profile yangilandi')
    } catch (submitError) {
      toast.error(getApiErrorMessage(submitError, 'Profile yangilanmadi'))
    }
  }

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await updatePassword(passwords).unwrap()
      toast.success('Password yangilandi')
      setPasswords({ old_password: '', new_password: '' })
    } catch (submitError) {
      toast.error(getApiErrorMessage(submitError, 'Password yangilanmadi'))
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        description="Profile va password auth endpointlari bilan yangilanadi."
        title="Settings"
      />

      {error ? <ErrorAlert error={error} fallback="Profile olinmadi" /> : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>PATCH /auth/update-me</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handleProfileSubmit}>
              <FieldGroup>
                <Field data-invalid={Boolean(updateMeState.error)}>
                  <FieldLabel htmlFor="profile-name">Full name</FieldLabel>
                  <Input
                    id="profile-name"
                    onChange={(event) =>
                      setProfile((current) => ({
                        ...current,
                        fullName: event.target.value,
                      }))
                    }
                    required
                    value={profile.fullName}
                  />
                </Field>
                <Field data-invalid={Boolean(updateMeState.error)}>
                  <FieldLabel htmlFor="profile-email">Email</FieldLabel>
                  <Input
                    id="profile-email"
                    onChange={(event) =>
                      setProfile((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    required
                    type="email"
                    value={profile.email}
                  />
                  {updateMeState.error ? (
                    <FieldDescription>
                      {getApiErrorMessage(
                        updateMeState.error,
                        'Form maʼlumotlarini tekshiring'
                      )}
                    </FieldDescription>
                  ) : null}
                </Field>
              </FieldGroup>
              <Button disabled={updateMeState.isLoading} type="submit">
                <Save data-icon="inline-start" />
                Saqlash
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>PATCH /auth/update-password</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handlePasswordSubmit}>
              <FieldGroup>
                <Field data-invalid={Boolean(updatePasswordState.error)}>
                  <FieldLabel htmlFor="old-password">Old password</FieldLabel>
                  <Input
                    id="old-password"
                    onChange={(event) =>
                      setPasswords((current) => ({
                        ...current,
                        old_password: event.target.value,
                      }))
                    }
                    required
                    type="password"
                    value={passwords.old_password}
                  />
                </Field>
                <Field data-invalid={Boolean(updatePasswordState.error)}>
                  <FieldLabel htmlFor="new-password">New password</FieldLabel>
                  <Input
                    id="new-password"
                    onChange={(event) =>
                      setPasswords((current) => ({
                        ...current,
                        new_password: event.target.value,
                      }))
                    }
                    required
                    type="password"
                    value={passwords.new_password}
                  />
                  {updatePasswordState.error ? (
                    <FieldDescription>
                      {getApiErrorMessage(
                        updatePasswordState.error,
                        'Form maʼlumotlarini tekshiring'
                      )}
                    </FieldDescription>
                  ) : null}
                </Field>
              </FieldGroup>
              <Button disabled={updatePasswordState.isLoading} type="submit">
                <Save data-icon="inline-start" />
                Saqlash
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default SettingsPage
