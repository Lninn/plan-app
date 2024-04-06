'use client'

import style from './app-header.module.css'

import { Button, Cascader, Form, Input, Select, Space } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { Command } from "@/app/components";
import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';


function useHeaderAction() {
  return useStore(
    useShallow((store) => ({
      categoryList: store.categoryList,
      showCreateModal: () => store.changeCreateDialogOpen(true),
      showSettingPanel: () => store.changeSettingPanelOpen(true),
      tagOptions: store.tagOptions,
    })),
  );
}

export default function AppHeader() {
  const {
    tagOptions,
    categoryList,
    showCreateModal,
    showSettingPanel,
  } = useHeaderAction()

  const [form] = Form.useForm()

  return (
    <div className={style.appHeader}>
      <Form form={form} layout='inline'>
        <Form.Item label='关键词'>
          <Input placeholder='请输入关键词' />
        </Form.Item>
        <Form.Item label='分类'>
          <Cascader placeholder='请选择' options={categoryList} />
        </Form.Item>
        <Form.Item label='标签'>
          <Select
            placeholder='请选择'
            options={tagOptions}
            style={{ width: 160 }}
            showSearch
          />
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
              onClick={showCreateModal}
            >
              创建
            </Button>
            <Button
              type='text'
              onClick={showSettingPanel}
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
