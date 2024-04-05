import { Drawer, Form, Switch, Radio } from "antd"
import { coreInfo } from "./coreInfo"
import { Env } from "../type"


interface SettingPanelProps {
  open: boolean
  onClose: () => void
  toggleEnv: (env: Env) => void
}

const envOptions = [
  { label: '开发环境', value: Env.dev },
  { label: '生产环境', value: Env.prod },
] satisfies Array<{ label: string, value: Env }>

export default function SettingPanel(
  {
    open,
    onClose,
    toggleEnv
  }: SettingPanelProps
) {
  return(
    <Drawer
      title="系统面板"
      open={open}
      onClose={onClose}
      width={450}
    >
      <Form
        initialValues={coreInfo.getSettingFormInitialValue()}
        onValuesChange={partialValues => {
          coreInfo.syncSettingFormValue(partialValues)
        }}
      >
        <Form.Item label='暗黑模式'>
          <Switch />
        </Form.Item>
        <Form.Item label='环境' name='env'>
          <Radio.Group options={envOptions} onChange={e => toggleEnv(e.target.value)} />
        </Form.Item>
      </Form>
    </Drawer>
  )
}
