import type { FormEvent } from 'react'

import { LogIn } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import { setAuthToken } from '@/lib/auth'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? '/dashboard'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAuthToken('demo-token')
    navigate(from, { replace: true })
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
          <label className="flex flex-col gap-2 text-sm font-medium">
            Email
            <input
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              placeholder="admin@example.com"
              type="email"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium">
            Parol
            <input
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              placeholder="••••••••"
              type="password"
            />
          </label>

          <Button className="mt-2" type="submit">
            <LogIn data-icon="inline-start" />
            Kirish
          </Button>
        </form>
      </section>
    </main>
  )
}

export default Login
