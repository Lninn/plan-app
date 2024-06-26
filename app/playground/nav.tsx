'use client'

import { useStore } from "@/lib/playgroundStore";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Modal, Space, message } from "antd"
import { useShallow } from "zustand/react/shallow";
import { mutate } from 'swr'

import style from './nav.module.css'


const { confirm } = Modal;

function useModalAction() {
  return useStore(
    useShallow((store) => ({
      showCreateCategoryModal: () => store.changeAddCategoryOpen(true),
    })),
  );
}

const showDeleteConfirm = () => {
  confirm({
    title: '确认清空分类数据',
    icon: <ExclamationCircleFilled />,
    content: '清除所有的分类数据，不可恢复',
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      return new Promise((resolve, reject) => {
        fetch('/api/category', { method: 'DELETE' })
          .then(res => res.json())
          .then(res => {
            // console.log('[showDeleteConfirm] res: ', res);
            if (res.ok) {
              message.success('清空成功');
              resolve(true);
            } else {
              reject();
              message.error('清空失败');
            }
          })
      }).then(() => {
        mutate('/api/category');
      })
    },
    onCancel() {
      // console.log('Cancel');
    },
  });
};

export default function Nav() {

  const { showCreateCategoryModal } = useModalAction();

  return (
    <header className={style.header}>
      <Space>
        <Button onClick={showCreateCategoryModal}>添加分类</Button>
        <Button onClick={showDeleteConfirm}>清空分类</Button>
      </Space>
    </header>
  )
}
