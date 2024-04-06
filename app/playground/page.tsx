import ClientApp from './client'
import { StoreProvider } from '@/lib/playgroundStore';
import Nav from './nav';


export default async function Playground() {
  return (
    <StoreProvider lastUpdate={new Date().getTime()}>
      <Nav />
      <ClientApp />
    </StoreProvider>
  );
}
