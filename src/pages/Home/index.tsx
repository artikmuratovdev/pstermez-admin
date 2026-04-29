import {
  BadgeCheck,
  CalendarDays,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getUserFromMeResponse, useMeQuery } from '@/app/api/auth'
import { getApiErrorMessage } from '@/app/api/baseApi'

const DashboardIndex = () => {
  const { data, error, isLoading } = useMeQuery()
  const user = data ? getUserFromMeResponse(data) : null
  const displayName = user?.name ?? user?.fullName ?? 'Admin'
  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('uz-UZ')
    : null

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-normal">Home</h2>
        <p className="text-muted-foreground">
          Auth me orqali olingan admin ma'lumotlari.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : null}

      {error ? (
        <Card>
          <CardHeader>
            <CardTitle>Ma'lumot olinmadi</CardTitle>
            <CardDescription>
              {getApiErrorMessage(
                error,
                "Token mavjud, lekin /auth/me so'rovi muvaffaqiyatli tugamadi."
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {user ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound data-icon="inline-start" />
                Foydalanuvchi
              </CardTitle>
              <CardDescription>Ism</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{displayName}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail data-icon="inline-start" />
                Email
              </CardTitle>
              <CardDescription>Login email</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="truncate text-lg font-medium">
                {user.email ?? 'Email mavjud emas'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck data-icon="inline-start" />
                Status
              </CardTitle>
              <CardDescription>Role va auth holati</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <Badge variant="secondary">
                <BadgeCheck data-icon="inline-start" />
                Authed
              </Badge>
              {user.role ? <Badge variant="outline">{user.role}</Badge> : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays data-icon="inline-start" />
                Yaratilgan
              </CardTitle>
              <CardDescription>Admin profili sanasi</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">
                {createdAt ?? 'Sana mavjud emas'}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </section>
  )
}

export default DashboardIndex
