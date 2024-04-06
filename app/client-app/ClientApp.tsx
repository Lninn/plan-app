'use client'

import style from './ClientApp.module.css'

import {
  CreateDialog,
  LinkInfoList,
} from '@/app/components'
import useApp from './useApp'
import SettingPanel from './SettingPanel'
import { useStore } from '@/lib/store'
import { useShallow } from 'zustand/react/shallow'
import { useEffect } from 'react'


function useAppModal() {
  return useStore(
    useShallow((store) => ({
      createDialogOpen: store.createDialogOpen,
      settingPanelOpen: store.settingPanelOpen,
      showCreateDialog: () => store.changeCreateDialogOpen(true),
      closeCreateDialog: () => store.changeCreateDialogOpen(false),
      closeSettingPanel: () => store.changeSettingPanelOpen(false),
    })),
  );
}

export default function ClientApp() {
 
  const {
    dataSource,
    tagOptions,
    appendList,
    toggleEnv,
  } = useApp()

  const {
    createDialogOpen,
    showCreateDialog,
    closeCreateDialog,
    settingPanelOpen,
    closeSettingPanel,
  } = useAppModal()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey && e.key === 'k') {
        showCreateDialog()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
  }, [])

  function isExist(name: string) {
    const i = dataSource.findIndex(item => item.title === name)
    return i !== -1
  }

  return (
    <>
      <div className={style.content}>
        <LinkInfoList dataSource={dataSource} />
      </div>

      <CreateDialog
        open={createDialogOpen}
        tagOptions={tagOptions}
        isExist={isExist}
        onClose={closeCreateDialog}
        submit={records => {
          console.log('[CreateDialog-submit]', records)
          appendList(records)
        }}
      />

      <SettingPanel
        open={settingPanelOpen}
        onClose={closeSettingPanel}
        toggleEnv={toggleEnv}
      />
    </>
  )
}
