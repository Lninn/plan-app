import style from './AppHeader.module.css'

import { Button, Cascader, Form, Input, Select, Space } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { categories } from "../category";
import { Command } from "../components";
import { type DefaultOptionType } from 'antd/es/select'


interface AppHeaderProps {
  openAddDialog: () => void
  openSettingPanel: () => void
  tagOptions: DefaultOptionType[]
}

export default function AppHeader(
  {
    openAddDialog,
    openSettingPanel,
    tagOptions
  }: AppHeaderProps
) {
  const [filterForm] = Form.useForm()

  return (
    <div className={style.appHeader}>
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
                <div className={style.shortKey}>
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
  )
}
