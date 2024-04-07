import ClientApp from '@/app/client-app'
import { Layout } from 'antd';
import Header from './header';


export default async function Home() {
  const style: Record<string, string | number> = {
    minHeight: '100%',
    maxWidth: 1280,
    margin: '0 auto',
    '--ant-layout-body-bg': 'var(--surface-1)',
  };

  return (
    <Layout style={style} >
      <Header />
      <ClientApp />
    </Layout>
  );
}
