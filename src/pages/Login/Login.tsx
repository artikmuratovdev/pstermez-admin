import type { FormEvent } from 'react'

import { LogIn } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'

import { useLoginMutation } from '@/app/api/auth'
import { getApiErrorMessage } from '@/app/api/baseApi'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { setAuthTokens } from '@/lib/auth'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [login, { error, isLoading }] = useLoginMutation()
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? '/'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '')
    const password = String(formData.get('password') ?? '')
    const response = await login({ email, password }).unwrap().catch(() => null)

    if (response?.success && response.access_token) {
      setAuthTokens({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      })
      navigate(from, { replace: true })
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4">
      <section className="w-full max-w-sm rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-normal">Kirish</h1>
          <p className="text-sm text-muted-foreground">
            Admin panelga kirish uchun ma'lumotlarni kiriting.
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field data-invalid={Boolean(error)}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                placeholder="admin@example.com"
                required
                type="email"
              />
            </Field>

            <Field data-invalid={Boolean(error)}>
              <FieldLabel htmlFor="password">Parol</FieldLabel>
              <Input
                id="password"
                name="password"
                placeholder="Parolni kiriting"
                required
                type="password"
              />
            </Field>
          </FieldGroup>

          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Login xatosi</AlertTitle>
              <AlertDescription>
                {getApiErrorMessage(error, 'Login yoki parol xato.')}
              </AlertDescription>
            </Alert>
          ) : null}

          <Button className="mt-2" disabled={isLoading} type="submit">
            <LogIn data-icon="inline-start" />
            {isLoading ? 'Kirilmoqda...' : 'Kirish'}
          </Button>
        </form>
      </section>
    </main>
  )
}

export default Login
