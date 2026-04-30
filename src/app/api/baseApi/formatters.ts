const padDatePart = (value: number) => value.toString().padStart(2, '0')

const formatDate = (value?: string | Date | null) => {
  if (!value) return '-'

  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  const year = date.getFullYear()
  const month = padDatePart(date.getMonth() + 1)
  const day = padDatePart(date.getDate())

  return `${year}.${month}.${day}`
}

export const apiFormatters = {
  date: formatDate,
}
