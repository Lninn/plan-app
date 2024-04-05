'use client'

import { Table } from "antd"
import AddCategoryModal from "./AddCategoryModal"

export default function ClientApp() {
  return (
    <>
      <Table dataSource={[]} />
      <AddCategoryModal />
    </>
  )
}
