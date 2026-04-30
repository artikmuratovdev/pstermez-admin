import type { FormEvent } from 'react'

import { LogIn, ShieldCheck } from 'lucide-react'
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
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
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
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,var(--primary)_0,transparent_32%),linear-gradient(135deg,var(--background),var(--muted))] p-6 md:p-10">
      <section className="w-full max-w-5xl">
        <Card className="overflow-hidden p-0 shadow-xl">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-10" onSubmit={handleSubmit}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <ShieldCheck />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-normal">
                      PS Termiz Admin
                    </h1>
                    <p className="text-balance text-muted-foreground">
                      Admin panelga kirish uchun ma'lumotlarni kiriting.
                    </p>
                  </div>
                </div>

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

                {error ? (
                  <Alert variant="destructive">
                    <AlertTitle>Login xatosi</AlertTitle>
                    <AlertDescription>
                      {getApiErrorMessage(error, 'Login yoki parol xato.')}
                    </AlertDescription>
                  </Alert>
                ) : null}

                <Field>
                  <Button disabled={isLoading} type="submit">
                    <LogIn data-icon="inline-start" />
                    {isLoading ? 'Kirilmoqda...' : 'Kirish'}
                  </Button>
                </Field>

                <FieldDescription className="text-center">
                  Kirish faqat admin foydalanuvchilar uchun.
                </FieldDescription>
              </FieldGroup>
            </form>

            <div className="relative hidden bg-muted md:block">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--primary),var(--muted))]" />
              <div className="absolute inset-0 flex items-center justify-center p-12">
                <img
                  alt="PS Termiz Admin"
                  className="max-h-64 w-full max-w-sm object-contain drop-shadow-2xl"
                  src="/logo.webp"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

export default Login
