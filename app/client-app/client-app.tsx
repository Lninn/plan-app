'use client'

import { useEffect } from 'react'
import useSWR from 'swr'
import { useStore } from '@/lib/store'
import { useShallow } from 'zustand/react/shallow'
import { Layout, Skeleton } from 'antd'
import { CreateDialog } from '@/app/components'
import CategorizedTagInfoList from './tag-category-info-list'
import SettingPanel from './setting-panel'
import { type CategorizedTagInfo } from '@/shared/type'
import { useCategory } from '@/hooks'
import { fetcher } from '../../shared/helper'


function useAppAction() {
  return useStore(
    useShallow((store) => ({
      createDialogOpen: store.createDialogOpen,
      settingPanelOpen: store.settingPanelOpen,
      showCreateDialog: () => store.changeCreateDialogOpen(true),
      closeCreateDialog: () => store.changeCreateDialogOpen(false),
      closeSettingPanel: () => store.changeSettingPanelOpen(false),
      setCategoryList: store.setCategoryList,

      tagOptions: store.tagOptions,
      setTagOptions: store.setTagOptions
    })),
  );
}

export default function ClientApp() {

  const {
    data: dataSource = [],
    isLoading,
  } = useSWR<CategorizedTagInfo[]>(
    '/api/categorizedTagLibrary',
    fetcher,
    { dedupingInterval: 0, revalidateOnFocus: false }
  );

  const {
    data: categoryData = [],
  } = useCategory()

  const {
    createDialogOpen,
    tagOptions,
    showCreateDialog,
    closeCreateDialog,
    settingPanelOpen,
    closeSettingPanel,
    setCategoryList,

    setTagOptions,
  } = useAppAction()

  useEffect(() => {
    if (!categoryData) return

    setCategoryList(categoryData)
  }, [JSON.stringify(categoryData)])

  useEffect(() => {
    const tags = dataSource.map(item => item.tags).flat()
    const tagSet = new Set(tags)

    const tagOptions = Array.from(tagSet).map(item => ({
      label: item,
      value: item
    }))

    setTagOptions(tagOptions)
  }, [JSON.stringify(dataSource)])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey && e.key === 'k') {
        showCreateDialog()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
  }, [])

  function isExist(name: string) {
    const i = dataSource.findIndex(item => item.title === name)
    return i !== -1
  }

  return (
    <Layout.Content style={{ padding: '16px 24px', marginTop: 24 }}>
      {isLoading ? (
        <>
          <Skeleton paragraph={{ rows: 10 }} active />
          <Skeleton paragraph={{ rows: 10 }} active />
          <Skeleton paragraph={{ rows: 10 }} active />
        </>
      ) : <CategorizedTagInfoList dataSource={dataSource} />}
      <CreateDialog
        open={createDialogOpen}
        tagOptions={tagOptions}
        isExist={isExist}
        onClose={closeCreateDialog}
        categoryList={categoryData}
      />

      <SettingPanel
        open={settingPanelOpen}
        onClose={closeSettingPanel}
        toggleEnv={() => {}}
      />
    </Layout.Content>
  )
}
