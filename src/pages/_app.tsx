import React from 'react';
import { SessionProvider, signIn, useSession } from 'next-auth/react';
import { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NextPageWithAuthAndLayout } from '~/lib/types';
import { trpc } from '~/utils/trpc';
import '~/styles/globals.css';

type AppPropsWithAuthAndLayout = AppProps & {
  Component: NextPageWithAuthAndLayout;
};

const queryClient = new QueryClient();

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithAuthAndLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session} refetchOnWindowFocus={false}>
        <>
          {Component.auth ? (
            <Auth>{getLayout(<Component {...pageProps} />)}</Auth>
          ) : (
            getLayout(<Component {...pageProps} />)
          )}
          <Toaster />
        </>
      </SessionProvider>
    </QueryClientProvider>
  );
}

function Auth({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const isUser = !!session?.user;
  React.useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!isUser) signIn(); // If not authenticated, force log in
  }, [isUser, status]);

  if (isUser) {
    return <>{children}</>;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return null;
}

export default trpc.withTRPC(MyApp);
