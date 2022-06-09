import Image from 'next/image';
import * as React from 'react';

type AvatarSize = 'sm' | 'md' | 'lg';

type AvatarProps = {
  size?: AvatarSize;
  name: string;
  src?: string | null;
};

const dimension: Record<AvatarSize, number> = {
  sm: 34,
  md: 40,
  lg: 128,
};

export function Avatar({ size = 'md', name, src }: AvatarProps) {
  return (
    <div className="inline-flex flex-shrink-0 rounded-full">
      {src ? (
        <Image
          src={src}
          alt={name}
          layout="fixed"
          width={dimension[size]}
          height={dimension[size]}
          className="object-cover rounded-full"
        />
      ) : (
        <img
          src={`/api/avatar?name=${encodeURIComponent(name)}`}
          alt={name}
          width={dimension[size]}
          height={dimension[size]}
        />
      )}
    </div>
  );
}
