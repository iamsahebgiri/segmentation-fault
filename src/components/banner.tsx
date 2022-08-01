import { classNames } from '~/lib/classnames';
import * as React from 'react';

type BannerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Banner({ children, className }: BannerProps) {
  return (
    <div
      className={classNames(
        'p-6 font-semibold leading-snug border rounded bg-yellow-100 border-yellow-300',
        className,
      )}
    >
      {children}
    </div>
  );
}
