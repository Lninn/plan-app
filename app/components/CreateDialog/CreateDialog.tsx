"use client"

import {
  Modal,
  Tabs,
  Form,
  Input,
  Select,
  Button,
  type SelectProps,
  message,
  Space,
  Cascader,
  Skeleton,
  Badge,
  Tooltip,
  FormInstance
} from "antd"
import { ChangeEvent, ChangeEventHandler, useReducer } from "react"
import URLResolveDrawer from "./URLResolveDrawer"
import { type CategorizedTagInfo } from "@/shared/type"
import FormTable from "./FormTable"
import { LinkOutlined, QuestionCircleOutlined } from "@ant-design/icons"
// import { getUUID } from "@/shared/uuid"
import {
  createCategorizedTag,
  createEmptyTagCategoryInfo,
  getFinalTagCategoryInfo,
  getRandomIcon
} from "@/shared/mock-helper"
import { DefaultOptionType } from "antd/es/select"
import useSWRMutation from "swr/mutation"
import React from "react"


async function requestCreator(url: string, { arg }: { arg: { list: CategorizedTagInfo[] }}) {
  const formatedList = arg.list.map(({ id, ...restInfo }) => restInfo)

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({ list: formatedList })
  }).then(res => res.json())
}

interface CreateDialogProps {
  open: boolean
  onClose: () => void
  tagOptions: SelectProps['options']
  categoryList: DefaultOptionType[]
  isExist: (name: string) => boolean
}

interface CreateDialogState {
  drawerOpen: boolean
  activeKey: string
  imageLoading: boolean
}

const initialState: CreateDialogState = {
  drawerOpen: false,
  activeKey: '1',
  imageLoading: false,
}

const reducer = (p: CreateDialogState, n: Partial<CreateDialogState>) => ({
  ...p,
  ...n,
})

export default function CreateDialog(
  {
    open,
    onClose,
    tagOptions,
    categoryList,
    isExist,
  }: CreateDialogProps
) {

  const [state, dispatch] = useReducer(reducer, initialState)

  const [form] = Form.useForm()
  const [tableForm] = Form.useForm()
  
  const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 14 } }

  const { trigger, isMutating } = useSWRMutation(
    '/api/categorizedTagLibrary',
    requestCreator
  )

  async function createTagCategoryProcess(list: CategorizedTagInfo[]) {
    try {
      const res = await trigger({ list })
      if (res.ok) {
        onClose()
        message.success('创建成功', 1, () => {
          resetFormState()
        })
      } else {
        throw new Error(res.msg)
      }
    } catch (errorInfo) {
      if (errorInfo instanceof Error) {
        message.error(errorInfo.message)
      }
    }
  }

  async function handleBatchSubmit() {
    try {
      const values = await tableForm.validateFields()
      const nextDataList: CategorizedTagInfo[] = values.dataSource

      if (nextDataList.length === 0) {
        throw new Error('请至少添加一条数据');
      }

      await createTagCategoryProcess(nextDataList)
    } catch (e) {
      if (e instanceof Error) {
        message.error(e.message)
      }
    }
  }

  async function handleSingleSubmit() {
    try {
      const values: Omit<CategorizedTagInfo, 'id'> = await form.validateFields()
      const { title, icon, url, categories, tags } = values

      const nextDataList: CategorizedTagInfo[] = [
        { id: '', icon, title, url, categories, tags }
      ]

      await createTagCategoryProcess(nextDataList)
    } catch (e) {
      //
    }
  }

  async function handleAddSubmit() {
    if (state.activeKey === '1') {
      handleSingleSubmit()
    } else {
      handleBatchSubmit()
    }
  }

  function resetFormState() {
    if (state.activeKey === '1') {
      form.resetFields()
    } else {
      tableForm.resetFields()
    }
  }

  function autoFillRandomValues() {
    const randomTagCategory = createCategorizedTag({
      categoryList,
    })

    const {
      title,
      url,
      icon,
      categories,
      tags,
    } = randomTagCategory
  
    form.setFieldsValue({
      title,
      url,
      icon,
      categories,
      tags,
    })
  }

  return (
    <Modal
      title="数据导入"
      open={open}
      onCancel={onClose}
      width={800}
      maskClosable={false}
      confirmLoading={isMutating}
      onOk={handleAddSubmit}
    >
      <Tabs
        activeKey={state.activeKey}
        centered
        onChange={k => dispatch({ activeKey: k })}
        items={[
          {
            label: '添加数据',
            key: '1',
            children: (
              <div>
                <div style={{ marginBlockEnd: 16, textAlign: 'right' }}>
                  <Space>
                    <Button onClick={autoFillRandomValues}>自动填充随机值</Button>
                  </Space>
                </div>

                <Form
                  form={form}
                  {...formItemLayout}
                  // style={{ maxWidth: 600 }}
                >
                  <Form.Item
                    label='名称'
                    name='title'
                    rules={[
                      { required: true, },
                      () => ({
                        validator(_, value) {
                          if (isExist(value)) {
                            return Promise.reject(new Error('名称已存在'))
                          }
                          return Promise.resolve()
                        },
                      }),
                    ]}
                  >
                    <Input autoFocus placeholder='请输入' />
                  </Form.Item>
                  <Form.Item label='网址' name='url' rules={[{ required: true }]}>
                    <Input placeholder='请输入' type='url' />
                  </Form.Item>
                  <Form.Item label="图标" name='icon' rules={[{ required: true }]}>
                    <IconPreview form={form} imageLoading={state.imageLoading} />
                  </Form.Item>
                  <Form.Item label='分类' name='categories' rules={[{ required: true }]}>
                    <Cascader placeholder='请选择' options={categoryList} />
                  </Form.Item>
                  <Form.Item label='标签' name='tags' rules={[{ required: true }]}>
                    <Select mode='tags' placeholder='请选择' options={tagOptions} />
                  </Form.Item>
                </Form>
              </div>
            ),
          },
          {
            label: '批量处理',
            key: '2',
            children: (
              <div>
                <Form>
                  <Form.Item style={{ textAlign: 'right' }}>
                    <Button
                      type='primary'
                      icon={<LinkOutlined />}
                      onClick={() => dispatch({ drawerOpen: true })}
                    >
                      数据导入面板
                    </Button>
                  </Form.Item>
                </Form>
                <Form
                  form={tableForm}
                  initialValues={{
                    dataSource: [ createEmptyTagCategoryInfo() ]
                   }}
                  >
                  <Form.Item name='dataSource'>
                    <FormTable isExist={isExist} categoryList={categoryList} tagOptions={tagOptions} />
                  </Form.Item>
                </Form>
              </div>
            ),
          }
        ]}
      />

      <URLResolveDrawer
        open={state.drawerOpen}
        onClose={() => dispatch({ drawerOpen: false })}
        submit={records => {
          const finalRecords: CategorizedTagInfo[] = records.map(datum => {
            return getFinalTagCategoryInfo(datum)
          })

          console.log('[URLResolveDrawer-submit] ', {
            records,
            finalRecords,
          })

          tableForm.setFieldValue('dataSource', finalRecords)
        }}
      />
    </Modal>
  )
}

