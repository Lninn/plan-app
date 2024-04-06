'use client';

import { useStore } from "@/lib/playgroundStore";
import { Modal, Form, Input, Button, message } from "antd";
import { useShallow } from "zustand/react/shallow";
import useSWRMutation from "swr/mutation";
import { CategoryUtil } from '@/shared/category-util'


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
        closeAddCategoryModal();
        message.success(createRes.msg, 1, () => {
          form.resetFields();
        })
      } else {
        message.error(createRes.msg)
      }
    } catch (error) {
      // console.log(error)
      if (error instanceof Object && 'errorFields' in error) {
        //
      } else {
        message.error('添加失败')
      }
    }
  }

  function fillRandomCategory() {
    const randomCategory = CategoryUtil.getRandomCategoryPair()
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
