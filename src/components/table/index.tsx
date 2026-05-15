/**
 * @author xiejiahe <liuzi6612@gmail.com>
 * @example:
 * <Table
 *   // 配置ref用于调用父组件方法获取数据
 *   ref={tableRef}
 *
 *   // getData 接口函数获取数据，必须返回一个axios Promise 同时处理好数据
 *   getTableData={getData}
 *
 *   columns={tableColumns}
 * />
 */

import React, { FC, useEffect, useImperativeHandle, useState } from 'react'
import './style.scss'
import { Table } from 'antd'
import type { TableProps } from 'antd'
import Toolbar from './Toolbar'
import useDebounceFn from '@/hooks/useDebounceFn'

interface Props extends TableProps<any> {
  getTableData: (data: any) => Promise<any>
  onDelete?: (id: string) => Promise<any>
  onAdd?: () => void
  onRowSelectionChange?: (selectedRowKeys: string[], rows: any[]) => void
  toolbar?: React.ReactNode
  [key: string]: any
}

interface State {
  tableHeight: number
  tableDataSource: any[]
  isLoading: boolean
  pagination: Record<string, any>
  selectedRowKeys: string[]
  columns: any[]
  filters: Record<string, any> | null
  sorter: Record<string, any> | null
}

const DEFAULT_PAGE_SIZE = 50

const initialState: State = {
  tableHeight: 0,
  tableDataSource: [],
  isLoading: false,
  pagination: {
    pageNo: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    showSizeChanger: true,
    total: 0,
    pageSizeOptions: ['5', '30', '50', '70', '100', '200', '1000'],
  },
  selectedRowKeys: [],
  columns: [],
  filters: null,
  sorter: null,
}

function showTotal(total: number) {
  return `共有 ${total} 条`
}

const TableFC: FC<Props> = ({
  getTableData,
  onDelete,
  onAdd,
  onRowSelectionChange,
  ref: tableRef,
  columns,
  toolbar,
  ...props
}) => {
  let rowSelection
  const showRowSelection = onDelete
  const [state, setState] = useState<State>(initialState)

  const { run: getData } = useDebounceFn(
    (params?: any) => {
      params = {
        ...state,
        ...params,
      }
      setState((state) => ({ ...state, isLoading: true }))

      const sortMap: any = {
        descend: 'desc',
        ascend: 'asc',
      }

      const payload: Record<string, any> = {
        pageNo: params.pagination.current - 1,
        pageSize: params.pagination.pageSize,
      }
      if (params.sorter?.order) {
        payload.sort = `${params.sorter.field}-${sortMap[params.sorter.order]}`
      }
      // 调用父组件函数获取数据
      getTableData(payload)
        .then((res) => {
          setState((state) => ({
            ...state,
            pagination: {
              ...state.pagination,
              total: res.count,
            },
            tableDataSource: res.rows,
          }))
        })
        .finally(() => {
          setState((state) => ({ ...state, isLoading: false }))
        })
    },
    { wait: 500, leading: true },
  )

  function onChange(pagination: any, filters: any, sorter: any) {
    const pageNo = pagination.current
    const pageSize = pagination.pageSize
    setState((state) => ({
      ...state,
      pagination: {
        ...state.pagination,
        pageNo,
        pageSize,
      },
      filters,
      sorter,
    }))
    getData({
      pagination: {
        ...pagination,
      },
      filters: {
        ...filters,
      },
      sorter: {
        ...sorter,
      },
    })
  }

  function reset() {
    setState({ ...state, selectedRowKeys: [] })
    onRowSelectionChange?.([], [])
  }

  useImperativeHandle(tableRef, () => ({
    getTableData: getData,
    reset,
    pageNo: state.pagination.pageNo,
    pageSize: state.pagination.pageSize,
    filters: state.filters,
    sorter: state.sorter,
  }))

  useEffect(() => {
    if (Array.isArray(columns)) {
      setState((state) => ({
        ...state,
        columns: [
          {
            title: '序号',
            width: 60,
            render: (_: any, $: any, i: number) => i + 1,
            align: 'center',
          },
        ].concat(columns as []),
      }))
    }
  }, [columns])

  function handleDelete() {
    if (!onDelete) return null
    const selectedRowKeys = state.selectedRowKeys.join(',')
    onDelete(selectedRowKeys).then(() => {
      setState({ ...state, selectedRowKeys: [] })
      getData()
    })
  }

  if (showRowSelection) {
    rowSelection = {
      selectedRowKeys: state.selectedRowKeys,
      onChange(selectedRowKeys: string[]) {
        setState((state) => ({ ...state, selectedRowKeys }))
        onRowSelectionChange?.(selectedRowKeys, state.tableDataSource)
      },
    }
  }

  return (
    <React.Fragment>
      <Toolbar
        selectedRowKeys={state.selectedRowKeys}
        toolbar={toolbar}
        onDelete={onDelete && handleDelete}
        onAdd={onAdd}
      />

      <Table
        {...(props as any)}
        rowKey="id"
        loading={state.isLoading}
        columns={state.columns}
        dataSource={state.tableDataSource}
        scroll={{ x: 1200 }}
        showHeader={state.tableDataSource.length}
        onChange={onChange}
        rowSelection={rowSelection}
        pagination={{
          ...state.pagination,
          size: 'small',
          showTotal,
        }}
      />
    </React.Fragment>
  )
}

export default React.memo(TableFC)
