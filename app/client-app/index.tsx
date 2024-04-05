'use client'

import './index.css'

import { Button, Cascader, Drawer, Form, Input, Radio, Select, Space, Switch } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
// import CreateDialog from '@/app/components/CreateDialog'
// import LinkInfoList from './LinkInfoList'
import {
  CreateDialog,
  LinkInfoList,
  Command,
} from '@/app/components'
import useApp from './useApp'
import { Env } from '@/app/type'
import { coreInfo } from './coreInfo'


const envOptions = [
  { label: '开发环境', value: Env.dev },
  { label: '生产环境', value: Env.prod },
] satisfies Array<{ label: string, value: Env }>

function App() {
 
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

  const [filterForm] = Form.useForm()

  return (
    <div className="App">

      <div className='App-header'>
        <Form form={filterForm} layout='inline'>
          <Form.Item label='关键词'>
            <Input placeholder='请输入关键词' />
          </Form.Item>
          <Form.Item label='分类'>
            <Cascader placeholder='请选择' options={categories} />
          </Form.Item>
          <Form.Item label='标签'>
            <Select placeholder='请选择' options={tagOptions} style={{ width: 160 }} />
          </Form.Item>
          <Form.Item style={{ marginInlineStart: 'auto' }}>
            <Space>
              <Button
                type='text'
                icon={(
                  <div className='short-key'>
                    <Command />
                    <span>K</span>
                  </div>
                )}
                onClick={openAddDialog}
              >
                创建
              </Button>
              <Button
                type='text'
                onClick={openSettingPanel}
                icon={<SettingOutlined style={{ fontSize: 16 }} />}
              >
                设置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>

      <div className="App-body">
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

export default App
