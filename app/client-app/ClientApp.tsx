'use client'

import style from './ClientApp.module.css'

import {
  CreateDialog,
  LinkInfoList,
} from '@/app/components'
import useApp from './useApp'
import AppHeader from '../components/AppHeader'
import SettingPanel from './SettingPanel'


export default function ClientApp() {
 
  const {
    createDialogOpen,
    dataSource,
    categories,
    tagOptions,
    appendList,
    closeCreateDialog,
    settingPanelOpen,
    openSettingPanel,
    closeSettingPanel,
    openAddDialog,
    toggleEnv,
  } = useApp()

  function isExist(name: string) {
    const i = dataSource.findIndex(item => item.title === name)
    return i !== -1
  }

  return (
    <div>
      <AppHeader
        openAddDialog={openAddDialog}
        openSettingPanel={openSettingPanel}
        tagOptions={tagOptions}
      />

      <div className={style.content}>
        <LinkInfoList dataSource={dataSource} />
      </div>

      <CreateDialog
        open={createDialogOpen}
        categories={categories}
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
    </div>
  )
}
