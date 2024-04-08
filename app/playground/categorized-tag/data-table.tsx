'use client'

import { type CategorizedTagInfo } from "@/shared/type";
import { Button, Space, Table } from "antd";
import { type ColumnsType } from "antd/es/table";


interface Props {
  data: CategorizedTagInfo[];
}

const columns: ColumnsType<CategorizedTagInfo> = [
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    render: (_, { title, url, icon }) => {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img width={36} height={36} src={icon} alt="icon" />
          <a href={url} target='_blank'>{title}</a>
        </div>
      )
    }
  },
  {
    title: '分类',
    dataIndex: 'categories',
    key: 'categories',
    render(categories) {
      return categories.join('->')
    }
  },
  {
    title: '标签',
    dataIndex: 'tags',
    key: 'tags',
    render: (tags) => {
      return tags.join()
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
    render: (_, { id }) => {
      return (
        <Space>
          <Button type="text">编辑</Button>
          <Button type="text">删除</Button>
        </Space>
      )
    }
  }
]

export default function DataTable({ data }: Props) {
  return (
    <Table
      rowKey='id'
      dataSource={data}
      columns={columns}
      pagination={false}
      style={{ textAlign: 'left' }}
    /> 
  )
}
