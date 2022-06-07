import { classNames } from '~/lib/classnames';

type HtmlViewProps = {
  html: string;
  className?: string;
};

export function HtmlView({ html, className }: HtmlViewProps) {
  return (
    <div
      className={classNames(
        'prose max-w-none text-sm text-gray-700 space-y-4',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
