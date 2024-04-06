'use client'

import { Table } from "antd"
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
        columns={[
          {
            title: '一级分类',
            dataIndex: 'value',
            key: 'value',
          },
          {
            title: '二级分类',
            dataIndex: 'value',
            key: 'value',
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
    </main>
  )
}
