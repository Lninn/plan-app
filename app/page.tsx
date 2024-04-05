import ClientApp from '@/app/client-app'
import { Suspense } from 'react';
import Nav from './nav';


export default async function Home() {
  return (
    <>
      <Suspense>
        <Nav />
      </Suspense>
      <ClientApp />
    </>
  );
}
