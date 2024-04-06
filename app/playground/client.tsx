'use client'

import { Button, Space, Table } from "antd"
import AddCategoryModal from "./add-category"
import useSWR from "swr";
import { fetcher } from "@/app/helper";

import style from "./client.module.css"


export default function ClientApp() {
  const {
    data,
    isLoading,
  } = useSWR('/api/category', fetcher, { dedupingInterval: 0, revalidateOnFocus: false });

  return (
    <main className={style.container}>
      <Table
        rowKey='id'
        columns={[
          {
            title: '分类名称',
            dataIndex: 'value',
            key: 'value',
          },
          {
            title: '分类值',
            dataIndex: 'value',
            key: 'value',
          },
          {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
          },
          {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: 100,
            align: 'center',
            render() {
              return (
                <Space>
                  <Button type='text'>编辑</Button>
                  <Button type='text'>删除</Button>
                </Space>
              )
            }
          }
        ]}
        loading={isLoading}
        dataSource={data}
      />

      <AddCategoryModal />
    </main>
  )
}
