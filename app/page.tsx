import styles from "./page.module.css";
import ViewList from "./view-list";
import { queryList } from '@/app/api/categorizedTagLibrary/queryList'


async function getData() {
  try {
    const res = await queryList()
    const data = await res.json()
    console.log('res', data)
  } catch (error) {
    console.log('后端错误',error)
  }

  return []
}

export default async function Home() {
  const data = await getData()

  return (
    <main className={styles.main}>
      <div>Hello</div>

      <div>{JSON.stringify(data)}</div>

      <ViewList />
    </main>
  );
}
