import { Popover } from '@headlessui/react';
import alert24Regular from '@iconify/icons-fluent/alert-24-regular';
import arrowTrending24Regular from '@iconify/icons-fluent/arrow-trending-24-regular';
import dismiss24Regular from '@iconify/icons-fluent/dismiss-24-regular';
import home24Regular from '@iconify/icons-fluent/home-24-regular';
import navigation24Regular from '@iconify/icons-fluent/navigation-24-regular';
import peopleCommunity24Regular from '@iconify/icons-fluent/people-community-24-regular';
import ribbon24Regular from '@iconify/icons-fluent/ribbon-24-regular';
import search24Regular from '@iconify/icons-fluent/search-24-regular';
import { Icon } from '@iconify/react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ButtonLink } from '~/components/button-link';
import {
  Menu,
  MenuButton,
  MenuItemButton,
  MenuItemLink,
  MenuItems,
  MenuItemsContent,
} from '~/components/menu';
import { classNames } from '~/lib/classnames';
import { Avatar } from '~/components/avatar';

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
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
];

type BaseLayoutProps = { children: ReactNode };

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <>
      <div className="min-h-full">
        {/* When the mobile menu is open, add `overflow-hidden` to the `body` element to prevent double scrollbars */}
        <Popover
          as="header"
          className={({ open }) =>
            classNames(
              open ? 'fixed inset-0 z-40 overflow-y-auto' : '',
              'bg-white shadow-sm lg:static lg:overflow-y-visible',
            )
          }
        >
          {({ open }) => (
            <>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex justify-between xl:grid xl:grid-cols-12 lg:gap-8">
                  <div className="flex md:absolute md:left-0 md:inset-y-0 lg:static xl:col-span-2">
                    <div className="flex-shrink-0 flex items-center">
                      <Link href="/">
                        <img
                          className="block h-8 w-auto"
                          src="https://tailwindui.com/img/logos/workflow-mark.svg?color=red&shade=500"
                          alt="Workflow"
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
                    <div className="flex items-center px-6 py-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">
                      <div className="w-full">
                        <label htmlFor="search" className="sr-only">
                          Search
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                            <Icon
                              icon={search24Regular}
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            id="search"
                            name="search"
                            className="block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                            placeholder="Search segmentation fault"
                            type="search"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center md:absolute md:right-0 md:inset-y-0 lg:hidden">
                    {/* Mobile menu button */}
                    <Popover.Button className="-mx-2 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500">
                      <span className="sr-only">Open menu</span>
                      {open ? (
                        <Icon
                          icon={dismiss24Regular}
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Icon
                          icon={navigation24Regular}
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Popover.Button>
                  </div>
                  <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
                    <a
                      href="#"
                      className="ml-5 flex-shrink-0 bg-white rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                    >
                      <span className="sr-only">View notifications</span>
                      <Icon
                        icon={alert24Regular}
                        className="h-6 w-6"
                        aria-hidden="true"
                      />
                    </a>

                    {/* Profile dropdown */}
                    {session ? (
                      <Menu>
                        <MenuButton className="bg-white rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
                          <Avatar
                            name={session.user.name}
                            src={session.user.image}
                            size="sm"
                          />
                        </MenuButton>
                        <MenuItems className="w-48">
                          <MenuItemsContent>
                            <MenuItemLink href={`/profile/${session?.user.id}`}>
                              Profile
                            </MenuItemLink>
                            <MenuItemButton onClick={() => signOut()}>
                              Log out
                            </MenuItemButton>
                          </MenuItemsContent>
                        </MenuItems>
                      </Menu>
                    ) : null}

                    {session ? (
                      <ButtonLink href="/ask" className="ml-6">
                        Ask Question
                      </ButtonLink>
                    ) : (
                      <ButtonLink href="/api/auth/signin" className="ml-6">
                        Login
                      </ButtonLink>
                    )}
                  </div>
                </div>
              </div>

              <Popover.Panel as="nav" className="lg:hidden" aria-label="Global">
                <div className="max-w-3xl mx-auto px-2 pt-2 pb-3 space-y-1 sm:px-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={item.current ? 'page' : undefined}
                      className={classNames(
                        item.current
                          ? 'bg-gray-100 text-gray-900'
                          : 'hover:bg-gray-50',
                        'block rounded-md py-2 px-3 text-base font-medium',
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="max-w-3xl mx-auto px-4 flex items-center sm:px-6">
                    <div className="flex-shrink-0">
                      {user?.image ? (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user?.image}
                          alt={user.name}
                        />
                      ) : null}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {user?.name}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {user?.email}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="ml-auto flex-shrink-0 bg-white rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                    >
                      <span className="sr-only">View notifications</span>
                      <Icon
                        icon={alert24Regular}
                        className="h-6 w-6"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                  <div className="mt-3 max-w-3xl mx-auto px-2 space-y-1 sm:px-4">
                    {userNavigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="mt-6 max-w-3xl mx-auto px-4 sm:px-6">
                  <a
                    href="#"
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700"
                  >
                    New Post
                  </a>

                  <div className="mt-6 flex justify-center">
                    <a
                      href="#"
                      className="text-base font-medium text-gray-900 hover:underline"
                    >
                      Go Premium
                    </a>
                  </div>
                </div>
              </Popover.Panel>
            </>
          )}
        </Popover>

        {children}
      </div>

      {process.env.NODE_ENV !== 'production' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </>
  );
};
