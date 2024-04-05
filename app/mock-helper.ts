import mockjs from 'mockjs'
import { SelectProps } from 'antd'
import { type ILinkInfo } from "./type"
import { DefaultOptionType } from 'antd/es/select'


export function createMockDataList(count = 50): ILinkInfo[] {
  const template: Record<keyof ILinkInfo, string | string[]> = {
    id: '@guid',
    title: '@cword(3, 8)',
    url: '@url',
    icon: '@image(36x36)',
    categories: [],
    tags: ['英语', '语言学习', '翻译'],
  }

  const _key = `list|${count}`
  const { list } = mockjs.mock({
    [_key]: [template]
  })

  return list
}

export function createMockTagOptions(): DefaultOptionType[] {
  const mockRes = mockjs.mock({
    'list|40': [{
      'tag': '@cword(3, 8)',
    }]
  })
  const list: { tag: string }[] = mockRes.list

  const options = list.map(item => ({
    label: item.tag,
    value: item.tag,
  }))

  return options
}

export function getRandomIcon() {
  return mockjs.Random.image('36x36', '#5B8FF9')
}
