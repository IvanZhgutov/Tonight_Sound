import { useMemo } from 'react'

const WEEK_TITLES = [
  { id: 'wt-1', title: 'Пн', status: 'weekTitle' },
  { id: 'wt-2', title: 'Вт', status: 'weekTitle' },
  { id: 'wt-3', title: 'Ср', status: 'weekTitle' },
  { id: 'wt-4', title: 'Чт', status: 'weekTitle' },
  { id: 'wt-5', title: 'Пт', status: 'weekTitle' },
  { id: 'wt-6', title: 'Сб', status: 'weekTitle' },
  { id: 'wt-7', title: 'Вскр', status: 'weekTitle' },
]

export const UseCalendarButtons = (date = new Date()) => {
  return useMemo(() => {
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const year = today.getFullYear()
    const month = today.getMonth()

    // First and last day of the month
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // Monday-based offset: getDay() returns 0=Sun,1=Mon,...
    // Convert to Mon=0, Tue=1, ..., Sun=6
    const startOffset = (firstDay.getDay() + 6) % 7
    const endOffset = (7 - ((lastDay.getDay() + 6) % 7 + 1)) % 7

    const days = []
    let idCounter = 1

    // Days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({
        id: idCounter++,
        title: prevMonthLastDay - i,
        status: 'inactive',
        inCurrentMonth: false,
      })
    }

    // Days of current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const current = new Date(year, month, d)
      let status

      if (current < today) {
        status = 'inactive'
      } else if (current.getTime() === today.getTime()) {
        status = 'today'
      } else {
        status = 'default'
      }

      days.push({ id: idCounter++, title: d, status, inCurrentMonth: true })
    }

    // Days from next month to complete the last week
    for (let d = 1; d <= endOffset; d++) {
      days.push({ id: idCounter++, title: d, status: 'inactive', inCurrentMonth: false })
    }

    // Split into weeks of 7
    const weeks = [WEEK_TITLES]
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7))
    }

    return weeks
  }, [date])
}