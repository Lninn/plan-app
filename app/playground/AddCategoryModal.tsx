'use client';

import { useStore } from "@/lib/playgroundStore";
import { Modal, Form, Input } from "antd";
import { useShallow } from "zustand/react/shallow";


function useAppModal() {
  return useStore(
    useShallow((store) => ({
      addCategoryOpen: store.addCategoryOpen,
      closeAddCategoryModal: () => store.changeAddCategoryOpen(false),
    })),
  );
}

export default function AddCategoryModal(){
  const { addCategoryOpen, closeAddCategoryModal } = useAppModal();

  const [form] = Form.useForm();

  async function handleSubmit() {
    try {
      const values = await form.validateFields();
      console.log(values);
    } catch (error) {
      //
    }
  }

  return (
    <Modal
      title="添加分类"
      open={addCategoryOpen}
      onCancel={closeAddCategoryModal}
      onOk={handleSubmit}
    >
      <Form form={form} layout='vertical'>
        <Form.Item
          label="一级分类名称"
          name='firstCategory'
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="二级分类名称"
          name='secondCategory'
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
