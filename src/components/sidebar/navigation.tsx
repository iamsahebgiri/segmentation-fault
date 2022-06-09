import React from 'react';
import { Icon } from '@iconify/react';
import arrowTrending24Regular from '@iconify/icons-fluent/arrow-trending-24-regular';
import home24Regular from '@iconify/icons-fluent/home-24-regular';
import peopleCommunity24Regular from '@iconify/icons-fluent/people-community-24-regular';
import ribbon24Regular from '@iconify/icons-fluent/ribbon-24-regular';
import { classNames } from '~/lib/classnames';

const navigation = [
  { name: 'Home', href: '#', icon: home24Regular, current: true },
  { name: 'Popular', href: '#', icon: ribbon24Regular, current: false },
  {
    name: 'Communities',
    href: '#',
    icon: peopleCommunity24Regular,
    current: false,
  },
  { name: 'Trending', href: '#', icon: arrowTrending24Regular, current: false },
];

const communities = [
  { name: 'Movies', href: '#' },
  { name: 'Food', href: '#' },
  { name: 'Sports', href: '#' },
  { name: 'Animals', href: '#' },
  { name: 'Science', href: '#' },
  { name: 'Dinosaurs', href: '#' },
  { name: 'Talents', href: '#' },
  { name: 'Gaming', href: '#' },
];

export default function Navigation() {
  return (
    <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
      <nav
        aria-label="Sidebar"
        className="sticky top-4 divide-y divide-gray-300"
      >
        <div className="pb-8 space-y-1">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={classNames(
                item.current
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50',
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md',
              )}
              aria-current={item.current ? 'page' : undefined}
            >
              <Icon
                icon={item.icon}
                className={classNames(
                  item.current
                    ? 'text-gray-500'
                    : 'text-gray-400 group-hover:text-gray-500',
                  'flex-shrink-0 -ml-1 mr-3 h-6 w-6',
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </a>
          ))}
        </div>
        <div className="pt-10">
          <p
            className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
            id="communities-headline"
          >
            My communities
          </p>
          <div
            className="mt-3 space-y-2"
            aria-labelledby="communities-headline"
          >
            {communities.map((community) => (
              <a
                key={community.name}
                href={community.href}
                className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
              >
                <span className="truncate">{community.name}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
