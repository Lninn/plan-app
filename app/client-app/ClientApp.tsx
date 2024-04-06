'use client'

import style from './ClientApp.module.css'

import {
  CreateDialog,
  LinkInfoList,
} from '@/app/components'
import SettingPanel from './SettingPanel'
import { useStore } from '@/lib/store'
import { useShallow } from 'zustand/react/shallow'
import { useEffect } from 'react'
import useSWR from 'swr'
import { fetcher } from '../helper'
import { type CategorizedTagInfo } from '../type'
import { useCategory } from '@/hooks'


function useAppAction() {
  return useStore(
    useShallow((store) => ({
      createDialogOpen: store.createDialogOpen,
      settingPanelOpen: store.settingPanelOpen,
      showCreateDialog: () => store.changeCreateDialogOpen(true),
      closeCreateDialog: () => store.changeCreateDialogOpen(false),
      closeSettingPanel: () => store.changeSettingPanelOpen(false),
      setCategoryList: store.setCategoryList
    })),
  );
}

export default function ClientApp() {

  const {
    data = [],
  } = useSWR<CategorizedTagInfo[]>(
    '/api/categorizedTagLibrary',
    fetcher,
    { dedupingInterval: 0, revalidateOnFocus: false }
  );

  const {
    data: categoryData = [],
  } = useCategory()

  const {
    createDialogOpen,
    showCreateDialog,
    closeCreateDialog,
    settingPanelOpen,
    closeSettingPanel,
    setCategoryList,
  } = useAppAction()

  useEffect(() => {
    if (!categoryData) return

    setCategoryList(categoryData)
  }, [JSON.stringify(categoryData)])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey && e.key === 'k') {
        showCreateDialog()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
  }, [])

  function isExist(name: string) {
    const i = data.findIndex(item => item.title === name)
    return i !== -1
  }

  return (
    <>
      <div className={style.content}>
        <LinkInfoList dataSource={data} />
      </div>

      <CreateDialog
        open={createDialogOpen}
        tagOptions={[]}
        isExist={isExist}
        onClose={closeCreateDialog}
        categoryList={categoryData}
      />

      <SettingPanel
        open={settingPanelOpen}
        onClose={closeSettingPanel}
        toggleEnv={() => {}}
      />
    </>
  )
}
