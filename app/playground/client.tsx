'use client'

import { Table } from "antd"
import AddCategoryModal from "./AddCategoryModal"
import useSWR from "swr";
import { fetcher } from "@/app/helper";


export default function ClientApp() {
  const {
    data,
    isLoading,
  } = useSWR('/api/category', fetcher);

  return (
    <>
      <Table
        columns={[
          {
            title: '一级分类',
            dataIndex: 'firstCategory',
            key: 'firstCategory',
          },
          {
            title: '二级分类',
            dataIndex: 'secondCategory',
            key: 'secondCategory',
          },
          {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
          }
        ]}
        loading={isLoading}
        dataSource={data}
      />

      <AddCategoryModal />
    </>
  )
}
