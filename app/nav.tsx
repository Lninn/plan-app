import { DefaultOptionType } from "antd/es/select";
import { AppHeader } from "./components";

interface NavProps {
  openAddDialog: () => void
  openSettingPanel: () => void
  tagOptions: DefaultOptionType[]
}

export default function Nav(props: NavProps) {
  return <AppHeader {...props} />
}
