export const roleOptions = [
  { label: 'Administration', value: 'administration' },
  { label: 'Teacher', value: 'teacher' },
  { label: 'International teacher', value: 'international_teacher' },
  { label: 'Educator', value: 'educator' },
]

export const isInternationalRole = (role: string) => role === 'international_teacher'
