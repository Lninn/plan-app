import ClientApp from '@/app/client-app'
import { Layout } from 'antd';
import Header from './header';


export default async function Home() {
  return (
    <Layout
      style={{
        minHeight: '100%',
        maxWidth: 1280,
        margin: '0 auto',
      }}
    >
      <Header />
      <ClientApp />
    </Layout>
  );
}
