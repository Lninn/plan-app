'use client';

import { Modal, Form, Input } from "antd";


export default function CreateDialog(){
  return (
    <Modal
      title="添加分类"
      open={false}
    >
      <Form>
        <Form.Item label="一级分类名称">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
