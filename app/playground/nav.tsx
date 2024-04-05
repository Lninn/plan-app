'use client'

import { useStore } from "@/lib/playgroundStore";
import { Button } from "antd"
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
      <div>
        <Button onClick={showCreateCategoryModal}>添加分类</Button>
      </div>
    </header>
  )
}
