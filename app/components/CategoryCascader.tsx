import { Cascader, type CascaderProps } from "antd";
import useSWR from "swr";
import { fetcher } from "../helper";

  
export default function CategoryCascader(props: CascaderProps) {
  const { data, isLoading } = useSWR('/api/category', fetcher)

  return (
    <Cascader {...props} placeholder='请选择' options={data} loading={isLoading} />
  )
}
