'use client'

import style from './ClientApp.module.css'

import { Drawer, Form, Radio,Switch } from 'antd'
import {
  CreateDialog,
  LinkInfoList,
} from '@/app/components'
import useApp from './useApp'
import { Env } from '@/app/type'
import { coreInfo } from './coreInfo'
import AppHeader from './AppHeader'


const envOptions = [
  { label: '开发环境', value: Env.dev },
  { label: '生产环境', value: Env.prod },
] satisfies Array<{ label: string, value: Env }>

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

      <Drawer
        title="系统面板"
        open={settingPanelOpen}
        onClose={closeSettingPanel}
        width={450}
      >
        <Form
          initialValues={coreInfo.getSettingFormInitialValue()}
          onValuesChange={partialValues => {
            coreInfo.syncSettingFormValue(partialValues)
          }}
        >
          <Form.Item label='暗黑模式'>
            <Switch />
          </Form.Item>
          <Form.Item label='环境' name='env'>
            <Radio.Group options={envOptions} onChange={e => toggleEnv(e.target.value)} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  )
}
