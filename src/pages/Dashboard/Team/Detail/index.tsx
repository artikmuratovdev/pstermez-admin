import { Link, useParams } from 'react-router'

import { ArrowLeft } from 'lucide-react'

import { useGetTeamMemberQuery } from '@/app/api/team'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorAlert, PageHeader } from '../../components/dashboard-ui'

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const TeamDetailImage = ({
  avatar,
  name,
}: {
  avatar?: string
  name: string
}) => (
  <div className="flex aspect-[4/3] w-full max-w-sm items-center justify-center overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10">
    {avatar ? (
      <img alt={name} className="size-full object-cover" src={avatar} />
    ) : (
      <span className="text-4xl font-semibold text-muted-foreground">
        {initials(name)}
      </span>
    )}
  </div>
)

const TeamDetailPage = () => {
  const { teamId = '' } = useParams()
  const { data, error, isLoading } = useGetTeamMemberQuery(teamId, {
    skip: !teamId,
  })
  const member = data?.data

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        action={
          <Button asChild variant="outline">
            <Link to="/team">
              <ArrowLeft data-icon="inline-start" />
              Team
            </Link>
          </Button>
        }
        description="GET /team/:id orqali team detail ko'rish."
        title="Team detail"
      />

      {error ? <ErrorAlert error={error} fallback="Team detail olinmadi" /> : null}
      {isLoading ? <Skeleton className="h-56" /> : null}

      {member ? (
        <Card>
          <CardHeader className="grid gap-4 md:grid-cols-[16rem_1fr] md:items-center">
            <TeamDetailImage avatar={member.avatar} name={member.name} />
            <div className="flex flex-col gap-1">
              <CardTitle>{member.name}</CardTitle>
              <CardDescription>{member.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{member.role}</Badge>
              <Badge variant={member.international ? 'secondary' : 'outline'}>
                {member.international ? 'International' : 'Local'}
              </Badge>
            </div>
            <Separator />
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Subject</p>
                <p className="font-medium">{member.subject ?? '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Country</p>
                <p className="font-medium">{member.country ?? '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </section>
  )
}

export default TeamDetailPage
