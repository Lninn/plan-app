import { Table, Form, Input, Cascader, Select, Button } from "antd"
import { categories } from "@/app/category"
import { type ILinkInfo } from "@/app/type"
import { type ColumnsType } from "antd/es/table"


interface FormTableProps {
  value?: ILinkInfo[]
  onChange?: (value: ILinkInfo[]) => void
  isExist: (name: string) => boolean
}

export default function FormTable(
  {
    value,
    onChange,
    isExist,
  }: FormTableProps
) {
  function removeById(id: string) {
    if (!value || !onChange) return

    const newDataSource = value.filter(({ id: itemId }) => itemId !== id)
    onChange(newDataSource)
  }

  const columns: ColumnsType<ILinkInfo>  = [
    {
      title: '名称',
      dataIndex: 'title',
      key: 'title',
      render(_, __, idx) {
        return (
          <Form.Item
            name={['dataSource', idx, 'title']}
            style={{ marginBlock: 0 }}
            rules={[
              { required: true },
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
            <Input placeholder='请输入' />
          </Form.Item>
        )
      }
    },
    {
      title: '分类',
      dataIndex: 'categories',
      key: 'categories',
      render(_, __, idx) {
        return (
          <Form.Item
            name={['dataSource', idx, 'categories']}
            style={{ marginBlock: 0 }}
            rules={[{ required: true }]}
          >
            <Cascader placeholder='请选择' options={categories} />
          </Form.Item>
        )
      }
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render(_, __, idx) {
        return (
          <Form.Item
            name={['dataSource', idx, 'tags']}
            style={{ marginBlock: 0 }}
            rules={[{ required: true }]}
          > 
            <Select mode='tags' placeholder='请选择' />
          </Form.Item>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render(_, { id }) {
        return (
          <Button type='link' onClick={() => removeById(id)}>删除</Button>
        )
      }
    }
  ]
  return (
    <Table
      rowKey='id'
      dataSource={value}
      columns={columns}
    />
  )
}
