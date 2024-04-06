'use client';

import { useStore } from "@/lib/playgroundStore";
import { Modal, Form, Input, Button, message } from "antd";
import { useShallow } from "zustand/react/shallow";
import useSWRMutation from "swr/mutation";
import mockjs from 'mockjs'


// 生成随机的中文分类数据
function generateRandomCategory() {
  const firstCategory = mockjs.mock('@cword(3, 10)')
  const secondCategory = mockjs.mock('@cword(3, 10)')
  return { firstCategory, secondCategory }
}

async function sendRequest(url: string, { arg }: { arg: { firstCategory: string, secondCategory: string }}) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg)
  }).then(res => res.json())
}

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

  const { trigger, isMutating } = useSWRMutation('/api/category', sendRequest, /* options */)

  async function handleSubmit() {
    try {
      const {
        firstCategory,
        secondCategory,
      } = await form.validateFields();

      const createRes = await trigger({ firstCategory, secondCategory })
      if (createRes.ok) {
        message.success('添加成功', 1, () => {
          form.resetFields();
          closeAddCategoryModal();
        })
      } else {
        message.error('添加失败')
      }
    } catch (error) {
      //
    }
  }

  function fillRandomCategory() {
    const randomCategory = generateRandomCategory();
    // console.log(randomCategory)
    form.setFieldsValue(randomCategory)
  }

  return (
    <Modal
      title="添加分类"
      open={addCategoryOpen}
      onCancel={closeAddCategoryModal}
      onOk={handleSubmit}
      okButtonProps={isMutating ? { loading: true } : undefined}
    >
      <div style={{ padding: 16, textAlign: 'right' }}>
        <Button onClick={fillRandomCategory}>自动填充随机数据</Button>
      </div>
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