interface IconPreviewProps {
  value?: string;
  onChange?: (value: string) => void;
  imageLoading: boolean;
  form: FormInstance
}

async function iconRequestCreator(url: string, { arg }: { arg: { source: string }}) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg)
  }).then(res => res.json())
}

function IconPreview ({
  value,
  onChange,
  imageLoading,
  form,
} : IconPreviewProps) {
  const inputUrl = Form.useWatch('url', form)
  const prevRef = React.useRef({ prevInputString: '' })

  const { trigger, isMutating } = useSWRMutation(
    '/api/favicon',
    iconRequestCreator
  )

  async function syncFavicon() {
    if (!inputUrl) {
      message.warning('请先填写网址')
      return
    }

    prevRef.current.prevInputString = inputUrl
    const res = await trigger({ source: inputUrl })
    if (res.ok) {
      const url = res.data.url
      if (onChange) {
        onChange(url);
      }
    }
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const url = e.target.value;
    if (onChange) {
      onChange(url);
    }
  }

  function renderIcon() {
    if (imageLoading || !value) {
      return <Skeleton.Image active={imageLoading} />
    }

    return (
      <img
        src={value}
        width={96}
        height={96}
        alt="favicons"
      />
    )
  }

  function isBtnDisabled() {
    if (!inputUrl) return true

    if (imageLoading) return false

    if (inputUrl === prevRef.current.prevInputString) return true

    return false
  }

  return (
    <>
      <div style={{ display: 'flex', gap: 16 }}>
        <Input value={value} onChange={onInputChange} placeholder='图标连接不支持编辑' readOnly />
        <div style={{ display: 'inline-flex', gap: 8 }}>
          <Button
            loading={isMutating}
            type='primary'
            disabled={isBtnDisabled()}
            onClick={syncFavicon}
          >
            同步 Favicon
          </Button>
          <Tooltip title='图标需要手动同步。图标连接不支持手动输入，点击同步后自动解析，如果失败则使用默认图片'>
            <QuestionCircleOutlined style={{ flexShrink: 0 }} />
          </Tooltip>
        </div>
      </div>
      <div style={{ marginTop: 8 }}>
        {renderIcon()}
      </div>
    </>
  )
}
