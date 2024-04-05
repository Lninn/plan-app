import Nav from './nav'
import ClientApp from './client'
import { StoreProvider } from '@/lib/playgroundStore';


export default async function Playground() {
  return (
    <StoreProvider lastUpdate={new Date().getTime()}>
      <Nav />

      <main>
        <ClientApp />
      </main>
    </StoreProvider>
  );
}
