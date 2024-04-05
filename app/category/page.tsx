import { Button, Table } from "antd";
import CreateDialog from "./CreateDialog";


export default async function Category() {
  return (
    <div>
      <div>
        <Button>添加分类</Button>
      </div>
      <Table dataSource={[]} />
      <CreateDialog />
    </div>
  );
}
