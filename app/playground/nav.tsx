'use client'

import { useStore } from "@/lib/playgroundStore";
import { Button, Space } from "antd"
import { useShallow } from "zustand/react/shallow";


function useModalAction() {
  return useStore(
    useShallow((store) => ({
      showCreateCategoryModal: () => store.changeAddCategoryOpen(true),
    })),
  );
}

export default function Nav() {

  const { showCreateCategoryModal } = useModalAction();

  return (
    <header>
      <Space>
        <Button onClick={showCreateCategoryModal}>添加分类</Button>
        <Button onClick={showCreateCategoryModal}>清空分类</Button>
      </Space>
    </header>
  )
}
