import { fetcher } from '@/shared/helper'
import { DefaultOptionType } from 'antd/es/select'
import useSWR from 'swr'


export default function useCategory() {
  return useSWR<DefaultOptionType[]>('/api/category', fetcher)
}
