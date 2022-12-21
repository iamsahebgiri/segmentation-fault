import { Avatar } from '~/components/avatar';
import type { Author } from '~/lib/types';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import Link from 'next/link';

type AuthorWithDateProps = {
  author: Author;
  date: Date;
};

export function AuthorWithDate({ author, date }: AuthorWithDateProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <Link href={`/profile/${author.id}`} className="relative inline-flex">
        <span className="hidden sm:flex">
          <Avatar name={author.name!} src={author.image} />
        </span>
        <span className="flex sm:hidden">
          <Avatar name={author.name!} src={author.image} size="sm" />
        </span>
      </Link>
      <div className="flex-1 text-sm">
        <div>
          <Link
            href={`/profile/${author.id}`}
            className="font-medium transition-colors hover:text-blue"
          >
            {author.name}
          </Link>
        </div>

        <p className="text-gray-500">
          <time dateTime={date.toISOString()}>{formatDistanceToNow(date)}</time>{' '}
          ago
        </p>
      </div>
    </div>
  );
}
