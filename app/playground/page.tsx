import { Table } from "antd";
import CreateDialog from "./CreateDialog";
import Nav from './nav'

export default async function Playground() {
  return (
    <div>
      <Nav />
      
      <main>
        <Table dataSource={[]} />
      </main>
      
      <CreateDialog />
    </div>
  );
}
