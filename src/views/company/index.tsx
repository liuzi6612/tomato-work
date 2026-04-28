/**
 * 公司单位
 */
import React, { useEffect, useRef } from 'react'
import { useSetState } from 'ahooks'
import Table from '@/components/table'
import CreateCompanyModal from './CreateCompanyModal'
import { serviceGetAllCompany, serviceDelCompany } from '@/services'
import { Button, Popconfirm } from 'antd'
import { isMobile } from '@/utils'

const noMobile = !isMobile()

interface State {
  showCreateCompanyModal: boolean
  detail: { [key: string]: any }
}

const initialState: State = {
  showCreateCompanyModal: false,
  detail: {},
}

const CompanyPage = () => {
  const [state, setState] = useSetState(initialState)
  const tableRef = useRef<any>(null)
  const tableColumns: any[] = [
    {
      title: '单位名称',
      dataIndex: 'companyName',
      width: 170,
    },
    {
      title: '入职日期',
      dataIndex: 'startDate',
      width: 130,
    },
    {
      title: '离职日期',
      dataIndex: '__endDate__',
      width: 130,
    },
    {
      title: '计划离职日期',
      dataIndex: '__leaveDay__',
      width: 130,
      render: (__leaveDay__: any, record: any) =>
        __leaveDay__ > 0 ? (
          <div>
            {record.expectLeaveDate}
            <div>还有 {__leaveDay__} 天</div>
          </div>
        ) : null,
    },
    {
      title: '在职天数',
      dataIndex: '__jobDay__',
      width: 130,
      render: (__jobDay__: string, record: any) => (
        <div>
          {__jobDay__}
          <div>{record.__jobMonthDay__}</div>
        </div>
      ),
    },
    {
      title: '薪资',
      dataIndex: '__amount__',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      className: 'break-all',
    },
    {
      title: '操作',
      width: 170,
      align: 'right',
      fixed: noMobile && 'right',
      render: (record: any) => (
        <>
          <Button onClick={() => handleEditCompany(record)}>编辑</Button>
          <Popconfirm
            title="您确定要删除吗？"
            onConfirm={() => handleDelCompany(record)}
            placement="bottomRight"
            okType="danger"
          >
            <Button>删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ]

  function handleEditCompany(record: any) {
    setState({ detail: record })
    toggleCreateCompanyModal()
  }

  async function handleDelCompany(record: any) {
    await serviceDelCompany(record.id)
    tableRef.current.getTableData()
  }

  function getAllCompany() {
    return serviceGetAllCompany()
  }

  function toggleCreateCompanyModal() {
    setState({ showCreateCompanyModal: !state.showCreateCompanyModal })
  }

  const handleSuccess = function () {
    toggleCreateCompanyModal()
    tableRef.current.getTableData()
  }

  useEffect(() => {
    tableRef?.current?.getTableData()
  }, [])

  return (
    <div className="company">
      <Table
        ref={tableRef}
        getTableData={getAllCompany}
        columns={tableColumns}
        onDelete={serviceDelCompany}
        onAdd={() =>
          setState({
            showCreateCompanyModal: true,
            detail: {},
          })
        }
      />

      <CreateCompanyModal
        visible={state.showCreateCompanyModal}
        onSuccess={handleSuccess}
        onCancel={toggleCreateCompanyModal}
        detail={state.detail}
      />
    </div>
  )
}

export default CompanyPage
