import { useState } from 'react'
import { Link } from 'react-router'

import { Eye, LayoutGrid, List, Plus } from 'lucide-react'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/app/api/baseApi'
import type { TeamMember } from '@/app/api/baseApi/type'
import { useDeleteTeamMemberMutation, useGetTeamQuery } from '@/app/api/team'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DeleteAction,
  EmptyList,
  ErrorAlert,
  FilterSelect,
  PageHeader,
  TableSkeleton,
} from '../components/dashboard-ui'
import { roleOptions } from './constants'

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const InternationalBadge = ({ international }: { international: boolean }) => (
  <Badge variant={international ? 'secondary' : 'outline'}>
    {international ? 'Yes' : 'No'}
  </Badge>
)

const TeamCardImage = ({ member }: { member: TeamMember }) => (
  <div className="flex aspect-4/3 w-full items-center justify-center overflow-hidden bg-muted">
    {member.avatar ? (
      <img
        alt={member.name}
        className="size-full object-cover transition-transform duration-300 group-hover/card:scale-105"
        loading="lazy"
        src={member.avatar}
      />
    ) : (
      <span className="text-4xl font-semibold text-muted-foreground">
        {initials(member.name)}
      </span>
    )}
  </div>
)

const TeamPage = () => {
  const [roleFilter, setRoleFilter] = useState('all')
  const [internationalFilter, setInternationalFilter] = useState('all')
  const filters = {
    ...(roleFilter !== 'all' ? { role: roleFilter } : {}),
    ...(internationalFilter !== 'all' ? { international: internationalFilter } : {}),
  }
  const { data, error, isLoading } = useGetTeamQuery(filters)
  const [deleteMember, deleteState] = useDeleteTeamMemberMutation()
  const team = data?.data ?? []

  const handleDelete = async (id: string) => {
    try {
      await deleteMember(id).unwrap()
      toast.success('Team member o\'chirildi')
    } catch (deleteError) {
      toast.error(getApiErrorMessage(deleteError, 'Team member o\'chirilmadi'))
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        action={
          <Button asChild>
            <Link to="create">
              <Plus data-icon="inline-start" />
              Team
            </Link>
          </Button>
        }
        description="Team CRUD, role enum va avatar upload flow."
        title="Team"
      />

      <div className="flex flex-col gap-2 md:flex-row">
        <FilterSelect
          label="Role"
          onValueChange={setRoleFilter}
          options={[{ label: 'All roles', value: 'all' }, ...roleOptions]}
          value={roleFilter}
        />
        <FilterSelect
          label="International"
          onValueChange={setInternationalFilter}
          options={[
            { label: 'All', value: 'all' },
            { label: 'International', value: 'true' },
            { label: 'Local', value: 'false' },
          ]}
          value={internationalFilter}
        />
      </div>

      {error ? <ErrorAlert error={error} fallback="Team olinmadi" /> : null}

      <Tabs defaultValue="table">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            {team.length} ta team member
          </div>
          <TabsList>
            <TabsTrigger value="table">
              <List data-icon="inline-start" />
              Table
            </TabsTrigger>
            <TabsTrigger value="cards">
              <LayoutGrid data-icon="inline-start" />
              Cards
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>Role, subject va international status.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? <TableSkeleton /> : null}
              {!isLoading && team.length === 0 ? (
                <EmptyList description="Filter bo'yicha team topilmadi." title="Team yo'q" />
              ) : null}
              {team.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>International</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {team.map((member) => (
                      <TableRow key={member._id}>
                        <TableCell>
                          <Link
                            className="flex items-center gap-2 underline-offset-4 hover:underline"
                            to={member._id}
                          >
                            <Avatar className="size-8">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>{initials(member.name)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{member.name}</span>
                          </Link>
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{member.role}</Badge>
                        </TableCell>
                        <TableCell>{member.subject ?? '-'}</TableCell>
                        <TableCell>
                          <InternationalBadge international={member.international} />
                        </TableCell>
                        <TableCell>{member.country ?? '-'}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button asChild size="sm" variant="outline">
                              <Link to={member._id}>
                                <Eye data-icon="inline-start" />
                                View
                              </Link>
                            </Button>
                            <Button asChild size="sm" variant="outline">
                              <Link to={`${member._id}/edit`}>Edit</Link>
                            </Button>
                            <DeleteAction
                              description={`${member.name} team member o'chiriladi.`}
                              disabled={deleteState.isLoading}
                              label="Team member o'chirish"
                              onConfirm={() => void handleDelete(member._id)}
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
        </TabsContent>

        <TabsContent value="cards">
          {isLoading ? <TableSkeleton /> : null}
          {!isLoading && team.length === 0 ? (
            <EmptyList description="Filter bo'yicha team topilmadi." title="Team yo'q" />
          ) : null}
          {team.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {team.map((member) => (
                <Card key={member._id}>
                  <TeamCardImage member={member} />
                  <CardHeader>
                    <div className="flex justify-end">
                      <InternationalBadge international={member.international} />
                    </div>
                    <CardTitle>
                      <Link className="underline-offset-4 hover:underline" to={member._id}>
                        {member.name}
                      </Link>
                    </CardTitle>
                    <CardDescription>{member.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{member.role}</Badge>
                      {member.subject ? (
                        <Badge variant="outline">{member.subject}</Badge>
                      ) : null}
                    </div>
                    {member.country ? (
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-muted-foreground">Country</span>
                        <span className="truncate font-medium">{member.country}</span>
                      </div>
                    ) : null}
                  </CardContent>
                  <CardFooter className="justify-between gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link to={member._id}>
                        <Eye data-icon="inline-start" />
                        View
                      </Link>
                    </Button>
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link to={`${member._id}/edit`}>Edit</Link>
                      </Button>
                      <DeleteAction
                        description={`${member.name} team member o'chiriladi.`}
                        disabled={deleteState.isLoading}
                        label="Team member o'chirish"
                        onConfirm={() => void handleDelete(member._id)}
                      />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : null}
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default TeamPage
