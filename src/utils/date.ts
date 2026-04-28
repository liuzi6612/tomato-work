import dayjs from 'dayjs'

export const FORMAT_DATETIME = 'YYYY-MM-DD HH:mm:ss'
export const FORMAT_DATE_MINUTE = 'YYYY-MM-DD HH:mm'
export const FORMAT_DATE = 'YYYY-MM-DD'
export const DATE_WEEK: any = [dayjs().subtract(7, 'day'), dayjs()]
export const DATE_YEAR: any = [dayjs().startOf('year'), dayjs().endOf('year')]

// 判断传入时间是否小于今天时间戳
export function isBefore(current: dayjs.ConfigType): boolean {
  const today = new Date().setHours(0, 0, 0, 0)
  return dayjs(current).isBefore(today)
}

export function formatDate(date: dayjs.ConfigType): string {
  return dayjs(date).format(FORMAT_DATE)
}

export function formatDateTime(date: dayjs.ConfigType): string {
  return dayjs(date).format(FORMAT_DATETIME)
}

export function formatDateMinute(date: dayjs.ConfigType): string {
  return dayjs(date).format(FORMAT_DATE_MINUTE)
}

export function fromNow(
  startDate: dayjs.ConfigType,
  endDate: dayjs.ConfigType,
): number {
  const start = dayjs(startDate).valueOf()
  const end = dayjs(endDate || Date.now()).valueOf()
  const n = end - start
  return Math.ceil(n / (1000 * 60 * 60 * 24))
}

export function getMonthDayDuration(
  startDate: dayjs.ConfigType,
  endDate?: dayjs.ConfigType,
): string {
  const start = dayjs(startDate)
  const end = dayjs(endDate || Date.now())
  const months = end.diff(start, 'month')
  const days = end.diff(start.add(months, 'month'), 'day')
  return `${months} 个月 ${days} 天`
}

export function getWeek(date: dayjs.ConfigType): string {
  const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weeks[dayjs(date).day()]
}

export function isToDay(date: dayjs.ConfigType): boolean {
  const m = dayjs(date)
  const n = new Date()
  return (
    m.year() === n.getFullYear() &&
    m.month() === n.getMonth() &&
    m.date() === n.getDate()
  )
}
