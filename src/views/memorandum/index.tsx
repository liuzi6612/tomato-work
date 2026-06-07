/**
 * 我的备忘
 */
import React, { useState, useEffect } from 'react'
import './style.scss'
import dayjs from 'dayjs'
import NoData from '@/components/no-data/index'
import { Card, Button, Popconfirm, Spin, Tag } from 'antd'
import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router'
import { serviceGetMemorandum, serviceDeleteMemorandum } from '@/services'
import { defaultTitle } from './constants'

interface MemorandumItem {
  id: string
  title: string
  html: string
  preview: string
  createdAt: string
  updatedAt: string
  createdAtValue: string
  updatedAtValue: string
  isUntitled: boolean
}

function getPreviewText(html = '') {
  const text = html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim()

  return text || '记录一点灵感、提醒或待确认的信息，让重要内容不再散落。'
}

const MemorandumPage: React.FC = () => {
  const navigate = useNavigate()
  const [list, setList] = useState<MemorandumItem[]>([])
  const [loading, setLoading] = useState(true)
  const totalCount = list.length
  const untitledCount = list.filter((item) => item.isUntitled).length
  const namedCount = totalCount - untitledCount
  const latestUpdatedItem = list.reduce<MemorandumItem | null>((latest, item) => {
    if (!latest) {
      return item
    }

    return dayjs(item.updatedAtValue).valueOf() >
      dayjs(latest.updatedAtValue).valueOf()
      ? item
      : latest
  }, null)

  function handleButton(
    buttonType: 0 | 1 | 2,
    item: MemorandumItem | null,
    e?: React.MouseEvent,
  ) {
    e?.stopPropagation()
    e?.preventDefault()

    if (buttonType === 0 && item) {
      setLoading(true)
      serviceDeleteMemorandum(item.id)
        .then(() => {
          return getData()
        })
        .finally(() => {
          setLoading(false)
        })
      return
    }

    if (buttonType === 2) {
      navigate('/home/memorandum/create')
      return
    }

    if (item) {
      navigate(`/home/memorandum/update/${item.id}`)
    }
  }

  function getData() {
    return serviceGetMemorandum()
      .then((res) => {
        const data = res.rows.map((item: any) => {
          const format = 'YYYY.M.D HH:mm'
          const title = item.title || defaultTitle
          return {
            ...item,
            title,
            html: item.html || '',
            preview: getPreviewText(item.html),
            createdAt: dayjs(item.createdAt).format(format),
            updatedAt: dayjs(item.updatedAt).format(format),
            createdAtValue: item.createdAt,
            updatedAtValue: item.updatedAt,
            isUntitled: title === defaultTitle,
          }
        })
        setList(data)
      })
  }

  function goDetail(id: string) {
    navigate(`/home/memorandum/detail/${id}`)
  }

  useEffect(() => {
    setLoading(true)
    getData().finally(() => setLoading(false))
  }, [])

  return (
    <Spin spinning={loading} classNames={{ root: 'memorandum-spin' }}>
      <div className="memorandum">
        <section className="memorandum-hero">
          <div className="hero-content">
            <span className="hero-eyebrow">MEMORANDUM</span>
            <h1 className="hero-title">把零散想法整理成可回看的记录</h1>
            <p className="hero-description">
              会议要点、临时灵感、待确认事项，都可以在这里沉淀下来。
              点击卡片即可进入详情，继续补充完整内容。
            </p>

            <div className="hero-pills">
              <span className="hero-pill">
                <FileTextOutlined />
                共 {totalCount} 条备忘
              </span>
              <span className="hero-pill">
                <ClockCircleOutlined />
                {latestUpdatedItem
                  ? `最近更新 ${dayjs(latestUpdatedItem.updatedAtValue).format(
                      'M月D日 HH:mm',
                    )}`
                  : '等待第一条记录'}
              </span>
            </div>
          </div>

          <div className="hero-side">
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              className="create-button"
              onClick={handleButton.bind(null, 2, null)}
            >
              新建备忘录
            </Button>

            <div className="hero-card">
              <span className="hero-card-label">最新动态</span>
              <h2 className="hero-card-title">
                {latestUpdatedItem?.title || '还没有备忘录'}
              </h2>
              <p className="hero-card-description">
                {latestUpdatedItem
                  ? `更新于 ${dayjs(latestUpdatedItem.updatedAtValue).format(
                      'YYYY年M月D日 HH:mm',
                    )}`
                  : '创建一条备忘录，把今天的重要信息先留住。'}
              </p>

              <div className="hero-stats">
                <div className="hero-stat">
                  <span>已命名</span>
                  <strong>{namedCount}</strong>
                </div>
                <div className="hero-stat">
                  <span>默认标题</span>
                  <strong>{untitledCount}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="memorandum-list-section">
          <div className="section-head">
            <div>
              <h2>全部备忘</h2>
              <p>按卡片快速扫读重点内容，点击任意卡片查看全文。</p>
            </div>
          </div>

          {list.length > 0 ? (
            <div className="memorandum-grid grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {list.map((item, index) => (
                <Card
                  onClick={() => goDetail(item.id)}
                  hoverable
                  key={item.id}
                  className="memorandum-card"
                >
                  <div className="card-top">
                    <div className="card-type">
                      <span className="card-dot"></span>
                      <span>备忘录</span>
                    </div>
                    <span className="card-index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="card-header">
                    <div className="card-title-row">
                      <h3 className="card-title">{item.title}</h3>
                      {item.isUntitled ? (
                        <Tag variant="filled" className="untitled-tag">
                          默认标题
                        </Tag>
                      ) : null}
                    </div>
                    <span className="card-updated">
                      <ClockCircleOutlined />
                      {item.updatedAt}
                    </span>
                  </div>

                  <p className="content">{item.preview}</p>

                  <div className="card-footer">
                    <div className="card-meta">
                      <span>创建于 {item.createdAt}</span>
                      <span>点击卡片查看详情</span>
                    </div>

                    <div className="button-group">
                      <Popconfirm
                        title="您确定要删除吗？"
                        onConfirm={(e) => {
                          e?.stopPropagation()
                          handleButton(0, item)
                        }}
                        onCancel={(e) => {
                          e?.stopPropagation()
                        }}
                        placement="bottomRight"
                        okType="danger"
                      >
                        <Button
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={(e) => e?.stopPropagation()}
                        >
                          删除
                        </Button>
                      </Popconfirm>
                      <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={handleButton.bind(null, 1, item)}
                      >
                        编辑
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            !loading && (
              <div className="memorandum-empty">
                <NoData
                  message="还没有备忘录，是否马上创建？"
                  onClick={handleButton.bind(null, 2, null)}
                />
              </div>
            )
          )}
        </section>
      </div>
    </Spin>
  )
}

export default MemorandumPage
