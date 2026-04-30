export const teamRoles = [
  'ceo',
  'administration',
  'teacher',
  'international_teacher',
  'educator',
] as const

export type TeamRole = (typeof teamRoles)[number]

export const roleOptions = [
  { label: 'CEO', value: 'ceo' },
  { label: 'Administration', value: 'administration' },
  { label: 'Teacher', value: 'teacher' },
  { label: 'International teacher', value: 'international_teacher' },
  { label: 'Educator', value: 'educator' },
] satisfies Array<{ label: string; value: TeamRole }>

export const roleLabels: Record<TeamRole, string> = {
  ceo: 'CEO',
  administration: 'Administration',
  teacher: 'Teacher',
  international_teacher: 'International teacher',
  educator: 'Educator',
}

export const getRoleLabel = (role: string) =>
  roleLabels[role as TeamRole] ?? role

export const isInternationalRole = (role: string) => role === 'international_teacher'
