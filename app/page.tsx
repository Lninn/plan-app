import ClientApp from '@/app/client-app'
import { Layout } from 'antd';
import Header from './header';


export default async function Home() {
  return (
    <Layout style={{ height: '100%' }}>
      <Header />
      <ClientApp />
    </Layout>
  );
}
