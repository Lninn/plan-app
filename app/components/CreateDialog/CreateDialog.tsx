import {
  Modal,
  Tabs,
  Form,
  Input,
  Cascader,
  Select,
  Button,
  type CascaderProps,
  type SelectProps,
  message
} from "antd"
import { useReducer } from "react"
import URLResolveDrawer from "./URLResolveDrawer"
import { type ILinkInfo } from "@/app/type"
import FormTable from "./FormTable"
import { LinkOutlined } from "@ant-design/icons"
import { getUUID } from "@/app/uuid"
import { getRandomIcon } from "@/app/mock-helper"


function createLinkRecord(
  {
    title,
    url,
    tags,
    categories,
  }: Pick<ILinkInfo, 'title' | 'url' | 'tags' | 'categories'>
): ILinkInfo {
  return {
    id: getUUID(),
    title,
    url,
    tags,
    categories,
    icon: getRandomIcon(),
  }
}

interface CreateDialogProps {
  open: boolean
  onClose: () => void
  categories: CascaderProps['options']
  tagOptions: SelectProps['options']
  submit: (record: ILinkInfo[]) => void
  isExist: (name: string) => boolean
}

interface CreateDialogState {
  drawerOpen: boolean
  activeKey: string
}

const initialState: CreateDialogState = {
  drawerOpen: false,
  activeKey: '1',
}

const reducer = (p: CreateDialogState, n: Partial<CreateDialogState>) => ({
  ...p,
  ...n,
})

export default function CreateDialog(
  {
    open,
    onClose,
    submit,
    categories,
    tagOptions,
    isExist,
  }: CreateDialogProps
) {

  const [state, dispatch] = useReducer(reducer, initialState)

  const [form] = Form.useForm()
  const [tableForm] = Form.useForm()
  
  const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 14 } }

  async function handleBatchSubmit() {
    try {
      const values = await tableForm.validateFields()
      const nextDataList: ILinkInfo[] = values.dataSource

      if (nextDataList.length === 0) {
        throw new Error('请至少添加一条数据');
      }

      onClose()
      tableForm.resetFields()

      submit(nextDataList)
    } catch (e) {
      if (e instanceof Error) {
        message.error(e.message)
      }
    }
  }

  async function handleSingleSubmit() {
    try {
      const values: Omit<ILinkInfo, 'icon' | 'id'> = await form.validateFields()
      const { title, url, categories, tags  } = values

      const nextDataList: ILinkInfo[] = [
        createLinkRecord({
          title: title.trim(),
          url: url.trim(),
          tags: tags || [],
          categories: categories || [],
        })
      ]

      onClose()
      form.resetFields()
      submit(nextDataList)
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

  return (
    <Modal
      title="数据导入"
      open={open}
      onCancel={onClose}
      width={800}
      maskClosable={false}
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
              <Form form={form} style={{ maxWidth: 600 }} {...formItemLayout}>
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
                <Form.Item label='分类' name='categories' rules={[{ required: true }]}>
                  <Cascader placeholder='请选择' options={categories} />
                </Form.Item>
                <Form.Item label='标签' name='tags' rules={[{ required: true }]}>
                  <Select mode='tags' placeholder='请选择' options={tagOptions} />
                </Form.Item>
              </Form>
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
                <Form form={tableForm} initialValues={{ 
                  dataSource: [createLinkRecord({
                    title: '',
                    url: '',
                    tags: [],
                    categories: []
                  })]
                   }}>
                  <Form.Item name='dataSource'>
                    <FormTable isExist={isExist} />
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

          const finalRecords = records.map(datum => {
            return createLinkRecord({
              ...datum,
              categories: [],
            })
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
