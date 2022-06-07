import { classNames } from '~/lib/classnames';
import * as React from 'react';

export type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = {
  variant?: ButtonVariant;
  responsive?: boolean;
  isLoading?: boolean;
  loadingChildren?: React.ReactNode;
} & React.ComponentPropsWithoutRef<'button'>;

export function buttonClasses({
  className,
  variant = 'primary',
  isLoading,
  disabled,
}: ButtonProps) {
  return classNames(
    'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm',
    variant === 'primary' &&
      'text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
    variant === 'secondary' &&
      'border text-primary border-secondary bg-primary hover:bg-secondary',
    (disabled || isLoading) && 'opacity-50 cursor-default',
    className,
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      responsive,
      type = 'button',
      isLoading = false,
      loadingChildren,
      disabled,
      children,
      ...rest
    },
    forwardedRef,
  ) => {
    return (
      <button
        {...rest}
        ref={forwardedRef}
        type={type}
        disabled={disabled || isLoading}
        className={buttonClasses({
          className,
          disabled,
          variant,
          responsive,
          isLoading,
        })}
      >
        {isLoading && 'Loading'}
        {isLoading && loadingChildren ? loadingChildren : children}
      </button>
    );
  },
);

Button.displayName = 'Button';
