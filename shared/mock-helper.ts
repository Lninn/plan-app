import mockjs from 'mockjs'
import { type CategorizedTagInfo } from "./type"
import { DefaultOptionType } from 'antd/es/select'
import { CategoryUtil, type ICategoryOption } from './category-util'


export function createCategorizedTag(
  { categoryList  }:{ categoryList: DefaultOptionType[] }
): CategorizedTagInfo {

  const {
    firstCategory,
    secondCategory,
  } = CategoryUtil.getRandomCategoryPair(categoryList as ICategoryOption[])

  const template: CategorizedTagInfo = {
    id: '@guid',
    title: '@cword(3, 8)',
    url: '@url',
    icon: '@image(36x36)',
    categories: [firstCategory, secondCategory],
    tags: ['测试标签1',],
  }

  return mockjs.mock(template)
}

export function getRandomIcon() {
  return mockjs.Random.image('36x36', '#5B8FF9')
}

export function getFinalTagCategoryInfo(partialInfo: Pick<CategorizedTagInfo, 'title' | 'url' | 'tags'>) {
  const { title, url, tags } = partialInfo

  const template: CategorizedTagInfo = {
    id: '@guid',
    icon: '@image(36x36)',
    title,
    url,
    tags,
    categories: [],
  }

  return mockjs.mock(template)
}

export function createEmptyTagCategoryInfo() {
  const template: CategorizedTagInfo = {
    id: '@guid',
    icon: getRandomIcon(),
    title: '',
    url: '',
    tags: [],
    categories: [],
  }

  return mockjs.mock(template)
}
