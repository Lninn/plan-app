import { queryList } from '@/app/api/categorizedTagLibrary/queryList';
import { StoreProvider } from '@/lib/playgroundStore';
import DataTable from './data-table';
import { foramtDatetime } from '@/shared/date';


async function getData() {
  const data = await queryList();
  if (!data) return []

  const parsedData = data.map((item) => {
    const {
      _id,
      title,
      icon,
      url,
      tags,
      categories,
      createdAt,
      updatedAt, 
    } = item;

    return {
      id: _id,
      title,
      icon,
      url,
      tags,
      categories,
      createdAt: foramtDatetime(createdAt),
      updatedAt: foramtDatetime(updatedAt),
    };
  });

  return parsedData;
}


export default async function CategorizedTagLibrary() {
  const data = await getData();

  return (
    <StoreProvider lastUpdate={new Date().getTime()}>
      <DataTable data={data} />
    </StoreProvider>
  );
}
