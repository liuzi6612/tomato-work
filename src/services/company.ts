import http from '@/utils/http'
import { formatDate, fromNow, getMonthDayDuration } from '@/utils'

// 查询所有单位
export async function serviceGetAllCompany(data?: object) {
  const res = await http.post('/company/getAll', data)
  res.rows = res.rows.map((item: any) => {
    item.startDate = formatDate(item.startDate)
    item.__amount__ = `￥${item.amount}`
    item.__jobDay__ = fromNow(item.startDate, item.endDate) + ' 天'
    item.__jobMonthDay__ = getMonthDayDuration(item.startDate, item.endDate)
    if (item.endDate) {
      item.endDate = formatDate(item.endDate)
    }
    if (item.expectLeaveDate) {
      item.expectLeaveDate = formatDate(item.expectLeaveDate)
      item.__leaveDay__ = fromNow(Date.now(), item.expectLeaveDate)
    }
    item.__endDate__ = item.endDate ?? '至今'
    return item
  })
  return res
}

// 创建单位
export function serviceCreateCompany(data: object) {
  return http.post('/company/add', data, {
    headers: { successAlert: 'true' },
  })
}

// 更新单位
export function serviceUpdateCompany(id: string, data: object) {
  return http.post(
    `/company/update`,
    { id, ...data },
    {
      headers: { successAlert: 'true' },
    },
  )
}

// 删除单位
export function serviceDelCompany(id: unknown) {
  return http.post(
    `/company/delete`,
    { id },
    {
      headers: { successAlert: 'true' },
    },
  )
}
