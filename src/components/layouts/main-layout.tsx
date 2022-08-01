import { ReactNode } from 'react';
import { BaseLayout } from '~/components/layouts/base-layout';

type MainLayoutProps = { children: ReactNode };

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <BaseLayout>
      <div className="py-10">
        <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
          {children}
        </div>
      </div>
    </BaseLayout>
  );
};
