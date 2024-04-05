import { useEffect, useReducer } from 'react'
import { createMockDataList, createMockTagOptions } from '@/app/mock-helper'
import { Env, type ILinkInfo } from '@/app/type'
import { type SelectProps, type CascaderProps } from 'antd'
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

const tagOptions: SelectProps['options'] = [
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
  [Env.dev]: createMockDataList(),
  [Env.prod]: [],
}

const categoriesMap: Record<Env, CascaderProps['options']> = {
  [Env.dev]: createMockCategores(),
  [Env.prod]: categories,
}

const tagOptionsMap: Record<Env, SelectProps['options']> = {
  [Env.dev]: createMockTagOptions(),
  [Env.prod]: tagOptions,
}

function switchDataSource(nextEnv: Env) {

  const nextData = dataMap[nextEnv]
  const nextCategories = categoriesMap[nextEnv]
  const nextTags = tagOptionsMap[nextEnv]

  return {
    dataSource: nextData,
    categories: nextCategories,
    tagOptions: nextTags
  }
}

interface State {
  createDialogOpen: boolean
  dataSource: ILinkInfo[]

  settingPanelOpen: boolean
  categories: CascaderProps['options']
  tagOptions: SelectProps['options']
}

const initialState: State = {
  createDialogOpen: false,
  settingPanelOpen: false,

  ...getInitialState(),
}

function getInitialState() {
  const { env } = coreInfo.getSettingFormInitialValue()

  const {
    dataSource,
    categories,
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

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey && e.key === 'k') {
        openAddDialog()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
  }, [])

  function appendList(records: ILinkInfo[]) {
    dispatch({
      dataSource: [...records, ...state.dataSource],
    })
  }

  function openAddDialog() {
    dispatch({ createDialogOpen: true })
  }

  function closeCreateDialog() {
    dispatch({ createDialogOpen: false })
  }

  function openSettingPanel() {
    dispatch({ settingPanelOpen: true })
  }

  function closeSettingPanel() {
    dispatch({ settingPanelOpen: false })
  }

  function toggleEnv(n: Env) {
    const s = switchDataSource(n)
    dispatch(s)
  }

  return {
    ...state,
    appendList,
    closeCreateDialog,
    openSettingPanel,
    closeSettingPanel,
    openAddDialog,
    toggleEnv,
  }
}
