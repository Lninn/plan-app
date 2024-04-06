import { Table, Form, Input, Select, Button, Cascader } from "antd"
import { type CategorizedTagInfo } from "@/app/type"
import { type ColumnsType } from "antd/es/table"
import { DefaultOptionType } from "antd/es/select"


interface FormTableProps {
  value?: CategorizedTagInfo[]
  onChange?: (value: CategorizedTagInfo[]) => void
  isExist: (name: string) => boolean
  categoryList: DefaultOptionType[]
}

export default function FormTable(
  {
    value,
    onChange,
    isExist,
    categoryList,
  }: FormTableProps
) {
  function removeById(id: string) {
    if (!value || !onChange) return

    const newDataSource = value.filter(({ id: itemId }) => itemId !== id)
    onChange(newDataSource)
  }

  const columns: ColumnsType<CategorizedTagInfo>  = [
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
            <Cascader placeholder='请选择' options={categoryList} />
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
