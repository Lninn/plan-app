import { useReducer } from 'react'
import { createMockTagOptions } from '@/app/mock-helper'
import { Env, type ILinkInfo } from '@/app/type'
import { type CascaderProps, } from 'antd'
import { type DefaultOptionType } from 'antd/es/select'
import { categories, createMockCategores } from '@/app/category'
import { coreInfo } from './coreInfo'


// const realList: ILinkInfo[] = [
//   {
//     id: getUUID(),
//     title: 'Linggle',
//     url: 'https://linggle.com',
//     icon: 'https://besticon-demo.herokuapp.com/icon?size=80..120..200&url=linggle.com',
//     categories: [],
//     tags: ['英语', '语言学习', '翻译']
//   },
//   {
//     id: getUUID(),
//     title: 'Netspeak',
//     url: 'https://netspeak.org',
//     icon: 'https://besticon-demo.herokuapp.com/icon?size=80..120..200&url=netspeak.org',
//     categories: [],
//     tags: ['英语', '语言学习', '翻译'],
//   },
//   {
//     id: getUUID(),
//     title: '知乎',
//     url: 'https://www.zhihu.com',
//     icon: 'https://besticon-demo.herokuapp.com/icon?size=80..120..200&url=www.zhihu.com',
//     categories: [],
//     tags: ['问答社区']
//   }
// ]

const tagOptions: DefaultOptionType[] = [
  {
    value: '英语',
    label: '英语',
  },
  {
    value: '语言学习',
    label: '语言学习',
  },
  {
    value: '翻译',
    label: '翻译',
  },
  {
    value: '问答社区',
    label: '问答社区',
  }
]

const dataMap: Record<Env, ILinkInfo[]> = {
  [Env.dev]: [],
  [Env.prod]: [],
}

const tagOptionsMap: Record<Env, DefaultOptionType[]> = {
  [Env.dev]: createMockTagOptions(),
  [Env.prod]: tagOptions,
}

function switchDataSource(nextEnv: Env) {

  const nextData = dataMap[nextEnv]
  const nextTags = tagOptionsMap[nextEnv]

  return {
    dataSource: nextData,
    tagOptions: nextTags
  }
}

interface State {
  dataSource: ILinkInfo[]
  tagOptions: DefaultOptionType[]
}

const initialState: State = {
  

  ...getInitialState(),
}

function getInitialState() {
  const { env } = coreInfo.getSettingFormInitialValue()

  const {
    dataSource,
    tagOptions,
  } = switchDataSource(env)

  return {
    dataSource,
    categories,
    tagOptions,
  }
}

function reducer(p: State, n: Partial<State>) {
  return {
    ...p,
    ...n,
  }
}

export default function useApp() {
  const [state, dispatch] = useReducer(reducer, initialState)

  function appendList(records: ILinkInfo[]) {
    dispatch({
      dataSource: [...records, ...state.dataSource],
    })
  }

  function toggleEnv(n: Env) {
    const s = switchDataSource(n)
    dispatch(s)
  }

  return {
    ...state,
    appendList,
    toggleEnv,
  }
}
